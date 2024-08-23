const mongoose = require('mongoose');
const url = process.env.MONGOURL;

mongoose.connect(url)
.then(() => {
    console.log("Mongo DB connected");
}) .catch((err) => {
    console.log("Error in mongo: ", err);
})