const express = require("express");
const route = express();
const multer = require("../config/multer");

const adminController = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");

route.get("/", adminAuth.isLogin, adminController.loadDashboard);

route.get("/login", adminAuth.isLogout, adminController.loadLogin);

route.get("/product", adminController.loadProduct);

route.get("/addProduct", adminController.loadAddProduct);

route.get("/unListProduct", adminController.ListProduct)

route.get("/userList", adminAuth.isLogin, adminController.loadUser);

route.get('/editProduct',adminController.loadEditProduct)



route.post("/login", adminAuth.isLogout, adminController.verifyAdmin);

route.post("/addProduct", multer.upload, adminController.addProduct);

route.post('/editProduct',adminController.editProduct)




module.exports = route;
