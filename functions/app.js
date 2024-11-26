const express = require("express");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const cors = require("cors");
const http = require("http");
const adminRoutes = require("../routes/admin-routes");
const routes = require("../routes");
const { setupSocket } = require("./socket"); // Import the Socket.IO setup

const app = express();
require("dotenv").config();
require("../config/db");

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define the routes for admin and root
app.use("/api/v1/admin/", adminRoutes); // Admin routes (without the Netlify-specific prefix)
app.use("/api/v1/", routes); // General routes

// Enable CORS
app.use(
	cors({
		origin: "https://cochevia.netlify.app/",
	})
);

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
setupSocket(server);

// Export the handler for serverless
module.exports.handler = serverless(app);

// Start the local server if not in a serverless environment
if (process.env.NODE_ENV !== "production") {
	const PORT = process.env.PORT || 3000;
	server.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
	});
}

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
