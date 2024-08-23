const mongoose = require('mongoose');
const url = "mongodb+srv://thecyfrin:8xiFPj0BOv5IDxzW@cluster0.z7ob6.mongodb.net/cochevia?retryWrites=true&w=majority&appName=Cluster0";;

mongoose.connect(url)
.then(() => {
    console.log("Mongo DB connected");
}) .catch((err) => {
    console.log("Error in mongo: ", err);
})  