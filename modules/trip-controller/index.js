const RiderModel = require("../../models/rider-model");
const DriverModel = require("../../models/driver-model");
const TripModel = require("../../models/trip-model");
const { generateUUID, calculateBaseFare } = require("../utils/utils-class");

module.exports = {
	createTrip: async (req, res) => {
		try {
			const rider = await RiderModel.findOne({ riderId: req.body.userId });
			if (!rider) {
				return res
					.status(401)
					.json({ success: false, message: "user-not-found" });
			}

			const id = generateUUID();
			const trip = new TripModel();
			trip.isTripActive = true;
			trip.tripId = id;
			trip.userId = req.body.userId;
			trip.totalDuration = req.body.totalDuration;
			trip.totalDistance = req.body.totalDistance;
			trip.pickup.main_text = req.body.pickupLocationText;
			trip.pickup.pickupLat = req.body.pickupLat;
			trip.pickup.pickupLong = req.body.pickupLong;
			trip.destination.main_text = req.body.destinationLocationText;
			trip.destination.destinationLat = req.body.destinationLat;
			trip.destination.destinationLong = req.body.destinationLong;
			trip.baseFare = calculateBaseFare(
				req.body.totalDuration,
				req.body.totalDistance,
				req.body.vehicleTier
			);

			const tripObject = {
				isTripActive: trip.isTripActive,
				tripId: trip.tripId,
				pickup: trip.pickup,
				destination: trip.destination,
				baseFare: trip.baseFare,
			};

			const response = await trip.save();
			if (response.isModified) {
				return res.status(201).json({ success: true, tripObject });
			} else {
				return res
					.status(500)
					.json({ success: false, message: "trip-create-failed" });
			}
		} catch (error) {
			return res
				.status(500)
				.json({ success: false, message: "trip-create-failed", data: error });
		}
	},

	getTripDriverDetails: async (req, res) => {
		try {
			const { tripId } = req.body;
			const trip = await TripModel.findOne({ tripId });
			if (!trip) {
				return res
					.status(401)
					.json({ success: false, message: "trip-not-available" });
			}

			if (trip.isTripCancelled == true) {
				return res
					.status(401)
					.json({ success: false, message: "trip-already-cancelled" });
			}

			if (trip.driverFound == false) {
				return res
					.status(401)
					.json({ success: false, message: "driver-not-found" });
			}

			const driver = DriverModel.findOne({ driverId: trip.driverId });
			if (!driver) {
				return res
					.status(401)
					.json({ success: false, message: "driver-not-found" });
			}

			const driverObject = {
				tripId: trip.tripId,
				id: driver.driverId,
				driverName: `${driver.firstName} ${driver.lastName}`,
				photo: driver.driverPictures.profilePicture,
				phone: driver.phone,
				business: driver.business.businessName,
				vehicleName: driver.vehicleDetails[0].carName,
				vehicleTier: driver.vehicleDetails[0].vehicleTier,
				carLicense: driver.vehicleDetails[0].carLicense,
				totalTrips: driver.totalTrips,
				rating: driver.ratingStar,
				reviews: [],
			};

			return res.status(201).json({ success: true, driverObject });
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "getting-driver-failed",
				data: error,
			});
		}
	},
};
