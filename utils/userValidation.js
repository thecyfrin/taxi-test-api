const Joi = require('joi');

const userRegisterValidate = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(12).required(),
        lastName: Joi.string().min(2).max(12).required(),
        email: Joi.string().required(),
        password: Joi.string().min(5).alphanum().required(),
        gender: Joi.string().min(2).max(12).required(),
        phone: Joi.string().min(8).required(),
    });
    
    const {err, value} = schema.validate(req.body);
    if(err) {
        return res.status(400).json({message: "Bad Request", err});
    } 
    next();
}

const userLoginValidate = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().min(5).alphanum().required(),
    });
    
    const {err, value} = schema.validate(req.body);
    if(err) {
        return res.status(400).json({message: "Bad Request", err});
    } 
    next();
}

module.exports = {
    userRegisterValidate, userLoginValidate
}