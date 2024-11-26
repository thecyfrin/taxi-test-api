const express = require("express");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const cors = require("cors");
const http = require("http");
const adminRoutes = require("../routes/admin-routes");
const routes = require("../routes");
const { setupSocket } = require("../config/socket");

const app = express();
require("dotenv").config();
require("../config/db");

const apiServer = http.createServer(app); // Server for Express
const socketServer = http.createServer(); // Separate server for Socket.IO
const PORT_SOCKET = 3000; // Port for Socket.IO server
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

setupSocket(socketServer);

// Define the routes for admin and root
app.use("/api/v1/admin/", adminRoutes); // Admin routes (without the Netlify-specific prefix)
app.use("/api/v1/", routes); // General routes

// Enable CORS
app.use(
	cors({
		origin: "https://cochevia.netlify.app/",
	})
);

// Export the handler for serverless
module.exports.handler = serverless(app);

// Start the local server if not in a serverless environment
if (process.env.NODE_ENV !== "production") {
	const PORT = process.env.PORT || 3000;
	apiServer.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
	});
}

// Start Socket.IO server on port 3000
socketServer.listen(PORT_SOCKET, () => {
	console.log(`Socket.IO server is running on http://localhost:${PORT_SOCKET}`);
});

// OLD CODE
// const express = require("express");
// const bodyParser = require("body-parser");
// const serverless = require("serverless-http");
// const cors = require("cors");
// const adminRoutes = require("../routes/admin-routes");
// const routes = require("../routes");

// const app = express();
// require("dotenv").config();
// require("../config/db");

// // Body parser middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Define the routes for admin and root
// app.use("/api/v1/admin/", adminRoutes); // Admin routes (without the Netlify-specific prefix)
// app.use("/api/v1/", routes); // General routes

// // Serve static files

// // Export the handler for serverless
// module.exports.handler = serverless(app);

// // Local server (useful for local development)
// app.use(
// 	cors({
// 		origin: "https://cochevia.netlify.app/",
// 	})
// );
