const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin-routes');

const app = express();
require('dotenv').config();
require('./config/db');

const PORTNUMBER = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/uploads', express.static('src/constructing'));
app.use('/admin/', adminRoutes);
app.use('/api/v1/', routes);

app.listen(PORTNUMBER, () => {
    console.log(`Server is up and running of PORT: ${PORTNUMBER}`);
})