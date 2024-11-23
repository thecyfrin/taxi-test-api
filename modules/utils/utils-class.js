const { v4: uuidv4,} = require('uuid');

const generateUUID =  () => {
    const id = uuidv4();
    return id;
}

const generateOtp = async () => {
    const otp = `${Math.floor(1000 +Math.random() * 9000)}`;
    return otp;

}

const generateFiveCharOtp = async () => {
    const otp = `${Math.floor(10000 +Math.random() * 90000)}`;
    return otp;
}

const calculateBaseFare = (duration, distance, vehicleTier) => {
    const fareAmountPerMinute = (duration / 60) * 0.1;
    const fareAmountPerKilometer = (distance / 1000) * 0.1;

    const totalFareAmount = fareAmountPerKilometer + fareAmountPerMinute;
    return totalFareAmount.toFixed(2);
}

module.exports = {
    generateUUID, generateOtp, generateFiveCharOtp, calculateBaseFare
};