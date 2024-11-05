const express = require('express');
const routes = require('./routes');
const https = require('https');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin-routes');

// const serverless = require("serverless-http");

const app = express();
require('dotenv').config();
require('./config/db');

const ipaddress = process.env.IP_ADDRESS || "localhost";
const PORTNUMBER = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 


// app.use(`/.netlify/functions/app`, routes); 

// module.exports.handler = serverless(app);
app.use('/uploads', express.static('src/constructing'));
app.use('/admin/', adminRoutes);
app.use('/api/v1/', routes);

// const sslServer = https.createServer({
//     key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
// }, app);

// sslServer.listen(PORTNUMBER, ipaddress, () => {
//     console.log(`Server is up and running of PORT: ${PORTNUMBER}`);
// })

app.listen(PORTNUMBER, () => {
    console.log(`Server is up and running of PORT: ${PORTNUMBER}`);
})


