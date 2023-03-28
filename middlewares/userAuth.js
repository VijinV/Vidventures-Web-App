
const userModel = require('../models/userModel')

const isLogin = async (req, res, next) => {
  if (req.session.user_id) {

  const userData = await userModel.getUserById(req.session.user_id)

  if(userData.isVerified){   
    next();
  }
  else{
    res.redirect("/login");

  }

  } else {
    res.redirect("/login");
  }
};

const isLogout = (req, res, next) => {
  if (req.session.user_id) {
    res.redirect("/");
  } else {
    next();
  }
};

const logout = (req, res) => {
  req.session.user_id = null;
  res.redirect("/");
};

module.exports = {
    isLogin,
    isLogout,
    logout
}
