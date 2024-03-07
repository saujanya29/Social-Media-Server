const Router = require("express").Router()
const AuthController = require('../Controllers/authController');


Router.post('/signup',AuthController.signupController);
Router.post('/login',AuthController.loginController);
Router.get('/refresh',AuthController.refreshAccessTokenController);
Router.post('/logout',AuthController.logoutController);






module.exports =Router;