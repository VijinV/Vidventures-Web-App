const express = require('express');
const route = express();

const adminController = require('../controllers/adminController')



route.get('/',adminController.loadDashboard)

route.get('/login',adminController.loadLogin)

























module.exports = route