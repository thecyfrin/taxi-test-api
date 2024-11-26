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

const socketServer = http.createServer(app); // Separate server for Socket.IO
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
