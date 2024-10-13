const Joi = require('joi');

const inviteAdminValidation = (req, res, next) => {
    
    const schema = Joi.object({
        email: Joi.string().required(),  
    });
    
    const {err, value} = schema.validate(req.body);
    if(err) {
        return res.status(400).json({success : false, data :  err});
    } 
    next();
}

const createAdminValidation = (req, res, next) => {
    
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),  
        password: Joi.string().required(),
        profilePicture: Joi.string().optional(),

    });
    
    const {err, value} = schema.validate(req.body);
    if(err) {
        return res.status(400).json({success : false, data :  err});
    } 
    next();
}


const subsModificationValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),  
        passImage: Joi.string().required(), 
        benefits: Joi.string().optional(),
        package: Joi.string().optional, 
    });
    
    const {err, value} = schema.validate(req.body);
    if(err) {
        return res.status(400).json({success : false, data :  err});
    } 
    next();
}

const reviewModificationValidation = (req, res, next) => {
    const schema = Joi.object({
        message: Joi.string().required(),  
        stars: Joi.string().optional(),
    });
    
    const {err, value} = schema.validate(req.body);
    if(err) {
        return res.status(400).json({success : false, data :  err});
    } 
    next();
}


const validateDriverId = (req, res, next) => {
    
    const schema = Joi.object({
        driverId: Joi.string().required(),  
    });
    
    const {err, value} = schema.validate(req.body);
    if(err) {
        return res.status(400).json({success : false, data :  err});
    } 
    next();
}



module.exports = {
    inviteAdminValidation, createAdminValidation, validateDriverId, subsModificationValidation, reviewModificationValidation,
}