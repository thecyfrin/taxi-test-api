const { geoFire } = require("../../config/firebase");
const DriverModel = require("../../models/driver-model");
const { sendSingleNotification } = require("../notification");

const sendNotificationOfTripToDrivers = async (
	lat,
	lng,
	vehicleTier,
	userName,
	tripId
) => {
	try {
		// Initialize the GeoQuery
		var geoQuery = geoFire.query({
			center: [lat, lng], // center of the query
			radius: 10.5, // radius in kilometers
		});

		// Array to hold driver details within the radius
		let driversInRadius = [];

		geoQuery.on("key_entered", async (driverId, location, distance) => {
			console.log(
				`Driver entered: ${driverId}, Location: ${location}, Distance: ${distance}`
			);

			// Add the driver details to the list
			driversInRadius.push({
				driverId,
				location,
				distance,
			});
		});

		if (driversInRadius.length > 20) {
			geoQuery.cancel();
		}

		setTimeout(() => {
			geoQuery.cancel();
			driversInRadius.forEach(async (each) => {
				const driver = await DriverModel.findOne({ driverId: each.driverId });
				// const vehicle = driver.vehicleDetails.find(
				// 	(v) => v.isActive === true && v.vehicleTier === vehicleTier
				// );
				// const vehicle = driver.vehicleDetails.find(
				// 	(v) => v.vehicleTier === vehicleTier
				// );
				// if (!vehicle) {
				// 	console.log("Not found the vehicle");
				// }
				if (driver.fcmToken != null) {
					console.log(
						`Sending notification to ${driver.firstName} (${driver.driverId})`
					);
					await sendSingleNotification(
						driver.fcmToken,
						"Ride Request",
						`${userName} is waiting for a trip`,
						tripId
					);
				}
			});
		}, 5000); // Wait for 5 seconds (adjust as necessary)
	} catch (error) {
		console.error("Geofire error:", error.message);
		throw new Error("Sending Notification Failed");
	}
};

module.exports = { sendNotificationOfTripToDrivers };
