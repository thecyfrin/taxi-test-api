const express = require("express");
const path = require("path");

const {
	userRegisterValidate,
	userLoginValidate,
	userRefreshValidate,
	userOtpValidate,
	userInfoChangeValidate,
	userPasswordChangeValidate,
	completeRegistrationValidate,
	completeDriverRegistrationValidate,
	resendOtpValidate,
	fcmTokenValidation,
} = require("../modules/utils/userValidation");
const { ensureAuthenticated } = require("../modules/utils/auth");
const { notifyUser } = require("../modules/notification");
const {
	registerRider,
	loginRider,
	refreshRiderToken,
	updateRiderInfo,
	changeRiderPassword,
	completeRegistration,
	verifyRiderOtp,
	resendRiderOtp,
	fcmUpload,
} = require("../modules/usercontroller/rider-controller");
const {
	registerDriver,
	loginDriver,
	refreshDriverToken,
	verifyDriverOtp,
	updateDriverInfo,
	changeDriverPassword,
	completeDriverRegistration,
	resendDriverOtp,
	fcmUploadDriver,
} = require("../modules/usercontroller/driver-controller");
const { upload, multi_upload } = require("../modules/utils/upload-photo");
const {
	tripCreateValidation,
	tripGetDriverValidation,
	getRideInfoValidation,
	tripAcceptValidation,
} = require("../modules/utils/tripValidation");
const {
	createTrip,
	getTripDriverDetails,
	getRideInformation,
	acceptTrip,
} = require("../modules/trip-controller");
const {
	checkNotificationInput,
} = require("../modules/utils/notificationValidation");
const {
	sendNotificationOfTripToDrivers,
} = require("../modules/utils/sendNotificationToDrivers");

const routes = express.Router();

routes.get("/", (req, res) => {
	res.send({ message: "App is running.." });
	console.log("it's called");
});

//For All

//Authentication - Customer

routes.post("/register", userRegisterValidate, registerRider);

routes.post(
	"/complete-registration",
	completeRegistrationValidate,
	completeRegistration
);

routes.post("/user-fcm", fcmTokenValidation, fcmUpload);

routes.post("/:riderId/set-country");

routes.post("/login", userLoginValidate, loginRider);

routes.post("/refresh-token", userRefreshValidate, refreshRiderToken);

routes.post("/otp-rider", userOtpValidate, verifyRiderOtp);

routes.post("/resendOtp-rider", resendOtpValidate, resendRiderOtp);

routes.post(
	"/update-info",
	ensureAuthenticated,
	userInfoChangeValidate,
	updateRiderInfo
);

routes.post(
	"/change-password",
	ensureAuthenticated,
	userPasswordChangeValidate,
	changeRiderPassword
);

//Authentication - Driver

routes.post("/register-driver", userRegisterValidate, registerDriver);

routes.post(
	"/complete-driver-registration/:driverID",

	completeDriverRegistrationValidate,
	completeDriverRegistration
);

routes.post("/driver-fcm", fcmTokenValidation, fcmUploadDriver);

routes.post("/:driverId/set-country");

routes.post("/login-driver", userLoginValidate, loginDriver);

routes.post("/refresh-driver-token", userRefreshValidate, refreshDriverToken);

routes.post("/resendOtp-driver", resendOtpValidate, resendDriverOtp);

routes.post("/otp-driver", userOtpValidate, verifyDriverOtp);

routes.post(
	"/update-driver-info",
	ensureAuthenticated,
	userInfoChangeValidate,
	updateDriverInfo
);

routes.post(
	"/change-password-driver",
	ensureAuthenticated,
	userPasswordChangeValidate,
	changeDriverPassword
);

//Notification
// routes.post("/notify", checkNotificationInput, notifyUser);

// trips - Rider
routes.post("/create-trip", tripCreateValidation, createTrip);

// routes.post(
// 	"/get-driver-details",
// 	tripGetDriverValidation,
// 	getTripDriverDetails
// );

routes.get("/stats", async (req, res) => {
	try {
		const firstName = "Mash";
		const lastName = "Rahaman";
		await sendNotificationOfTripToDrivers(
			24.000028,
			90.430387,
			"elite",
			`${firstName} ${lastName}`,
			"941b6e82-4319-46b6-83c9-301d9fafed3b"
		);
		res.status(200).json({ driversFound: "All" });
	} catch (err) {
		console.log(err);
	}
	// Wait for 5 seconds (adjust as necessary)
});

//trips - Driver
routes.post("/get-ride-information", getRideInfoValidation, getRideInformation);
routes.post("/accept-trip", tripAcceptValidation, acceptTrip);

module.exports = routes;
