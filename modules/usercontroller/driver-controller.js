const DriverModel = require("../../models/driver-model");

const jwt = require("jsonwebtoken");

const {
	generateUUID,
	generateOtp,
	generateFiveCharOtp,
} = require("../utils/utils-class");
const { hashData, compareHashData } = require("../utils/encrypt");
const { sendDriverOtp } = require("../email-controller");
const VehicleModel = require("../../models/vehicle-model");

module.exports = {
	// validate req.body
	// create mongodb DriverModel
	// password encryption
	// save data to mongo dv
	// return response to client
	registerDriver: async (req, res) => {
		const driver = await DriverModel.findOne({ email: req.body.email });
		if (driver) {
			return res
				.status(401)
				.json({ success: false, message: "email-already-registered" });
		}

		const id = generateUUID();
		const generatedOtp = await generateOtp();

		const driverModel = new DriverModel(req.body);

		driverModel.password = await hashData(req.body.password);
		driverModel.driverId = id;
		driverModel.otpCode = await hashData(generatedOtp);

		try {
			const response = await driverModel.save();
			sendDriverOtp({
				email: req.body.email,
				firstName: req.body.firstName,
				otpCode: generatedOtp,
			});
			response.password = undefined;
			response.otpCode = undefined;
			return res.status(201).json({ success: true, data: response });
		} catch (error) {
			return res.status(500).json({ success: false, data: error });
		}
	},

	completeDriverRegistration: async (req, res) => {
		try {
			const driver = await DriverModel.findOne({
				driverId: req.params.driverID,
			});

			if (!driver) {
				return res
					.status(401)
					.json({ success: false, message: "email-not-found" });
			}

			const vehicle = new VehicleModel();
			vehicle.id = generateUUID();
			vehicle.carName = req.body.vehicleName;
			vehicle.carModel = req.body.vehicleModel;
			vehicle.vinNum = req.body.vehicleVin;
			vehicle.isActive = false;

			driver.driverPictures.profilePicture = req.body.profilePicture;
			driver.driverPictures.dlFront = req.body.dlFront;
			driver.driverPictures.dlBack = req.body.dlBack;
			driver.vehicleDetails.push(vehicle);

			driver.insurance.policyNo = req.body.insurancePolicyNo;
			driver.insurance.holderName = req.body.insuranceHolderName;
			driver.insurance.policyCompany = req.body.insuranceCompany;
			driver.business.businessName = req.body.businessName;
			driver.business.bIdentification = req.body.businessId;
			if (req.body.bankName != null || req.body.bankName != "") {
				driver.paymentMethods.bankMethod.accountHolder = req.body.bankMethod;
				driver.paymentMethods.bankMethod.accountNumber = req.body.accountNumber;
				driver.paymentMethods.bankMethod.routing = req.body.routing;
				driver.paymentMethods.bankMethod.bankName = req.body.bankName;
			}

			if (req.body.paypalEmail != null || req.body.paypalEmail != "") {
				driver.paymentMethods.paypal.paypalEmail = req.body.paypalEmail;
				driver.paymentMethods.paypal.paypalUsername = req.body.paypalUsername;
			}

			if (req.body.stripeEmail != null || req.body.stripeEmail != "") {
				driver.paymentMethods.stripe.stripeEmail = req.body.stripeEmail;
				driver.paymentMethods.stripe.stripeUsername = req.body.stripeUsername;
			}

			const response = await driver.save();
			if (response.isModified) {
				const tokenObject = {
					id: driver._id,
					driverId: driver.driverId,
					driverAccepted: driver.driverAccepted,
					isEmailVerified: driver.isEmailVerified,
					isSubscribed: driver.isSubscribed,
					rideStatus: driver.rideStatus,
					firstName: driver.firstName,
					lastName: driver.lastName,
					email: driver.email,
					profilePicture: driver.driverPictures.profilePicture,
					gender: driver.gender,
					phone: driver.phone,
					vehicleDetails: driver.vehicleDetails,
					business: driver.business,
					bankMethod: driver.paymentMethods.bankMethod,
					paypal: driver.paymentMethods.paypal,
					stripe: driver.paymentMethods.stripe,
					fcmToken: driver.fcmToken,
					createdAt: driver.createdAt,
				};

				const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {
					expiresIn: "1d",
				});
				const refreshToken = jwt.sign(tokenObject, process.env.REFRESH_SECRET, {
					expiresIn: "30d",
				});

				const refreshTokenExpiration = new Date();
				refreshTokenExpiration.setDate(refreshTokenExpiration.getDate() + 30);

				driver.refreshToken = refreshToken;
				driver.refreshTokenExpiration = refreshTokenExpiration;
				console.log("here");

				await driver.save();

				return res
					.status(201)
					.json({ success: true, jwtToken, refreshToken, tokenObject });
			}
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, data: error });
		}
	},

	fcmUploadDriver: async (req, res) => {
		try {
			const { email, fcmToken } = req.body;
			const driver = await DriverModel.findOne({ email });

			if (!driver) {
				return res
					.status(401)
					.json({ success: false, message: "email-not-found" });
			}

			driver.fcmToken = fcmToken;
			await driver.save();

			return res.status(201).json({ success: true, data: "fcm-token-updated" });
		} catch (error) {
			return res.status(500).json({ success: false, data: error });
		}
	},

	loginDriver: async (req, res) => {
		try {
			const driver = await DriverModel.findOne({ email: req.body.email });
			if (!driver) {
				return res
					.status(401)
					.json({ success: false, message: "email-not-found" });
			}

			const isPassEqual = await compareHashData(
				req.body.password,
				driver.password
			);
			if (!isPassEqual) {
				return res
					.status(401)
					.json({ success: false, message: "wrong-password" });
			}

			const tokenObject = {
				id: driver._id,
				driverId: driver.driverId,
				driverAccepted: driver.driverAccepted,
				isEmailVerified: driver.isEmailVerified,
				isSubscribed: driver.isSubscribed,
				rideStatus: driver.rideStatus,
				firstName: driver.firstName,
				lastName: driver.lastName,
				email: driver.email,
				profilePicture: driver.driverPictures.profilePicture,
				gender: driver.gender,
				phone: driver.phone,
				vehicleDetails: driver.vehicleDetails,
				business: driver.business,
				bankMethod: driver.paymentMethods.bankMethod,
				paypal: driver.paymentMethods.paypal,
				stripe: driver.paymentMethods.stripe,
				fcmToken: driver.fcmToken,
				createdAt: driver.createdAt,
			};
			const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {
				expiresIn: "4h",
			});
			const refreshToken = jwt.sign(tokenObject, process.env.REFRESH_SECRET, {
				expiresIn: "5d",
			});

			const refreshTokenExpiration = new Date();
			refreshTokenExpiration.setDate(refreshTokenExpiration.getDate() + 5);

			driver.refreshToken = refreshToken;
			driver.refreshTokenExpiration = refreshTokenExpiration;

			const response = await driver.save();
			if (response.isModified) {
				return res
					.status(201)
					.json({ success: true, jwtToken, refreshToken, tokenObject });
			} else {
				return res
					.status(500)
					.json({ success: false, message: "updating-refresh-token-error" });
			}
		} catch (error) {
			return res.status(500).json({ success: false, data: error });
		}
	},

	changeDriverPassword: async (req, res) => {
		try {
			const driver = await DriverModel.findOne({ email: req.body.email });

			if (!driver) {
				return res
					.status(401)
					.json({ success: false, message: "email-not-found" });
			}

			const isPassEqual = await compareHashData(
				req.body.oldPassword,
				driver.password
			);

			if (!isPassEqual) {
				return res
					.status(401)
					.json({ success: false, message: "wrong-password" });
			}

			driver.password = await hashData(req.body.newPassword);

			const response = await driver.save();
			if (response.isModified) {
				return res
					.status(201)
					.json({ success: true, message: "password-update-successful" });
			} else {
				return res
					.status(500)
					.json({ success: false, data: "updating-password-error" });
			}
		} catch (error) {
			return res.status(500).json({ success: false, data: error });
		}
	},

	updateDriverInfo: async (req, res) => {
		try {
			const driver = await DriverModel.findOne({ email: req.body.email });

			if (!driver) {
				return res
					.status(401)
					.json({ success: false, message: "driver-not-found" });
			}

			driver.firstName = req.body.firstName;
			driver.lastName = req.body.lastName;
			driver.phone = req.body.phone;
			driver.gender = req.body.gender;

			const response = await driver.save();
			if (response.isModified) {
				const tokenObject = {
					id: driver._id,
					driverId: driver.driverId,
					driverAccepted: driver.driverAccepted,
					isEmailVerified: driver.isEmailVerified,
					isSubscribed: driver.isSubscribed,
					rideStatus: driver.rideStatus,
					firstName: driver.firstName,
					lastName: driver.lastName,
					email: driver.email,
					profilePicture: driver.driverPictures.profilePicture,
					gender: driver.gender,
					phone: driver.phone,
					vehicleDetails: driver.vehicleDetails,
					business: driver.business,
					bankMethod: driver.paymentMethods.bankMethod,
					paypal: driver.paymentMethods.paypal,
					stripe: driver.paymentMethods.stripe,
					fcmToken: driver.fcmToken,
					createdAt: driver.createdAt,
				};

				return res.status(201).json({ success: true, tokenObject });
			} else {
				return res
					.status(500)
					.json({ success: false, data: "updating-info-error" });
			}
		} catch (error) {
			return res.status(500).json({ success: false, data: error });
		}
	},

	refreshDriverToken: async (req, res) => {
		try {
			const driver = await DriverModel.findOne({ email: req.body.email });
			if (!driver) {
				return res
					.status(401)
					.json({ success: false, message: "driver-not-found" });
			}
			const expirationDate = new Date(driver.refreshTokenExpiration);
			const isExpired = new Date() > expirationDate.getTime();

			const refreshTokenEqual = req.body.refreshToken === driver.refreshToken;
			if (!refreshTokenEqual) {
				return res
					.status(403)
					.json({ success: false, message: "refresh-token-invalid" });
			}

			if (isExpired) {
				driver.refreshToken = "";
				driver.refreshTokenExpiration = null;

				const response = await driver.save();
				if (response.isModified) {
					return res
						.status(403)
						.json({ success: false, message: "refresh-token-expired" });
				} else {
					return res
						.status(500)
						.json({ success: false, message: "updating-refresh-token-error" });
				}
			}
			const tokenObject = {
				id: driver._id,
				driverId: driver.driverId,
				driverAccepted: driver.driverAccepted,
				isEmailVerified: driver.isEmailVerified,
				isSubscribed: driver.isSubscribed,
				rideStatus: driver.rideStatus,
				firstName: driver.firstName,
				lastName: driver.lastName,
				email: driver.email,
				profilePicture: driver.driverPictures.profilePicture,
				gender: driver.gender,
				phone: driver.phone,
				vehicleDetails: driver.vehicleDetails,
				business: driver.business,
				bankMethod: driver.paymentMethods.bankMethod,
				paypal: driver.paymentMethods.paypal,
				stripe: driver.paymentMethods.stripe,
				fcmToken: driver.fcmToken,
				createdAt: driver.createdAt,
			};

			const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {
				expiresIn: "1d",
			});
			return res.status(201).json({ success: true, jwtToken, tokenObject });
		} catch (error) {
			return res.status(500).json({ success: false, data: error });
		}
	},

	resendDriverOtp: async (req, res) => {
		try {
			const driver = await DriverModel.findOne({ email: req.body.email });

			if (!driver) {
				return res
					.status(401)
					.json({ success: false, message: "email-not-found" });
			}
			const generatedOtp = await generateOtp();
			driver.otpCode = await hashData(generatedOtp);

			await driver.save();
			await sendDriverOtp({
				email: driver.email,
				firstName: driver.firstName,
				otpCode: generatedOtp,
			});
			return res.status(201).json({ success: true, data: "otp-sent" });
		} catch (error) {
			return res.status(500).json({ success: false, data: error });
		}
	},

	verifyDriverOtp: async (req, res) => {
		try {
			const driver = await DriverModel.findOne({ email: req.body.email });

			if (!driver) {
				return res.status(401).json({
					success: false,
					message: "email-not-found",
					data: "Email not registered!",
				});
			}

			const isOtpEqual = await compareHashData(
				req.body.otpCode,
				driver.otpCode
			);

			if (!isOtpEqual) {
				return res.status(401).json({
					success: false,
					message: "wrong-otp",
					data: "Enter correct OTP",
				});
			}

			driver.isEmailVerified = true;
			driver.otpCode = await generateFiveCharOtp();

			const response = await driver.save();
			if (response.isModified) {
				return res
					.status(201)
					.json({ success: true, message: "email-verified" });
			} else {
				return res
					.status(500)
					.json({ success: false, message: "updating-refresh-token-error" });
			}
		} catch (error) {
			return res.status(500).json({ success: false, data: error });
		}
	},
};
