const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RiderSchema = new Schema({
    riderId: {
        type: String, 
        required: true,
        index: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    otpCode: {
        type: String,
      
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profilePicture: {
        type: String,
        default: 'http://192.168.10.115:8080/uploads/fcochevia-demo.png'
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    state: {
        type: String
    },
    phone: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    refreshToken :{
        type: String,
        default: "",
    },
    refreshTokenExpiration : {
        type: Date,
        default: Date.now,
    }
})

const RiderModel = mongoose.model('riders', RiderSchema);
module.exports = RiderModel;