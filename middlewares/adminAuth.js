const isLogin = (req, res,next) => {
  if (req.session.admin_id) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};


const isLogout = (req, res,next) => {

    if(req.session.admin_id){

        res.redirect('/admin')

    }else{
        next();
    }

}

const logout = (req, res, next) => {

    req.session.admin_id = null;
    res.redirect('/admin/login')

}

module.exports = {
    isLogin,
    isLogout,
    logout
}