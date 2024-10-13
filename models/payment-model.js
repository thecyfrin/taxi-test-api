const  mongoose  = require("mongoose");
const Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

const PaymentSchema = new Schema({
    splitFare: {
        type: Boolean,
        default: false,
    },
    paymentId: {
        type: String,
        required: true,
        index: true,
    },
    tripId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        
    },
    multiUserId: {
        type: Array,
        default: [],
    },
    driverId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    totalFare: {
        type: Number,
    },
    paymentType: {
        type: String,
    }

});

const PaymentModel = mongoose.model('transaction', PaymentSchema);
module.exports = PaymentModel;