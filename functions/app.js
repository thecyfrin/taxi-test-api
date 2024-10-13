const express = require('express');
const routes = require('../routes');
const bodyParser = require('body-parser');
const serverless = require("serverless-http");
const adminRoutes = require('../routes/admin-routes');
const cors = require('cors');


const app = express();
require('dotenv').config();
require('../config/db');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Define the routes for admin and root
app.use('/api/v1/admin/', adminRoutes); // Admin routes (without the Netlify-specific prefix)
app.use('/api/v1/', routes);           // General routes

// Serve static files
app.use('/uploads', express.static('src/constructing'));

// Export the handler for serverless
module.exports.handler = serverless(app);

// Local server (useful for local development)
app.use(cors({
    origin: 'https://euphonious-beignet-bce7c4.netlify.app'
}));