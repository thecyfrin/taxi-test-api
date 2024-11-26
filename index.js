const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin-routes");
const routes = require("./routes");
const http = require("http");
const { setupSocket } = require("./config/socket");

require("dotenv").config();
require("./config/db");
require("./config/firebase");

const app = express();
const apiServer = http.createServer(app); // Server for Express
const socketServer = http.createServer(); // Separate server for Socket.IO

const PORT_API = process.env.PORT || 8080; // Port for API server
const PORT_SOCKET = 3000; // Port for Socket.IO server

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

setupSocket(socketServer);
// Routes
app.use("/admin/", adminRoutes);
app.use("/api/v1/", routes);

// Start API server
apiServer.listen(PORT_API, () => {
	console.log(`API server is running on http://localhost:${PORT_API}`);
});

// Start Socket.IO server on port 3000
socketServer.listen(PORT_SOCKET, "0.0.0.0", () => {
	console.log(`Socket.IO server is running on http://localhost:${PORT_SOCKET}`);
});

// // Utility to get the local IP address
// const os = require("os");
// const getLocalIpAddress = () => {
//   const interfaces = os.networkInterfaces();
//   for (const interfaceName in interfaces) {
//     for (const interfaceInfo of interfaces[interfaceName]) {
//       if (interfaceInfo.family === "IPv4" && !interfaceInfo.internal) {
//         return interfaceInfo.address;
//       }
//     }
//   }
//   return "127.0.0.1";
// };
