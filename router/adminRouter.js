const express = require("express");
const route = express();
const multer = require("../config/multer");

const adminController = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");

route.get("/", adminAuth.isLogin, adminController.loadDashboard);

route.get("/login", adminAuth.isLogout, adminController.loadLogin);

route.get("/product",adminAuth.isLogin, adminController.loadProduct);

route.get("/addProduct",adminAuth.isLogin, adminController.loadAddProduct);

route.get("/unListProduct",adminAuth.isLogin, adminController.ListProduct)

route.get("/userList", adminAuth.isLogin, adminController.loadUser);    

route.get('/editProduct',adminAuth.isLogin,adminController.loadEditProduct)

route.get('/blockUser',adminAuth.isLogin,adminController.blockUser)

route.get('/dltProduct',adminAuth.isLogin,adminController.dltProduct)

route.get('/coupon',adminAuth.isLogin,adminController.loadCoupon)

route.get('/couponBlock',adminAuth.isLogin,adminController.couponBlock)


// POST method 


route.post("/login", adminAuth.isLogout, adminController.verifyAdmin);

route.post("/addProduct", multer.upload, adminController.addProduct);

route.post('/editProduct',adminController.editProduct)
route.post('/coupon',adminAuth.isLogin,adminController.addCoupon)




module.exports = route;
