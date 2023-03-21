const bcrypt = require('bcrypt');


const loadDashboard = (req, res, next) => {
    res.render('dashboard.hbs')
}

const loadLogin = (req, res, next) => {
    res.render('login.hbs')
}

module.exports ={
    loadLogin,
    loadDashboard
}