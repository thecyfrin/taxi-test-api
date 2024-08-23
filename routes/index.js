const express = require('express');
const { registerUser, loginUser, getUsers } = require('../usercontroller');
const { userRegisterValidate, userLoginValidate } = require('../utils/userValidation');
const { ensureAuthenticated } = require('../utils/auth');

const routes = express.Router();


routes.get("/", (req, res) => {
    res.send("App is running..");
});

routes.post('/register', userRegisterValidate, registerUser);

routes.post('/login', userLoginValidate, loginUser);

routes.get('/users',  ensureAuthenticated, getUsers);


module.exports = routes;
