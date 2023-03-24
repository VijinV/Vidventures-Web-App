const express = require('express');
const route = express();

const userController = require('../controllers/userController');
const userAuth = require('../middlewares/userAuth');


// get 

route.get('/',userController.loadHome)

route.get('/login',userAuth.isLogout,userController.loadLogin)

route.get('/cart',userAuth.isLogin,userController.loadCart)

route.get('/verify',userController.verifyUserEmail)

route.get('/logout',userAuth.logout)

route.get('/profile',userAuth.isLogin,userController.loadProfile)

// post 

route.post('/login',userAuth.isLogout,userController.verifyUser)

route.post('/register',userAuth.isLogout,userController.registerUser)
























module.exports = route