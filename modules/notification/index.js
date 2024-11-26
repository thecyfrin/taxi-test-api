const admin = require("firebase-admin");
require("dotenv").config();

const serviceCert = {
	type: process.env.FIREBASE_ADMIN_TYPE,
	project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
	private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
	private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
	client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
	client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
	auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
	token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
	auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER,
	client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_CERT,
	universe_domain: process.env.FIREBASE_ADMIN_UNIVERSE_DOMAIN,
};

admin.initializeApp({
	credential: admin.credential.cert(serviceCert),
	databaseURL: process.env.DATABASE_URL,
});

const sendSingleNotification = async (token, title, description, tripId) => {
	try {
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

		const response = await admin.messaging().send(message);
		console.log("Successfully sent message:", response);
	} catch (error) {
		// Handle specific error codes
		if (
			error.errorInfo &&
			error.errorInfo.code === "messaging/registration-token-not-registered"
		) {
			console.log(`Invalid FCM token detected: ${token}`);
			// Remove the invalid token from your database
		} else {
			console.log("Error sending notification:", error);
		}
	}
};

module.exports = { sendSingleNotification };
