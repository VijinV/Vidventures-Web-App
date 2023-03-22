const express = require('express');
const route = express();

const adminController = require('../controllers/adminController')
const adminAuth = require('../middlewares/adminAuth');



route.get('/',adminAuth.isLogin,adminController.loadDashboard)

route.get('/login',adminAuth.isLogout,adminController.loadLogin)

route.post('/login',adminAuth.isLogout,adminController.verifyAdmin)

route.get('/userList',adminAuth.isLogin,adminController.loadUser)

























module.exports = route