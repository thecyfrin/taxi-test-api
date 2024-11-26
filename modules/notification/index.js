const private_key = require("./serviceAccountKey.json");
const admin = require("firebase-admin");

admin.initializeApp({
	credential: admin.credential.cert(private_key),
	databaseURL:
		"https://gazipur-city-default-rtdb.asia-southeast1.firebasedatabase.app",
});
const sendSingleNotification = async (token, title, description, tripId) => {
	if (!token) {
		console.log("No valid token provided.");
		return;
	}

	const message = {
		token, // Single token
		notification: {
			title,
			body: description,
		},
		data: {
			tripId: tripId,
		},
		android: { priority: "high" },
		apns: {
			payload: {
				aps: {
					badge: 42,
				},
			},
		},
	};

	try {
		const response = await admin.messaging().send(message);
		console.log("Successfully sent message:", response);
	} catch (error) {
		// Handle specific error codes
		if (
			error.errorInfo &&
			error.errorInfo.code === "messaging/registration-token-not-registered"
		) {
			console.error(`Invalid FCM token detected: ${token}`);
			// Remove the invalid token from your database
		} else {
			console.error("Error sending notification:", error);
		}
	}
};

module.exports = { sendSingleNotification };
