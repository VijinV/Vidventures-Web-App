const express = require('express');
const route = express();

const userController = require('../controllers/userController');




route.get('/',userController.loadHome)

route.get('/login',userController.loadLogin)

route.post('/register',userController.registerUser)

route.get('/verify',userController.verifyUserEmail)

route.post('/login',userController.verifyUser)























module.exports = route