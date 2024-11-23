const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DriverSchema = new Schema({
	driverId: {
		type: String,
		index: true,
		required: true,
	},
	driverAccepted: {
		type: Boolean,
		default: false,
	},
	driverRejected: {
		type: Boolean,
	},
	isEmailVerified: {
		type: Boolean,
		default: false,
	},
	isActive: {
		type: Boolean,
		default: false,
	},
	isSubscribed: {
		type: Boolean,
		default: false,
	},
	rideStatus: {
		type: String,
		default: null,
	},
	otpCode: String,
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	country: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	refreshToken: {
		type: String,
		default: "",
	},
	refreshTokenExpiration: {
		type: Date,
		default: Date.now,
	},
	driverPictures: {
		profilePicture: { type: String },
		dlFront: { type: String },
		dlBack: { type: String },
	},
	vehicleDetails: [
		{
			id: String,
			carName: String,
			carModel: String,
			vinNum: String,
			vehicleTier: String,
		},
	],
	totalTrips: {
		type: Number,
	},
	ratingStar: {
		type: Number,
	},
	passDetails: {
		passId: String,
		passName: String,
		passStart: Date,
		passEnd: Date,
	},
	insurance: {
		policyNo: String,
		holderName: String,
		policyCompany: String,
	},
	business: {
		businessName: String,
		bIdentification: String,
	},
	paymentMethods: {
		bankMethod: {
			accountHolder: String,
			accountNumber: String,
			routing: String,
			bankName: String,
		},
		paypal: {
			paypalEmail: String,
			paypalUsername: String,
		},
		stripe: {
			stripeEmail: String,
			stripeUsername: String,
		},
	},
});

const DriverModel = mongoose.model("drivers", DriverSchema);
module.exports = DriverModel;
