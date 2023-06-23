const express = require("express");
const route = express();
const multer = require("../config/multer");

const adminController = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");
const dashboard = require("../controllers/dashboard");

route.get("/", adminAuth.isLogin, dashboard.loadDashboard);

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

route.get('/order',adminAuth.isLogin,adminController.listOrders2)

route.get('/viewOrder',adminAuth.isLogin,adminController.viewOrder)

route.get('/review',adminAuth.isLogin,adminController.loadReview)

route.get('/addReview',adminAuth.isLogin,adminController.loadAddReview)

route.get("/listReview",adminAuth.isLogin, adminController.listReview)

route.get("/dltReview",adminAuth.isLogin, adminController.deleteReview)

route.get('/startScripting',adminAuth.isLogin, adminController.startScripting)

route.get('/moveToThumbnail',adminAuth.isLogin, adminController.moveToThumbnail)

route.get('/moveToVoiceover',adminAuth.isLogin, adminController.moveToVoiceover)

route.get('/moveToVideoEditing',adminAuth.isLogin, adminController.moveToVideoEditing)

route.get('/moveToCopyright',adminAuth.isLogin, adminController.moveToCopyright)

route.get('/coordinators',adminAuth.isLogin, adminController.loadCoordinators)

route.get('/blockCord',adminAuth.isLogin, adminController.blockCord)

route.get('/listPosts',adminAuth.isLogin, adminController.listPost)

route.get('/addPost',adminAuth.isLogin, adminController.loadAddPost)

route.get('/unListPosts',adminAuth.isLogin, adminController.unListPosts)

route.get('/lightbox',adminAuth.isLogin, adminController.loadFormData)

route.get('/addPriceTableList',adminAuth.isLogin,adminController.loadPriceTableList)

route.get('/listBlogs',adminAuth.isLogin,adminController.loadBlog)

route.get('/careers',adminAuth.isLogin, adminController.careerList)

route.get('/createJob',adminAuth.isLogin,adminController.loadAddCareer)

route.get('/editCareer',adminAuth.isLogin,adminController.loadAddCareer)

route.get('/openJob',adminAuth.isLogin,adminController.listCareers)

route.get('/logout',adminAuth.logout)


// POST method  
 
route.post("/login", adminAuth.isLogout, adminController.verifyAdmin);

route.post("/addProduct", multer.upload, adminController.addProduct);

route.post('/editProduct',multer.upload,adminController.editProduct)

route.post('/coupon',adminAuth.isLogin,adminController.addCoupon)

route.post('/addLink',adminController.addLink)

route.post('/addReview',adminAuth.isLogin,multer.upload,adminController.addReview)

route.post('/addDriveLink',adminAuth.isLogin,adminController.DeliverOrder)

route.post('/addPost',adminAuth.isLogin,multer.upload,adminController.addPost)
route.post('/createJob',adminAuth.isLogin,adminController.addCareer)





module.exports = route;
