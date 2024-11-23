const Joi = require("joi");

const tripCreateValidation = (req, res, next) => {
	const schema = Joi.object({
		userId: Joi.string().required(),
		totalDuration: Joi.string().required(),
		totalDistance: Joi.string().required(),
		pickupLocationText: Joi.string().required(),
		pickupLat: Joi.string().required(),
		pickupLong: Joi.string().required(),
		destinationLocationText: Joi.string().required(),
		destinationLat: Joi.string().required(),
		destinationLong: Joi.string().required(),
		vehicleTier: Joi.string().required(),
	});

	const { err, value } = schema.validate(req.body);
	if (err) {
		return res.status(400).json({ success: false, data: err });
	}
	next();
};

const tripGetDriverValidation = (req, res, next) => {
	const schema = Joi.object({
		tripId: Joi.string().required(),
	});

	const { err, value } = schema.validate(req.body);
	if (err) {
		return res
			.status(400)
			.json({ success: false, message: "validation-failed", data: err });
	}
	next();
};

module.exports = {
	tripCreateValidation,
	tripGetDriverValidation,
};
