const express = require('express');
const routes = require('../routes');
const bodyParser = require('body-parser');
const serverless = require("serverless-http");
const adminRoutes = require('../routes/admin-routes');

const app = express();
require('dotenv').config();
require('../config/db');


const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Add this line


app.use(`/.netlify/functions/app`, routes); 
app.use('/uploads', express.static('src/constructing'));
app.use('/admin/', adminRoutes)

module.exports.handler = serverless(app);



app.listen(PORT, () => {
    console.log(`Server is up and running of PORT: ${PORT}`);
})


