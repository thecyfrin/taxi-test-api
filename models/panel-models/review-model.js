const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    reviewId: {
        type: String, 
        required: true,
    },
    tripId: {
        required: true,
        type: String,
    },
    userId: {
        required: true,
        type: String,
    },
    driverId: {
        required: true,
        type: String,
    },
    stars: {
        type: Number
    },
    message: {
        type: String
    },
    country:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
})

const ReviewModel = mongoose.model('review', ReviewSchema);
module.exports = ReviewModel;