const Joi = require('joi');

const checkNotificationInput = (req, res, next) => {
    const schema = Joi.object({
        body: Joi.string().max(15).required(),
        description: Joi.string().required(),
        registrationTokens: Joi.string().optional()
    });

    const {err, value} = schema.validate(req.body);
    if(err) {
        return res.status(400).json({success : false, data :  err});
    } 

    const registrationTokens = req.body.registrationTokens;
      if (!Array.isArray(registrationTokens)) {
        return res.status(400).json({ message: "Invalid input: registrationTokens should be an array." });
      }

    next();
}

module.exports = { checkNotificationInput }