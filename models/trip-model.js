const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TripSchema = new Schema({
	tripId: {
		type: String,
		required: true,
		index: true,
	},
	isTripActive: {
		type: Boolean,
		default: false,
	},
	isTripCancelled: {
		type: Boolean,
		default: false,
	},
	isTripStarted: {
		type: Boolean,
		default: false,
	},
	isTripFinished: {
		type: Boolean,
		default: false,
	},
	driverFound: {
		type: Boolean,
		default: false,
	},

	driverId: {
		type: String,
	},
	userId: {
		type: String,
		required: true,
	},
	totalDistance: {
		type: Number,
	},
	totalDuration: {
		type: Number,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	startedAt: {
		type: Date,
	},
	endAt: {
		type: Date,
	},
	tripNote: {
		type: String,
	},
	country: {
		type: String,
	},
	pickup: {
		main_text: String,
		pickupLat: String,
		pickupLong: String,
	},
	destination: {
		main_text: String,
		destinationLat: String,
		destinationLong: String,
	},
	baseFare: {
		type: Number,
		default: 0.0,
	}, 
	finalFare: {
		type: Number,
		default: 0.0,
	},
	feedbackId: {
		type: String,
	},
	transactionId: {
		type: String,
	},
   
});

const TripModel = mongoose.model("trips", TripSchema);
module.exports = TripModel;
