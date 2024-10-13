const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PassSchema = new Schema({
    passImage: {
        type: String,

    },
    name: {
        type: String,
    },
    benefits: {
        type: Array,
    },
    packages: [
        {
            packageType: String,
            packageName: String,
            packagePrice: Number,
        }
    ]
})

const DriverPass = mongoose.model('premium-pass', PassSchema);
module.exports = DriverPass;