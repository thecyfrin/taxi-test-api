const UserModel = require('../models/usermodel');

const jwt = require('jsonwebtoken');

module.exports = {
    // validate req.body
    // create mongodb UserModel
    // password encryption
    // save data to mongo dv
    // return response to client
    registerUser: async (req,res) => {
        const userModel = new UserModel(req.body);

        try {
            
            const response = await userModel.save();
            response.password = undefined;
            return res.status(201).json({ message: 'success', data: response });
        } catch (error) {
            return res.status(500).json({ message: 'failed', data: error  });
        }
    },

    loginUser: async (req,res) => {
        try {
            const user = await UserModel.findOne({email: req.body.email});
            if(!user) {
                return res.status(401).json({ message: 'email-not-found', data: "Insert a valid email address" });
            }

            const isPassEqual = String.compare(req.body.password, user.password);
            if(!isPassEqual) {
                return res.status(401).json({ message: 'wrong-password', data: "Enter correct password" });
            }
            const tokenObject = {
                _id : user._id,
                firstName : user.firstName,
                lastName : user.lastName,
                email : user.email,
                gender : user.gender,
                phone : user.phone
            }

            const jwtToken = jwt.sign(tokenObject, "full-secret", {expiresIn : '4h'});
            
            return res.status(201).json({ jwtToken, tokenObject });

        } catch (error) {
            return res.status(500).json({ message: 'failed', data: error  });
            
        }
    },

    getUsers: async (req,res) =>{
        try {
            const users = await UserModel.find({}, {password: 0});
            return res.status(200).json({data: users});
        } catch (error) {
            return res.status(500).json({ message: 'failed', data: error  });
        }
    }
}
