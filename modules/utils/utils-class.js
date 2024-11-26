const { v4: uuidv4 } = require("uuid");

const generateUUID = () => {
	const id = uuidv4();
	return id;
};

const generateOtp = async () => {
	const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
	return otp;
};

const generateFiveCharOtp = async () => {
	const otp = `${Math.floor(10000 + Math.random() * 90000)}`;
	return otp;
};

const calculateBaseFare = (duration, distance, vehicleTier) => {
	const base = 0.1;
	let fareMultiplier;

	if (vehicleTier == "go") {
		fareMultiplier = 1;
	} else if (vehicleTier == "elite") {
		fareMultiplier = 1.5;
	} else if (vehicleTier == "electric") {
		fareMultiplier = 1.5;
	} else if (vehicleTier == "plus") {
		fareMultiplier = 2.0;
	} else if (vehicleTier == "suv") {
		fareMultiplier = 2.5;
	} else if (vehicleTier == "van") {
		fareMultiplier = 2.0;
	} else if (vehicleTier == "kick") {
		fareMultiplier = 0.85;
	} else {
		console.log(vehicleTier);
	}

	const fareAmountPerMinute = (duration / 60) * base * fareMultiplier;
	const fareAmountPerKilometer = (distance / 1000) * base * fareMultiplier;

	const totalFareAmount = fareAmountPerKilometer + fareAmountPerMinute;
	return totalFareAmount.toFixed(2);
};

module.exports = {
	generateUUID,
	generateOtp,
	generateFiveCharOtp,
	calculateBaseFare,
};
