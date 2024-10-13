const express = require('express');
const path = require('path');


const { userRegisterValidate, userLoginValidate,  userRefreshValidate, userOtpValidate, userInfoChangeValidate, userPasswordChangeValidate, completeRegistrationValidate, completeDriverRegistrationValidate } = require('../modules/utils/userValidation');
const { ensureAuthenticated } = require('../modules/utils/auth');
const { notifyUser } = require('../modules/notification');
const { registerRider, loginRider, refreshRiderToken,  verifyOtp, updateRiderInfo,  changeRiderPassword, completeRegistration } = require('../modules/usercontroller/rider-controller');
const { registerDriver, loginDriver, refreshDriverToken,  verifyDriverOtp, updateDriverInfo, changeDriverPassword, completeDriverRegistration } = require('../modules/usercontroller/driver-controller');
const { upload, multi_upload } = require('../modules/utils/upload-photo');
const { tripCreateValidation } = require('../modules/utils/tripValidation');
const { createTrip } = require('../modules/trip-controller');
const { checkNotificationInput } = require('../modules/utils/notificationValidation');


const routes = express.Router();

routes.get("/", (req, res) => {
    res.send({message: "App is running.."});
    console.log("it's called");
});

//Authentication - Customer

routes.post('/register', userRegisterValidate, registerRider);

routes.post('/complete-registration', upload('profiles').single('image'), completeRegistrationValidate, completeRegistration);

routes.post('/:riderId/set-country');

routes.post('/login', userLoginValidate, loginRider);

routes.post('/refresh-token', userRefreshValidate, refreshRiderToken);

routes.post('/otp-rider', userOtpValidate, verifyOtp);

routes.post('/update-info', ensureAuthenticated, userInfoChangeValidate, updateRiderInfo);

routes.post('/change-password', ensureAuthenticated, userPasswordChangeValidate, changeRiderPassword);

//Authentication - Driver

routes.post('/register-driver', userRegisterValidate, registerDriver);

// routes.post(
//   '/complete-driver-registration/:driverID',
//   multi_upload('drivers').fields([
//     { name: 'profilePicture', maxCount: 1 },
//     { name: 'dlFront', maxCount: 1 },
//     { name: 'dlBack', maxCount: 1 }
//   ]),
//   completeDriverRegistrationValidate,
//   completeDriverRegistration
// );
  

routes.post(
  '/complete-driver-registration/:driverID/picture',
  multi_upload('drivers').single('picture'), (req,res) => {
    if(!req.file) {
      return res.status(400).json({ success: false, message: "file-upload-failed."});
    }
    const folderName = path.dirname(req.file.path).split(path.sep).pop();  // Extract last folder
    const fileName = path.basename(req.file.path);  // Extract the file name

    const profileUrl = `${req.protocol}://${req.get('host')}/uploads/${folderName}/${fileName}`;
    
    res.status(200).json({success: true, data: profileUrl});
  }
);

routes.post(
  '/complete-driver-registration/:driverID/dlFront',
  multi_upload('drivers').single('dlFront'),
  (req,res) => {
    if(!req.file) {
      return res.status(400).json({ success: false, message: "file-upload-failed."});
    }

    const folderName = path.dirname(req.file.path).split(path.sep).pop();  // Extract last folder
    const fileName = path.basename(req.file.path);  // Extract the file name

    const licenseFrontUrl = `${req.protocol}://${req.get('host')}/uploads/${folderName}/${fileName}`;

    res.status(200).json({success: true, data: licenseFrontUrl});
  }

);

routes.post(
  '/complete-driver-registration/:driverID/finishing',
  multi_upload('drivers').single('dlBack'),
  completeDriverRegistrationValidate,
  completeDriverRegistration
);

routes.post('/:driverId/set-country');



routes.post('/login-driver', userLoginValidate, loginDriver);

routes.post('/refresh-driver-token', userRefreshValidate, refreshDriverToken);

routes.post('/otp-driver', userOtpValidate, verifyDriverOtp);

routes.post('/update-driver-info', ensureAuthenticated, userInfoChangeValidate, updateDriverInfo);

routes.post('/change-password-driver', ensureAuthenticated, userPasswordChangeValidate, changeDriverPassword);

//Notification
routes.post('/notify', checkNotificationInput, notifyUser);

//trips - Rider
routes.post('/create-trip', tripCreateValidation, createTrip)


//trips - Driver





module.exports = routes;








