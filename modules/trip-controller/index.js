const RiderModel = require("../../models/rider-model");
const DriverModel = require("../../models/driver-model");
const TripModel = require("../../models/trip-model");
const { generateUUID, calculateBaseFare } = require("../utils/utils-class");
const { getIO } = require("../../config/socket");
const {
	sendNotificationOfTripToDrivers,
} = require("../utils/sendNotificationToDrivers");

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
			trip.tripStatus = "waiting";
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

			await trip.save();

			await sendNotificationOfTripToDrivers(
				req.body.pickupLat,
				req.body.pickupLong,
				req.body.vehicleTier,
				`${rider.firstName} ${rider.lastName}`,
				id
			);

			const tripObject = {
				tripId: trip.tripId,
				tripStatus: trip.tripStatus,
				pickup: trip.pickup,
				destination: trip.destination,
				baseFare: trip.baseFare,
			};
			// Emit tripCreated event to the rider's room
			const io = getIO();
			io.to(trip.tripId).emit("tripCreated", tripObject);
			return res.status(201).json({ success: true, tripObject });
		} catch (error) {
			return res
				.status(500)
				.json({ success: false, message: "trip-create-failed", data: error });
		}
	},

	//Driver section

	getRideInformation: async (req, res) => {
		try {
			const { tripId } = req.body;

			const trip = await TripModel.findOne({ tripId });
			// if (!trip || trip.tripStatus != "waiting") {
			if (!trip) {
				return res
					.status(401)
					.json({ success: false, message: "trip-not-available" });
			}

			console.log("Doing something");
			const user = await RiderModel.findOne({ riderId: trip.userId });

			if (!user) {
				return res
					.status(401)
					.json({ success: false, message: "user-not-found" });
			}

			console.log(user);

			const tripObject = {
				tripId: trip.tripId,
				userId: user.riderId,
				totalDistance: trip.totalDistance,
				totalDuration: trip.totalDuration,
				baseFare: trip.baseFare,
				userPhoto: user.profilePicture,
				userPhone: user.phone,
				userName: `${user.firstName} ${user.lastName}`,
			};

			res.status(201).json({ success: true, tripObject });
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "getting-trip-info-failed",
				data: error,
			});
		}
	},

	acceptTrip: async (req, res) => {
		try {
			const { tripId, driverId, driverLat, driverLong } = req.body;

			const trip = await TripModel.findOne({ tripId });
			// if (!trip || trip.tripStatus != "waiting") {
			if (!trip) {
				return res
					.status(201)
					.json({ success: false, message: "trip-not-available" });
			}

			trip.driverId = driverId;
			await trip.save();

			const user = await RiderModel.findOne({ riderId: trip.userId });

			if (!user) {
				return res
					.status(401)
					.json({ success: false, message: "user-not-found" });


			const driver = await DriverModel.findOne({ driverId });

			if (!driver) {
				return res
					.status(401)
					.json({ success: false, message: "driver-not-found" });
			}

			const driverObject = {
				tripId: trip.tripId,
				driverId: trip.driverId,
				photo: driver.driverPictures.profilePicture,
				driverName: `${driver.firstName} ${driver.lastName}`,
				phone: driver.phone,
				business: driver.business.businessName,
				vehicleName: driver.vehicleDetails.vehicleName,
				vehicleTier: driver.vehicleDetails.vehicleTier,
				carLicense: driver.vehicleDetails.carLicense,
				totalTrips: driver.totalTrips,
				rating: driver.ratingStar,
			};

			const driverLatLng = {
				lat: driverLat,
				lng: driverLong,
			};

			console.log("Giving vibes");

			const io = getIO();
			io.to(trip.tripId).emit("tripAccepted", { driverObject, driverLatLng });

			console.log("IO sent!");

			const tripObject = {
				tripId: trip.tripId,
				userId: user.riderId,
				totalDistance: trip.totalDistance,
				totalDuration: trip.totalDuration,
				baseFare: trip.baseFare,
				userPhoto: user.profilePicture,
				userPhone: user.phone,
				userName: `${user.firstName} ${user.lastName}`,
				pickupLocation: trip.pickup.main_text,
				pickupLat: trip.pickup.pickupLat,
				pickupLong: trip.pickup.pickupLong,
			};

			res.status(201).json({ success: true, tripObject });
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: "getting-trip-info-failed",
				data: error,
			});
		}
	},
};
