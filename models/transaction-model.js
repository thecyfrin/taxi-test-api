const  mongoose  = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    transactionId: {
        type: String,
        required: true,
    },
    driverWithdrawal: {
        type: Boolean,
        default: false,
    },
    tripId: {
        type: String
    },
    driverId: {
        type: String,
    },
    userId: {
        type: String
    },
    amount: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

});


const TransactionModel = mongoose.model('transaction', TransactionSchema);
module.exports = TransactionModel;