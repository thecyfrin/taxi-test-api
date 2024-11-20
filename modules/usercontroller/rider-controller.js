const RiderModel = require("../../models/rider-model");

const jwt = require("jsonwebtoken");
const path = require("path");

const {
	generateUUID,
	generateOtp,
	generateFiveCharOtp,
} = require("../utils/utils-class");
const { sendOtp } = require("../email-controller");
const { compareHashData, hashData } = require("../utils/encrypt");

module.exports = {
	registerRider: async (req, res) => {
		try {
			const rider = await RiderModel.findOne({ email: req.body.email });
			if (rider) {
				return res
					.status(401)
					.json({ success: false, message: "email-already-registered" });
			}

			const id = generateUUID();
			const generatedOtp = await generateOtp();

			const newRider = new RiderModel(req.body);
			newRider.password = await hashData(req.body.password);

			newRider.riderId = id;
			newRider.otpCode = await hashData(generatedOtp);

			const response = await newRider.save();
			await sendOtp({
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

	completeRegistration: async (req, res) => {
		console.log(req.file);

		try {
			const rider = await RiderModel.findOne({ email: req.body.email });

			if (!rider) {
				return res
					.status(401)
					.json({ success: false, message: "email-not-found" });
			}

			if (!req.file) {
				return res
					.status(405)
					.json({ success: false, message: "image-upload-failed" });
			}

			rider.profilePicture = req.file.path;
			rider.state = req.body.state;
			rider.fullName = req.body.fullName;

			await rider.save();

			const tokenObject = {
				_id: rider._id,
				riderId: rider.riderId,
				isEmailVerified: rider.isEmailVerified,
				fullName: rider.fullName,
				firstName: rider.firstName,
				lastName: rider.lastName,
				email: rider.email,
				profilePicture: rider.profilePicture,
				gender: rider.gender,
				state: rider.state,
				phone: rider.phone,
				createdAt: rider.createdAt,
			};

			const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {
				expiresIn: "1d",
			});
			const refreshToken = jwt.sign(tokenObject, process.env.REFRESH_SECRET, {
				expiresIn: "30d",
			});

			const refreshTokenExpiration = new Date();
			refreshTokenExpiration.setDate(refreshTokenExpiration.getDate() + 30);

			rider.refreshToken = refreshToken;
			rider.refreshTokenExpiration = refreshTokenExpiration;

			const response = await rider.save();
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

	loginRider: async (req, res) => {
		try {
			const rider = await RiderModel.findOne({ email: req.body.email });
			if (!rider) {
				return res
					.status(401)
					.json({ success: false, message: "email-not-found" });
			}
			const isPassEqual = await compareHashData(
				req.body.password,
				rider.password
			);

			if (!isPassEqual) {
				return res
					.status(401)
					.json({ success: false, message: "wrong-password" });
			}

			const tokenObject = {
				_id: rider._id,
				riderId: rider.riderId,
				isEmailVerified: rider.isEmailVerified,
				fullName: rider.fullName,
				firstName: rider.firstName,
				lastName: rider.lastName,
				email: rider.email,
				profilePicture: rider.profilePicture,
				gender: rider.gender,
				state: rider.state,
				phone: rider.phone,
			};

			const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {
				expiresIn: "1d",
			});
			const refreshToken = jwt.sign(tokenObject, process.env.REFRESH_SECRET, {
				expiresIn: "30d",
			});

			const refreshTokenExpiration = new Date();
			refreshTokenExpiration.setDate(refreshTokenExpiration.getDate() + 30);

			rider.refreshToken = refreshToken;
			rider.refreshTokenExpiration = refreshTokenExpiration;
			rider.updatedAt = Date.now();
			await rider.save();

			console.log("done");
			return res
				.status(201)
				.json({ success: true, jwtToken, refreshToken, tokenObject });
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "An error occurred",
				data: error.message,
			});
		}
	},

	changeRiderPassword: async (req, res) => {
		try {
			const rider = await RiderModel.findOne({ email: req.body.email });

			if (!rider) {
				return res
					.status(401)
					.json({ success: false, message: "email-not-found" });
			}

			const isPassEqual = await compareHashData(
				req.body.oldPassword,
				rider.password
			);

			if (!isPassEqual) {
				return res
					.status(401)
					.json({ success: false, message: "wrong-password" });
			}

			const isNewPassSame = await compareHashData(
				req.body.newPassword,
				rider.password
			);

			if (isNewPassSame) {
				return res
					.status(401)
					.json({ success: false, message: "same-password" });
			}

			rider.password = await hashData(req.body.newPassword);

			const response = await rider.save();
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

	updateRiderInfo: async (req, res) => {
		try {
			const rider = await RiderModel.findOne({ email: req.body.email });

			if (!rider) {
				return res
					.status(401)
					.json({ success: false, message: "rider-not-found" });
			}

			rider.firstName = req.body.firstName;
			rider.lastName = req.body.lastName;
			rider.phone = req.body.phone;
			rider.gender = req.body.gender;

			const response = await rider.save();
			if (response.isModified) {
				const tokenObject = {
					_id: rider._id,
					riderId: rider.riderId,
					isEmailVerified: rider.isEmailVerified,
					fullName: rider.fullName,
					firstName: rider.firstName,
					lastName: rider.lastName,
					email: rider.email,
					profilePicture: rider.profilePicture,
					gender: rider.gender,
					state: rider.state,
					phone: rider.phone,
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

	refreshRiderToken: async (req, res) => {
		try {
			const rider = await RiderModel.findOne({ email: req.body.email });
			if (!rider) {
				return res
					.status(401)
					.json({ success: false, message: "rider-not-found" });
			}
			const expirationDate = new Date(rider.refreshTokenExpiration);
			const isExpired = new Date() > expirationDate.getTime();

			const refreshTokenEqual = req.body.refreshToken === rider.refreshToken;
			if (!refreshTokenEqual) {
				return res
					.status(403)
					.json({ success: false, message: "refresh-token-invalid" });
			}

			if (isExpired) {
				rider.refreshToken = "";
				rider.refreshTokenExpiration = null;

				const response = await rider.save();
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
				_id: rider._id,
				riderId: rider.riderId,
				isEmailVerified: rider.isEmailVerified,
				fullName: rider.fullName,
				firstName: rider.firstName,
				lastName: rider.lastName,
				email: rider.email,
				profilePicture: rider.profilePicture,
				gender: rider.gender,
				state: rider.state,
				phone: rider.phone,
			};

			const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {
				expiresIn: "1d",
			});
			return res.status(201).json({ success: true, jwtToken, tokenObject });
		} catch (error) {
			return res.status(500).json({ success: false, data: error });
		}
	},

	resendRiderOtp: async (req, res) => {
		try {
			const rider = await RiderModel.findOne({ email: req.body.email });

			if (!rider) {
				return res
					.status(401)
					.json({ success: false, message: "email-not-found" });
			}
			const generatedOtp = await generateOtp();
			rider.otpCode = await hashData(generatedOtp);

			await rider.save();
			await sendOtp({
				email: rider.email,
				firstName: rider.firstName,
				otpCode: generatedOtp,
			});
			return res.status(201).json({ success: true, data: "otp-sent" });
		} catch (error) {
			return res.status(500).json({ success: false, data: error });
		}
	},

	verifyRiderOtp: async (req, res) => {
		try {
			const rider = await RiderModel.findOne({ email: req.body.email });

			if (!rider) {
				return res
					.status(401)
					.json({ success: false, message: "email-not-found" });
			}

			const isOtpEqual = await compareHashData(req.body.otpCode, rider.otpCode);

			if (!isOtpEqual) {
				return res.status(401).json({ success: false, message: "wrong-otp" });
			}

			rider.isEmailVerified = true;
			rider.otpCode = await generateFiveCharOtp();

			const response = await rider.save();
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
