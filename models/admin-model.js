const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    adminId: {
        type: String, 
        required: true, 
    }, 
    name: {
        type: String,
    }, 
    email:{
        type: String,
    },
    profilePicture: {
        type: String
    },
    password: {
        type: String,
    },
    canRead: {
        type: Boolean,
        default: true,
    }, 
    canWrite: {
        type: Boolean,
        default: false,
    }, 
    canExecute: {
        type: Boolean,
        default: false,
    },
    refreshToken :{
        type: String,
        default: "",
    },
    refreshTokenExpiration : {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


const AdminModel = mongoose.model('admins', AdminSchema);
module.exports = AdminModel;