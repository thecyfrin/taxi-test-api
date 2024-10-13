const jwt = require('jsonwebtoken');
const AdminModel = require('../../models/admin-model');
const { compareHashData, hashData } = require('../utils/encrypt');
const {  generateUUID } = require('../utils/utils-class');
const { sendAdminInvite } = require('../email-controller');
const DriverModel = require('../../models/driver-model');
const RiderModel = require('../../models/rider-model');
const TripModel = require('../../models/trip-model');
const DriverPass = require('../../models/panel-models/driver-pass');
const ReviewModel = require('../../models/panel-models/review-model');
const TransactionModel = require('../../models/transaction-model');


module.exports = {
    createAdmin: async (req, res) => {
        try{
            const admin = await AdminModel.findOne({email: req.body.email});
            if(admin) {
                return res.status(401).json({ success : false,  message: 'email-already-registered' });
            }
    
            const id = generateUUID();
            const newAdmin = new AdminModel(req.body);
    
            newAdmin.adminId = id;
            newAdmin.password = await hashData(req.body.password);
            await newAdmin.save();

            const tokenObject = {
                _id : admin._id,
                adminId: admin.adminId,
                name: admin.name,
                email : admin.email,
                profilePicture: admin.profilePicture,
            }

            const jwtToken = jwt.sign(tokenObject, process.env.MODERATOR_SECRET, {expiresIn : '1d'});
            const refreshToken = jwt.sign(tokenObject, process.env.REFRESH_SECRET, {expiresIn: '30d'});

            const refreshTokenExpiration = new Date();
            refreshTokenExpiration.setDate(refreshTokenExpiration.getDate() + 30);
            
            admin.refreshToken = refreshToken;
            admin.refreshTokenExpiration = refreshTokenExpiration;

            const response = await admin.save();
            if(response.isModified) {
                return res.status(201).json({ success : true, jwtToken, refreshToken, tokenObject });
            } else {
                return res.status(500).json({success : false, data: 'updating-refresh-token-error'});
            }
                
               
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    loginAdmin: async (req, res) => {
        
        try {
            const admin = await AdminModel.findOne({email: req.body.email});
            if(!admin) {
                return res.status(401).json({ success : false,  message: 'email-not-found' });
            }

            const isPassEqual = await compareHashData(req.body.password, admin.password);

            if(!isPassEqual) {
                return res.status(401).json({ success : false,  message: 'wrong-password' });
            }
            
            let secret = "";

            const tokenObject = {
                _id : admin._id,
                adminId: admin.adminId,
                name: admin.name,
                email : admin.email,
                profilePicture: admin.profilePicture,
            }

            if((admin.canRead && admin.canWrite && admin.canExecute) == true ) {
                secret = process.env.SUPER_ADMIN_SECRET;
            } else if(admin.canRead == true && (admin.canWrite == true || admin.canExecute == true)) {
                secret = process.env.ADMIN_SECRET;         
            } else {
                secret = process.env.MODERATOR_SECRET;           
            }

            const jwtToken = jwt.sign(tokenObject, secret, {expiresIn : '10d'});
            const refreshToken = jwt.sign(tokenObject, process.env.REFRESH_SECRET, {expiresIn: '30d'});

            const refreshTokenExpiration = new Date();
            refreshTokenExpiration.setDate(refreshTokenExpiration.getDate() + 30);
            
            admin.refreshToken = refreshToken;
            admin.refreshTokenExpiration = refreshTokenExpiration;

            const response = await admin.save();
            if(response.isModified) {
                return res.status(201).json({ success : true, jwtToken, refreshToken, tokenObject });
            } else {
                return res.status(410).json({success : false, data: 'updating-refresh-token-error'});
            }
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
            
        }
    },

    addNewAdmin: async (req, res) => {
        try {
            const admin = await AdminModel.findOne({email: req.body.email});
            if(admin) {
                return res.status(401).json({ success : false,  message: 'admin-already-registered' });
            }

            const newAdminUrl = "google.com";      
            await sendAdminInvite({email: req.body.email, url: newAdminUrl});
               
            return res.status(201).json({ success : true, message: 'invitation-sent' });

        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
            
        }
    },

    getAllAdmins: async (req, res) => {
        try {
            const admins = await AdminModel.find({}, {password: 0});
            console.log(admins.length);
            
            return res.status(200).json({
                success : true, data: admins.map(function (rz){
                return {
                    id: rz.adminId,
                    name: rz.name,
                    email: rz.email,
                    profilePicture: rz.profilePicture,
                    canRead: rz.canRead,
                    canWrite: rz.canWrite,
                    canExecute: rz.canExecute,
                    createdAt: rz.createdAt,       
                };
            })
        });
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },
    
    

    getDrivers: async (req,res) =>{
        try {
            const drivers = await DriverModel.find({}, {password: 0});
        
            return res.status(200).json({
                success : true, data: drivers.map(function (rz){
                    return {
                        id: rz.driverId,
                        isEmailVerified: rz.isEmailVerified,
                        isSubscribed: rz.isSubscribed,
                        firstName: rz.firstName,
                        lastName: rz.lastName,
                        email: rz.email,
                        gender: rz.gender,
                        phone: rz.phone,
                        createAt: rz.createdAt,
                        driverPictures: rz.driverPictures,
                        vehicleDetails: rz.vehicleDetails,
                        business: rz.business,
                        insurance: rz.insurance,
                        paymentMethods: rz.paymentMethods,
                    };
                })
            });
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    refreshAdminToken: async (req, res) => {
        try {
            const admin = await AdminModel.findOne({email: req.body.email});
            if(!admin) {
                return res.status(401).json({ success : false, message: 'admin-not-found' });
            }
            const expirationDate = new Date(admin.refreshTokenExpiration); 
            const isExpired = new Date() > expirationDate.getTime();

            const refreshTokenEqual = req.body.refreshToken === admin.refreshToken;
            if(!refreshTokenEqual) {
                return res.status(403).json({ success : false, message: 'refresh-token-invalid'});
            }

            if (isExpired) {
                admin.refreshToken = "";
                admin.refreshTokenExpiration = null;

                const response = await admin.save();
                if(response.isModified) {
                    return res.status(403).json({ success : false, message: 'refresh-token-expired' });
                } else {
                    return res.status(500).json({success : false, message: 'updating-refresh-token-error'});
                }
            }
            const tokenObject = {
                _id : admin._id,
                adminId: admin.adminId,
                firstName : admin.firstName,
                lastName : admin.lastName,
                email : admin.email,
                gender : admin.gender,
                phone : admin.phone
            }

            const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {expiresIn : '1d'});
            return res.status(201).json({ success : true, jwtToken, tokenObject });
        } catch(error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },


    getDriverTripHistory: async (req, res) => {
        try {
            const trips = await TripModel.find({driverId: req.params.driverId});
           
            return res.status(200).json({success : true, data: trips});
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },


    getRiders: async (req,res) =>{
        try {
            const riders = await RiderModel.find({}, {password: 0});
            riders.forEach(rider => {
                rider.refreshToken = undefined;
                rider.refreshTokenExpiration = undefined;
                rider.otpCode = undefined;
            });

            return res.status(200).json({success : true, data: riders});
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    getRiderTripHistory: async (req, res) => {
        try {
            const trips = await TripModel.find({userId: req.params.riderId});
           
            return res.status(200).json({success : true, data: trips});
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    getDashboardData: async (req, res) => {
        try {
            const trips = await TripModel.find({isTripActive: true});
            const activeTrips = trips.length;

            const riders = await RiderModel.find({});
            const totalRider = riders.length;

            const dataObject = {
                activeTrips: activeTrips, 
                totalRider: totalRider,
                emergencyReq: 1,
            }

            return res.status(200).json({success: true, data: dataObject});
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    getDriverManagementData: async (req, res) => {
        try {

            const drivers = await DriverModel.countDocuments({});

            const pending = await DriverModel.countDocuments({driverAccepted: false});
            
            console.log(pending);

            const dataObject = {
                totalDrivers: drivers,
                pendingReviews: pending,
            }

            return res.status(200).json({success: true, data: dataObject});
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    getSubscriptionScreenData: async (req, res) => {
        try {
            const drivers = await DriverModel.countDocuments({});

            const subs = await DriverModel.countDocuments({isSubscribed: true});

            const passData = (await DriverPass.find({})).at(0);

            const dataObject = {
                subscribedDrivers: subs,
                totalDrivers: drivers,
                passData: passData,
            }

            return res.status(200).json({success: true, data: dataObject});

        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    modifySubscription: async (req, res) => {
        try {
            let sub = (await DriverPass.find({})).at(0);
            
            sub.name = req.body.name;
            sub.passImage = req.body.passImage;
            sub.benefits = req.body.benefits;
            sub.packages = req.body.packages;

            const response = await sub.save();
            if(response.isModified) {
                return res.status(201).json({ success : true, message: "subscription-modified" });
            } else {
                return res.status(500).json({success : false, data: 'updating-subscription-token-error'});
            }

        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    getAllTrips: async (req,res) =>{
        try {
            const trips = await TripModel.find({}, {password: 0});
            
            return res.status(200).json({success : true, data: trips});
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    }, 

    getActiveTrips: async (req, res) => {
        try {
            const trips = await TripModel.find({isTripActive: true});
            
            return res.status(200).json({success : true, data: trips});
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    getSubscribedDrivers: async (req, res) => {
        try {
            const drivers = await DriverModel.find({isSubscribed: true});

            return res.status(200).json({
                success : true, data: drivers.map(function (rz){
                return {
                    id: rz.driverId,
                    isEmailVerified: rz.isEmailVerified,
                    isSubscribed: rz.isSubscribed,
                    firstName: rz.firstName,
                    lastName: rz.lastName,
                    email: rz.email,
                    gender: rz.gender,
                    phone: rz.phone,
                    createAt: rz.createdAt,
                    driverPictures: rz.driverPictures,
                    vehicleDetails: rz.vehicleDetails,
                    business: rz.business,
                    insurance: rz.insurance,
                    paymentMethods: rz.paymentMethods,
                };
            })
        });
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    getDocumentsForVerification: async (req, res) => {
        try {
            const drivers = await DriverModel.find({driverAccepted: false});
            

            console.log(drivers.length);
            return res.status(200).json({
                success : true, data: drivers.map(function (rz){
                    return {
                        id: rz.driverId,
                        isEmailVerified: rz.isEmailVerified,
                        isSubscribed: rz.isSubscribed,
                        firstName: rz.firstName,
                        lastName: rz.lastName,
                        email: rz.email,
                        gender: rz.gender,
                        phone: rz.phone,
                        createAt: rz.createdAt,
                        driverPictures: rz.driverPictures,
                        vehicleDetails: rz.vehicleDetails,
                        business: rz.business,
                        insurance: rz.insurance,
                        paymentMethods: rz.paymentMethods,
                    };
                })
            });
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    getApprovedDrivers: async (req, res) => {
        try {
            const drivers = await DriverModel.find({driverAccepted: true});
        
            console.log(drivers.length);
            return res.status(200).json({
                success : true, data: drivers.map(function (rz){
                    return {
                        id: rz.driverId,
                        isEmailVerified: rz.isEmailVerified,
                        isSubscribed: rz.isSubscribed,
                        firstName: rz.firstName,
                        lastName: rz.lastName,
                        email: rz.email,
                        gender: rz.gender,
                        phone: rz.phone,
                        createAt: rz.createdAt,
                        driverPictures: rz.driverPictures,
                        vehicleDetails: rz.vehicleDetails,
                        business: rz.business,
                        insurance: rz.insurance,
                        paymentMethods: rz.paymentMethods,
                    };
                })
            });
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    getRejectedDrivers: async (req, res) => {
        try {
            const drivers = await DriverModel.find({driverRejected: true});

            return res.status(200).json({
                success : true, data: drivers.map(function (rz){
                    return {
                        id: rz.driverId,
                        isEmailVerified: rz.isEmailVerified,
                        isSubscribed: rz.isSubscribed,
                        firstName: rz.firstName,
                        lastName: rz.lastName,
                        email: rz.email,
                        gender: rz.gender,
                        phone: rz.phone,
                        createAt: rz.createdAt,
                        driverPictures: rz.driverPictures,
                        vehicleDetails: rz.vehicleDetails,
                        business: rz.business,
                        insurance: rz.insurance,
                        paymentMethods: rz.paymentMethods,
                    };
                })
            });
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },


    approveDriver: async (req, res) => {
        try {
            const driver = await DriverModel.findOne({driverId: req.body.driverId});
            if(!driver) {
                return res.status(401).json({ success : false,  message: 'driver-not-found' });
            }

            driver.driverAccepted = true;

            const result = await driver.save();
            
            if(result.isModified) {
                return res.status(200).json({success : true, message: "driver-accepted"});
            } else {
                return res.status(500).json({ success : false, message: "failed-to-update-database"  });
            }
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    rejectDrivers: async (req, res) => {
        try {
            const driver = await DriverModel.findOne({driverId: req.body.driverId});
            if(!driver) {
                return res.status(401).json({ success : false,  message: 'driver-not-found' });
            }

            driver.driverRejected = true;
            driver.driverAccepted = null;

            const result = await driver.save();
            
            if(result.isModified) {
                return res.status(200).json({success : true, message: "driver-rejected"});
            } else {
                return res.status(500).json({ success : false, message: "failed-to-update-database"  });
            }
        } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    showAllReviews: async (req, res) => {
        try {
            const reviews = await ReviewModel.aggregate([
                {
                    $lookup: {
                        from: 'riders',  // Collection name for RiderModel (lowercase by default)
                        localField: 'userId',  // Field from ReviewModel (userId)
                        foreignField: 'riderId',  // Field from RiderModel (riderId)
                        as: 'rider'  // Alias for the joined data
                    }
                },
                {
                    $lookup: {
                        from: 'drivers',  // Collection name for DriverModel (lowercase by default)
                        localField: 'driverId',  // Field from ReviewModel (driverId)
                        foreignField: 'driverId',  // Field from DriverModel (driverId)
                        as: 'driver'  // Alias for the joined data
                    }
                },
                {
                    $project: {
                        reviewId: 1,
                        stars: 1,
                        message: 1,
                        tripId: 1,
                        userId: 1,
                        userName: {
                            $cond: {
                                if: { $isArray: '$rider' },
                                then: { $concat: [{ $first: '$rider.firstName' }, ' ', { $first: '$rider.lastName' }] },
                                else: 'Unknown'
                            }
                        },
                        driverId: 1,
                        driverName: { 
                            $cond: {
                                if: { $isArray: '$driver' },
                                then: { $concat: [{ $first: '$driver.firstName' }, ' ', { $first: '$driver.lastName' }] },
                                else: 'Unknown'
                            }
                        },
                        driverReview: { $ifNull: [{ $arrayElemAt: ['$driver.ratingStar', 0] }, 0.5] },
                        createdAt: 1,
                    }
                }
            ]);
    
            return res.status(200).json({
                success: true,
                data: reviews
            });
        } catch (error) {
            return res.status(500).json({ success: false, data: error.message });
        }
    },
    

    updateReview: async (req, res) => {
        try{
            console.log(req.params.reviewId);
            const review = await ReviewModel.findOne({reviewId: req.params.reviewId});

            if(!review) {
                return res.status(401).json({success : false, data: 'review-not-found'});
            } 

            review.message = req.body.message;
            review.stars = req.body.stars;
            
            const result = await review.save();
            
            if(result.isModified) {
                return res.status(200).json({success : true, message: "review-updated"});
            } else {
                return res.status(500).json({ success : false, message: "failed-to-update-database"  });
            }

         } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },
    
    
    deleteReview: async (req, res) => {
        try{
            const review = await ReviewModel.findOneAndDelete({reviewId: req.params.reviewId});
            
            if(review) {
                return res.status(200).json({success : true, data: review});
            } else {
                return res.status(410).json({success : false, data: 'delete-review-failed'});
            }


         } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    },

    getTransactions: async (req, res) => {
        try{
            const transaction = await TransactionModel.find({});
            
            let total = 0.0;
            let withdrawal = 0.0;

            let tripTrans = [];
            let withdrawTrans = [];

            transaction.forEach(tran => {
                if(tran.driverWithdrawal == false) {
                    tripTrans.push(tran);
                    total += tran.amount;
                } else {
                    total -= tran.amount;
                    withdrawal += tran.amount;
                    withdrawTrans.push(tran);
                }
            });

            console.log(total.toFixed(2));
            console.log(withdrawal.toFixed(2));


            if(transaction) {
                return res.status(200).json({
                    success : true, 
                    tripTransactionAmount: total.toFixed(2), tripTransactions: tripTrans, 
                    withdrawTransactionAmount: withdrawal.toFixed(2), withdrawTransactions: withdrawTrans  
                });
            } else {
                return res.status(410).json({success : false, data: 'delete-review-failed'});
            }


         } catch (error) {
            return res.status(500).json({ success : false, data: error  });
        }
    }

}