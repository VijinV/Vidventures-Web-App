const isLogin = (req, res, next) => {
  if (req.session.user_id) {
    next();
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
