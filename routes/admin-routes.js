const express = require('express');
const { userLoginValidate } = require('../modules/utils/userValidation');
const { loginAdmin, addNewAdmin, getAllAdmins, getDrivers, getRiders, getAllTrips, getSubscribedDrivers, getDocumentsForVerification, getApprovedDrivers, approveDriver, rejectDrivers, getRejectedDrivers, createAdmin, getActiveTrips, getDashboardData, getDriverManagementData, getSubscriptionScreenData, modifySubscription, showAllReviews, deleteReview, updateReview, getRiderTripHistory, getDriverTripHistory, getTransactions, refreshAdminToken, getAnalyticsByCountry } = require('../modules/usercontroller/admin-controller');
const { ensureAdminPower, ensureAdmin } = require('../modules/utils/auth');
const {  validateDriverId,  inviteAdminValidation, createAdminValidation, subsModificationValidation, reviewModificationValidation, adminRefreshValidate, validateDriverAccept } = require('../modules/utils/adminValidation');
const { checkNotificationInput } = require('../modules/utils/notificationValidation');
const { notifyUser } = require('../modules/notification');


const adminRoutes = express.Router();


adminRoutes.get("/", (req, res) => {
    console.log("hit this");
    res.status(201).json({admin: "is-here"});
})


adminRoutes.get('/dashboard', ensureAdmin, getDashboardData);
adminRoutes.get('/driver-management', ensureAdmin, getDriverManagementData);
adminRoutes.get('/subscription-page', ensureAdmin, getSubscriptionScreenData);

//// Subscription
adminRoutes.post('/modify-subscription', ensureAdmin, subsModificationValidation, modifySubscription);
adminRoutes.get('/subscribed-drivers', ensureAdmin, getSubscribedDrivers);


////Review
adminRoutes.get('/reviews', ensureAdmin, showAllReviews);
adminRoutes.post('/update-review/:reviewId', ensureAdmin, reviewModificationValidation, updateReview);
adminRoutes.post('/delete-review/:reviewId', ensureAdmin, deleteReview);

// ADMIN

adminRoutes.post('/login', userLoginValidate, loginAdmin);
adminRoutes.post('/invite-new-admin', ensureAdminPower, inviteAdminValidation, addNewAdmin);
adminRoutes.post('/register', createAdminValidation, createAdmin);
adminRoutes.get('/admins', ensureAdmin, getAllAdmins);
adminRoutes.post('/refresh-token', adminRefreshValidate, refreshAdminToken);

// DRIVER
adminRoutes.get('/drivers',  ensureAdmin, getDrivers);
adminRoutes.get('/driver-trip-history/:driverId', ensureAdmin, getDriverTripHistory)
adminRoutes.get('/drivers-under-review', ensureAdmin, getDocumentsForVerification);
adminRoutes.post('/approve-driver', ensureAdminPower, validateDriverAccept, approveDriver);
adminRoutes.post('/reject-driver', ensureAdminPower, validateDriverId, rejectDrivers);
adminRoutes.get('/all-approved-drivers/', ensureAdmin, getApprovedDrivers);
adminRoutes.get('/all-rejected-drivers/', ensureAdmin, getRejectedDrivers);


// RIDER
adminRoutes.get('/riders',  ensureAdmin, getRiders);
adminRoutes.get('/rider-trip-history/:riderId', ensureAdmin, getRiderTripHistory);


//Transaction
adminRoutes.get('/transactions', ensureAdmin, getTransactions);


//Dispatch Route and Management
adminRoutes.get('/dispatch-route-management')
adminRoutes.get('/driver-current/:driverId')
adminRoutes.post('/deploy-driver/:driverId')


//Analytics and Reporting
adminRoutes.get('/analytics/:country', ensureAdmin, getAnalyticsByCountry)


// TRIPS
adminRoutes.get('/trips', ensureAdmin, getAllTrips);
adminRoutes.get('/active-trips', ensureAdmin, getActiveTrips);


//Notification
// adminRoutes.post('/notify', checkNotificationInput, notifyUser);


module.exports = adminRoutes;