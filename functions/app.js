const express = require('express');
const routes = require('../routes');
const bodyParser = require('body-parser');
const serverless = require("serverless-http");
const adminRoutes = require('../routes/admin-routes');

const app = express();
require('dotenv').config();
require('../config/db');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORTNUMBER = process.env.PORT || 8080;


// Define the routes for admin and root
app.use('/api/v1/admin/', adminRoutes); // Admin routes (without the Netlify-specific prefix)
app.use('/api/v1/', routes);           // General routes

// Serve static files
app.use('/uploads', express.static('src/constructing'));

// Export the handler for serverless
module.exports.handler = serverless(app);

// Local server (useful for local development)
if (process.env.NODE_ENV !== 'production') {

    app.listen(PORTNUMBER, () => {
        console.log(`Server is up and running on PORT: ${PORTNUMBER}`);
    });
}
