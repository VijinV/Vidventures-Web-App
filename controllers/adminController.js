const bcrypt = require("bcrypt");
const adminModel = require("../models/userModel");
const Products = require("../models/productModel");
const couponModel = require("../models/couponModel");
const orderModel = require("../models/orderModel");
const invoice = require("easyinvoice");
const userModel = require("../models/userModel");
const visitorsModel = require("../models/visitorsModel");

// const multer = require('../config/multer');

const loadDashboard = async (req, res, next) => {

  const order = await orderModel.find().limit(6).populate("products.item.productId").populate("userId")

  // calculating total Revenue
const  revenue = await orderModel.aggregate([
  {
    $group: {
      _id: null,
      totalPrice: { $sum: "$products.totalPrice" }
    }
  }
]).exec((err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result,"revenue");
  }
});

// counting the total number of Orders

const Sales = await orderModel.find({ status: 'Confirm'});

console.log(Sales.length,'sales');


// Visitors count 

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

visitorsModel.aggregate([
  {
    $match: { createdAt: { $gte: startOfDay } } // Only consider documents created today
  },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, // Group by date
      count: { $sum: '$count' } // Sum the count field for each group
    }
  },
  {
    $project: {
      _id: 0,
      date: '$_id',
      count: 1
    }
  }
], function(err, results) {
  if (err) {
    console.log(err);
  } else {
    console.log(results,'visitors count');
  }
});

// dashboard charts


  // orderModel.aggregate([
  //   {
  //     $group: {
  //       _id: {
  //         year: { $year: { date: "$createdAt", } },
  //         month: { $month: { date: "$createdAt", } },
  //         day: { $dayOfMonth: { date: "$createdAt",} }
  //       },
  //       count: { $sum: 1 }
  //     }
  //   },
  //   {
  //     $group: {
  //       _id: {
  //         year: "$_id.year",
  //         month: "$_id.month",
  //         day: "$_id.day"
  //       },
  //       count: { $sum: "$count" }
  //     }
  //   }
  // ], (err, result) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log(result);
  //   }
  // });
  
  const users = await userModel.getUser()

  const usersCount = users.length

  const data =  [50, 70, 19, 1, 4, 5, 7, 30, 54, 8, 27, 2]
  res.render("dashboard",{data,order,users});
};

const loadLogin = (req, res, next) => {
  res.render("login");
};



const verifyAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const adminData = await adminModel.findOne({ email: email });

    if (adminData.isAdmin || adminData.coordinator) {
      const passwordMatch =await bcrypt.compare(password, adminData.password);

      if (passwordMatch) {
        req.session.admin_id = adminData._id;

        res.redirect("/admin");
      }
    } else {
      res.render("login", { message: "You are not an administrator" });
    }
  } catch (error) {

    console.log(error);
  }
};



const loadUser = async (req, res, next) => {
  try {
    adminModel.find({}).exec((err, users) => {
      console.log(users);

      res.render("users", { users });
    });
  } catch (error) {}
};

const loadProduct = async (req, res) => {
  const product = await Products.getAllProducts();

  res.render("product", { product });
};

const loadAddProduct = async (req, res) => {
  res.render("addProduct");
};

const addProduct = async (req, res) => {
  try {
    const { name, description, mrp, discountedPrice, image,link,sdescription} =
      req.body;
    const product = {
      name: name,
      description: description,
      mrp: mrp,
      discountedPrice: discountedPrice,
      image: req.file.filename,
      link:link,
      sdescription:sdescription
    };

   await Products.addProduct(product).then(() =>
      console.log("product saved successfully")
    );

    res.redirect("/admin/product");
  } catch (error) {
    console.log(error.message);
  }
};

const loadEditProduct = async (req, res) => {
  const id = req.query.id;
  const product = await Products.getProduct(id);

  res.render("editProduct", { product });
};

const editProduct = (req, res) => {
  const { name, description, discountedPrice, mrp, image, paymentId, link ,sdescription} =
    req.body;
  Products.findByIdAndUpdate(
    { _id: req.body.id },
    {
      $set: {
        name: name,
        description: description,
        discountedPrice: discountedPrice,
        mrp: mrp,
        link:link,
        sdescription:sdescription
      },
    }
  ).then(() => {
    res.redirect("/admin/product");
  });
};

const ListProduct = async (req, res) => {
  try {
    const product = await Products.getProduct(req.query.id);

    if (product.isAvailable == true) {
      const Product = await Products.findByIdAndUpdate(
        { _id: req.query.id },
        {
          $set: {
            isAvailable: false,
          },
        }
      ).then(() => console.log("updated"));
    } else {
      const Product = await Products.findByIdAndUpdate(
        { _id: req.query.id },
        {
          $set: {
            isAvailable: true,
          },
        }
      );
    }

    res.redirect("/admin/product");
  } catch (error) {}
};

const blockUser = async (req, res) => {
  try {
    const id = req.query.id;

    const userData = await adminModel.getUserById(id);

    if (userData.isVerified) {
      await adminModel.findByIdAndUpdate(
        { _id: id },
        { $set: { isVerified: false } }
      );
    } else {
      await adminModel.findByIdAndUpdate(
        { _id: id },
        { $set: { isVerified: true } }
      );
    }

    res.redirect("/admin/userList");
  } catch (error) {
    console.log(error);
  }
};

const dltProduct = async (req, res) => {
  try {
    await Products.findByIdAndDelete({ _id: req.query.id });
    res.redirect("/admin/product");
  } catch (error) {
    console.log(error);
  }
};

// https://drive.google.com/drive/folders/1vt9vPTcFtVyHdrmueIuuhVFoy0w-rg8B?usp=share_link

const loadCoupon = async (req, res) => {
  const couponData = await couponModel.getAllCoupon();

  res.render("coupon", { couponData });
};

const addCoupon = async (req, res) => {
  const {
    name,
    description,
    discountPercentage,
    maximumDiscount,
    expirationDate,
  } = req.body;

  const couponData = {
    name: name,
    description: description,
    discountPercentage: discountPercentage,
    maximumDiscount: maximumDiscount,
    expirationDate: expirationDate,
  };

  const coupon = await couponModel
    .addCoupon(couponData)
    .then(() => console.log("coupon saved"));
  res.redirect("/admin/coupon");
};

const couponBlock = async (req, res) => {
  const coupon = await couponModel.findById(req.query.id);

  if (coupon.isAvailable) {
    await couponModel.findByIdAndUpdate(req.query.id, {
      $set: {
        isAvailable: false,
      },
    });
  } else {
    await couponModel.findByIdAndUpdate(req.query.id, {
      $set: {
        isAvailable: true,
      },
    });
  }

  res.redirect('/admin/coupon')
};


const listOrders = async (req, res) => {

  const order = await orderModel.find().sort({_id:-1}).populate('products.item.productId').populate('userId')

  const products = await orderModel.getProducts()
  

  console.log(products)

  res.render('order',{order});

}

const viewOrder = async (req, res) => {

  const order = await orderModel.getOrder(req.query.id);

  const product = await orderModel.getProductSummary(req.query.id);

  res.render('viewOrder',{order,product});

}


module.exports = {
  viewOrder,
  addCoupon,
  editProduct,
  loadLogin,
  loadDashboard,
  verifyAdmin,
  loadUser,
  loadProduct,
  loadAddProduct,
  addProduct,
  loadEditProduct,
  ListProduct,
  dltProduct,
  blockUser,
  loadCoupon,
  couponBlock,
  listOrders
};
