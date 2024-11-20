const Joi = require("joi");

const userRegisterValidate = (req, res, next) => {
	const schema = Joi.object({
		firstName: Joi.string().min(2).max(12).required(),
		lastName: Joi.string().min(2).max(12).required(),
		email: Joi.string().required(),
		password: Joi.string().min(5).alphanum().required(),
		gender: Joi.string().min(2).max(12).required(),
		phone: Joi.string().min(8).required(),
	});

	const { err, value } = schema.validate(req.body);
	if (err) {
		return res.status(400).json({ success: false, data: err });
	}
	next();
};

const completeRegistrationValidate = (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		fullName: Joi.string().required(),
		state: Joi.string().required(),
		image: Joi.string().optional(), // Not required because multer handles the file
	});

	// Validate the fields inside req.body (parsed after multer runs)
	const { err, value } = schema.validate(req.body);
	if (err) {
		return res
			.status(400)
			.json({ success: false, data: err.details[0].message });
	}
	next();
};

const completeDriverRegistrationValidate = (req, res, next) => {
	const schema = Joi.object({
		profilePicture: Joi.string().optional(),
		dlFront: Joi.string().optional(),
		dlBack: Joi.string().optional(),
		vehicleName: Joi.string().required(),
		vehicleModel: Joi.string().required(),
		vehicleVin: Joi.string().required(),
		insurancePolicyNo: Joi.string().required(),
		insuranceHolderName: Joi.string().required(),
		insuranceCompany: Joi.string().required(),
		businessName: Joi.string().required(),
		businessId: Joi.string().required(),
		bankAccountHolder: Joi.string().optional(),
		bankAccountNumber: Joi.string().optional(),
		bankRouting: Joi.string().optional(),
		bankName: Joi.string().optional(),
		paypalEmail: Joi.string().optional(),
		paypalUsername: Joi.string().optional(),
		stripeEmail: Joi.string().optional(),
		stripeUsername: Joi.string().optional(),
	});

	const { err, value } = schema.validate(req.body);
	if (err) {
		return res.status(400).json({ success: false, data: err.message });
	}
	next();
};

const userLoginValidate = (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string().required(),
		password: Joi.string().min(5).alphanum().required(),
	});

	const { err, value } = schema.validate(req.body);
	if (err) {
		return res.status(400).json({ success: false, data: err });
	}
	next();
};

const userRefreshValidate = (req, res, next) => {
	const schema = Joi.object({
		refreshToken: Joi.string().required(),
		email: Joi.string().required(),
	});

	const { err, value } = schema.validate(req.body);
	if (err) {
		return res
			.status(400)
			.json({ success: false, message: "invalid-token", err });
	}
	next();
};

const resendOtpValidate = (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string().required(),
	});

	const { err, value } = schema.validate(req.body);

	if (err) {
		return res
			.status(400)
			.json({ success: false, message: "invalid-otp", err });
	}
	next();
};

const userOtpValidate = (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string().required(),
		otpCode: Joi.string().max(4).min(4).required(),
	});

	const { err, value } = schema.validate(req.body);

	if (err) {
		return res
			.status(400)
			.json({ success: false, message: "invalid-otp", err });
	}
	next();
};

const userInfoChangeValidate = (req, res, next) => {
	const schema = Joi.object({
		firstName: Joi.string().min(2).max(12).required(),
		lastName: Joi.string().min(2).max(12).required(),
		email: Joi.string().required(),
		password: Joi.string().min(5).alphanum().required(),
		gender: Joi.string().min(2).max(12).required(),
		phone: Joi.string().min(8).required(),
	});

	const { err, value } = schema.validate(req.body);
	if (err) {
		return res.status(400).json({ success: false, data: err });
	}
	next();
};

const userPasswordChangeValidate = (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string().required(),
		oldPassword: Joi.string().min(5).alphanum().required(),
		newPassword: Joi.string().min(5).alphanum().required(),
	});

	const { err, value } = schema.validate(req.body);
	if (err) {
		return res.status(400).json({ success: false, data: err });
	}
	next();
};

module.exports = {
	userRegisterValidate,
	completeRegistrationValidate,
	completeDriverRegistrationValidate,
	userLoginValidate,
	userRefreshValidate,
	resendOtpValidate,
	userOtpValidate,
	userInfoChangeValidate,
	userPasswordChangeValidate,
};
