const { Server } = require("socket.io");
const TripModel = require("../models/trip-model");

let io;

const setupSocket = (server) => {
	console.log(`User Setup`);
	io = new Server(server, {
		cors: {
			// origin: "*", // Adjust the origin as needed for your setup
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket) => {
		console.log(`A user connected: ${socket.id}`);

		// Join room for tripId
		socket.on("joinTripRoom", (tripId) => {
			console.log(`Socket ${socket.id} joined trip room: ${tripId}`);
			socket.join(tripId); // Both driver and user join the same room
		});

		// Handle disconnection
		socket.on("disconnect", () => {
			console.log(`User disconnected: ${socket.id}`);
		});
	});

	console.log("Socket.IO initialized");
};

const getIO = () => {
	if (!io) {
		throw new Error("Socket.io is not initialized!");
	}
	return io;
};

module.exports = { setupSocket, getIO };
