const bcrypt = require("bcrypt");
const adminModel = require("../models/userModel");
const Products = require("../models/productModel");
const couponModel = require("../models/couponModel");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const visitorsModel = require("../models/visitorsModel");
const reviewModel = require("../models/reviewModel");
const postModel = require("../models/postModel");
const Form = require("../models/formData");
const nodemailer = require("nodemailer");
const careerModel = require("../models/careerModel");
const priceTable = require("../models/priceTable");
const { response } = require("../router/adminRouter");
require("dotenv").config();

// nodemailer configuration to send email when the product is completed

// Create a transporter object with SMTP configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // your Gmail address
    pass: process.env.EMAIL_PASSWORD, // your Gmail password
  },
});

///////////////////////////////////////////////////////////

const loadDashboard = async (req, res, next) => {
  const order = await orderModel
    .find()
    .limit(6)
    .populate("products.item.productId")
    .populate("userId");

  // calculating total Revenue
  const revenue = await orderModel
    .aggregate([
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$products.totalPrice" },
        },
      },
    ])
    .exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result, "revenue");
      }
    });

  // counting the total number of Orders

  const Sales = await orderModel.find({ status: "Confirm" });

  console.log(Sales.length, "sales");

  // Visitors count

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

  visitorsModel.aggregate(
    [
      {
        $match: { createdAt: { $gte: startOfDay } }, // Only consider documents created today
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date
          count: { $sum: "$count" }, // Sum the count field for each group
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
    ],
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        console.log(results, "visitors count");
      }
    }
  );

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

  const users = await userModel.getUser();

  const usersCount = users.length;

  const data = [50, 70, 19, 1, 4, 5, 7, 30, 54, 8, 27, 2];
  res.render("dashboard", { data, order, users });
};

const loadLogin = (req, res, next) => {
  res.render("login", { login: true });
};

const verifyAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const adminData = await adminModel.findOne({ email: email });

    if (adminData.isAdmin || adminData.coordinator) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);

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
  } catch (error) { }
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
    const {
      name,
      description,
      mrp,
      discountedPrice,
      image,
      link,
      list,
      sdescription,
    } = req.body;

    console.log(req.file.path);

    const product = {
      name: name,
      description: description,
      mrp: mrp,
      discountedPrice: discountedPrice,
      image: req.file.filename,
      list: list,
      link: link,
      sdescription: sdescription,
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
  try {
    const {
      name,
      description,
      discountedPrice,
      mrp,
      link,
      list,
      sdescription,
    } = req.body;
    console.log(discountedPrice)
    const image = req.file && req.file.filename ? req.file.filename : req.body.oldimage;
    Products.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: name,
          description: description,
          discountedPrice: discountedPrice,
          mrp: mrp,
          link: link,
          list,
          image: image,
          sdescription: sdescription,
        },
      }
    ).then((p) => {
      console.log(p)
      res.redirect("/admin/product");
    }).catch((error) => console.log(error));
  } catch (error) {
    console.log(error.message);
  }
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
  } catch (error) { }
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

  res.redirect("/admin/coupon");
};

const listOrders = async (req, res) => {
  const order = await orderModel
    .find()
    .sort({ _id: -1 })
    .populate("products.item.productId")
    .populate("userId");

  const products = await orderModel.getProducts();

  console.log(products);

  res.render("order", { order });
};

// !not completed

const addLink = async (req, res) => {
  // Get the form data from the request body
  const { link, id } = req.body;

  const order = await orderModel
    .findByIdAndUpdate({ _id: id }, { $set: { driveLink: link } })
    .then(() => {
      console.log("link added successfully");
    });
  // Send a success response
  res.status(200).json({ message: "Order updated successfully!" });
};

const loadReview = async (req, res) => {
  const review = await reviewModel.find();

  res.render("review", { review });
};

const loadAddReview = async (req, res) => {
  try {
    const id = req.query.id;

    if (id) {
      console.log("hai");
      const review = await reviewModel.findById(id);

      res.render("addReview", { review });
    } else {
      res.render("addReview");
    }
  } catch (error) { }
};

// const addReview = (req, res) => {
//   try {
//     const { name, channelName, review } = req.body;

//     let newReview;
//     try {
//       newReview = new reviewModel({
//         name: name,
//         channelName: channelName,
//         review: review,
//         image: req.file.filename,
//       });

//       newReview.save().then(() => {
//         res.redirect("/admin/review");
//       });
//     } catch (error) {
//       newReview = new reviewModel({
//         name: name,
//         channelName: channelName,
//         review: review,
//       });

//       newReview.save().then(() => {
//         res.redirect("/admin/review");
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

const addReview = async (req, res) => {
  try {
    const { name, channelName, review, id } = req.body;

    if (!id) {
      console.log("adding review");

      const newReview = new reviewModel({
        name: name,
        channelName: channelName,
        review: review,
        image: req.file ? req.file.filename : null,
      });

      await newReview.save();

      res.redirect('/admin/review');
    } else {
      if (req.file) {
        console.log("updating review");
        await reviewModel.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              name: name,
              channelName: channelName,
              review: review,
              image: req.file.filename,
            },
          }
        ).then(() => {
          res.redirect('/admin/review');
        });
      } else {
        console.log("No file uploaded for update");

        await reviewModel.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              name: name,
              channelName: channelName,
              review: review,
            },
          }
        ).then(() => {
          res.redirect('/admin/review');
        });

      }
    }
  } catch (error) {
    console.log(error.message);
    // Handle other potential errors here
  }
};

const listReview = async (req, res) => {
  try {
    const review = await reviewModel.findById({ _id: req.query.id });

    if (review.isAvailable) {
      await reviewModel
        .findByIdAndUpdate(
          { _id: req.query.id },
          { $set: { isAvailable: false } }
        )
        .then(() => {
          res.redirect("/admin/review");
        });
    } else {
      await reviewModel
        .findByIdAndUpdate(
          { _id: req.query.id },
          { $set: { isAvailable: true } }
        )
        .then(() => {
          res.redirect("/admin/review");
        });
    }
  } catch (error) { }
};

const deleteReview = async (req, res) => {
  try {
    await reviewModel
      .findByIdAndDelete({ _id: req.query.id })
      .then(() => res.redirect("/admin/review"));
  } catch (error) { }
};

const listOrders2 = async (req, res) => {
  const id = req.query.id;

  const order = await orderModel
    .find()
    .sort({ _id: -1 })
    .populate("products.item.productId")
    .populate("userId");

  let products = [];
  let data = [];

  order.forEach((item) => {
    let id = item._id;
    let userId = item.userId;
    let itemStatus = item.status;
    let orderId = item.orderId;
    let link = item.driveLink;
    let createdAt = item.createdAt;
    let status;

    item.products.item.forEach((product) => {
      let productId = product.productId;
      let price = product.price;
      let qty = product.qty;
      let pStatus = product.status;

      if (product.status) {
        status = product.status;
      } else {
        status = itemStatus;
      }

      let newOrder = {
        id,
        userId,
        status,
        orderId,
        link,
        productId,
        price,
        qty,
        createdAt,
      };

      data.push(newOrder);
    });
  });

  res.render("order", { order: data, id });
};

const startScripting = async (req, res) => {
  const id = req.query.id;

  const productId = req.query.productId;

  const newStatus = "Scripting";

  const order = await orderModel.findOneAndUpdate(
    { _id: id, "products.item": { $elemMatch: { productId: productId } } },
    { $set: { "products.item.$.status": newStatus } },
    { new: true }
  );

  res.redirect("/admin/order");
};

const moveToThumbnail = async (req, res) => {
  const id = req.query.id;

  const productId = req.query.productId;

  const newStatus = "Creating Thumbnail";

  const order = await orderModel.findOneAndUpdate(
    { _id: id, "products.item": { $elemMatch: { productId: productId } } },
    { $set: { "products.item.$.status": newStatus } },
    { new: true }
  );

  res.redirect("/admin/order");
};

const moveToVoiceover = async (req, res) => {
  const id = req.query.id;

  console.log("hai");

  const productId = req.query.productId;

  const newStatus = "Started Voice Over";

  const order = await orderModel.findOneAndUpdate(
    { _id: id, "products.item": { $elemMatch: { productId: productId } } },
    { $set: { "products.item.$.status": newStatus } },
    { new: true }
  );
  res.redirect("/admin/order");
};

const moveToVideoEditing = async (req, res) => {
  const id = req.query.id;

  const productId = req.query.productId;

  const newStatus = "Started Video Editing";

  const order = await orderModel.findOneAndUpdate(
    { _id: id, "products.item": { $elemMatch: { productId: productId } } },
    { $set: { "products.item.$.status": newStatus } },
    { new: true }
  );

  res.redirect("/admin/order");
};

const moveToCopyright = async (req, res) => {
  const id = req.query.id;

  const productId = req.query.productId;

  const newStatus = "Started copyright & Quality Checking";

  const order = await orderModel.findOneAndUpdate(
    { _id: id, "products.item": { $elemMatch: { productId: productId } } },
    { $set: { "products.item.$.status": newStatus } },
    { new: true }
  );

  res.redirect("/admin/order");
};

const viewOrder = async (req, res) => {
  const order = await orderModel
    .findById({ _id: req.query.id })
    .sort({ _id: -1 })
    .populate("products.item.productId")
    .populate("userId");

  const pID = req.query.productId;

  let products = [];

  let link;

  let status;

  let instruction;

  order.products.item.forEach((product) => {
    // console.log(product)

    console.log(new String(product.productId._id).trim());
    console.log(pID);

    if (new String(product.productId._id).trim() === pID) {
      let itemFound = product;

      link = product.link;

      status = product.status;

      instruction = product.instruction;

      products.push(itemFound);
    }
  });

  res.render("viewOrder", { order, products, pID, link, status, instruction });
};

const DeliverOrder = async (req, res) => {
  const { id, productId, link } = req.body;

  const order = await orderModel.findOneAndUpdate(
    { _id: id, "products.item.productId": productId },
    {
      $set: {
        "products.item.$.link": link,
        "products.item.$.status": "Delivered",
      },
    },
    { new: true }
  );

  const completeOrder = await order.populate("userId");

  const email = completeOrder.userId.email;
  const name = completeOrder.userId.name;

  // Create a message object
  const message = {
    from: "vfcvijin@gmail.com", // Sender address
    to: email, // List of recipients
    subject: "Test Email from Node.js", // Subject line
    text: "Hello, this is a test email sent from Node.js using Nodemailer!", // Plain text body
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:arial, 'helvetica neue', helvetica, sans-serif">
  <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>New message</title><!--[if (mso 16)]>
  <style type="text/css">
  a {text-decoration: none;}
  </style>
  <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
  <xml>
  <o:OfficeDocumentSettings>
  <o:AllowPNG></o:AllowPNG>
  <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
  </xml>
  <![endif]--><!--[if !mso]><!-- -->
  <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap" rel="stylesheet"><!--<![endif]-->
  <style type="text/css">
  #outlook a {
  padding:0;
  }
  .es-button {
  mso-style-priority:100!important;
  text-decoration:none!important;
  }
  a[x-apple-data-detectors] {
  color:inherit!important;
  text-decoration:none!important;
  font-size:inherit!important;
  font-family:inherit!important;
  font-weight:inherit!important;
  line-height:inherit!important;
  }
  .es-desk-hidden {
  display:none;
  float:left;
  overflow:hidden;
  width:0;
  max-height:0;
  line-height:0;
  mso-hide:all;
  }
  @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:center } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:center } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:12px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:18px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } }
  </style>
  </head>
  <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div class="es-wrapper-color" style="background-color:#FF6E12"><!--[if gte mso 9]>
  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
  <v:fill type="tile" color="#FF6E12"></v:fill>
  </v:background>
  <![endif]-->
  <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FF6E12">
  <tr>
  <td valign="top" style="padding:0;Margin:0">
  <table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
  <tr>
  <td align="center" style="padding:0;Margin:0">
  <table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
  <tr>
  <td align="left" style="padding:20px;Margin:0"><!--[if mso]><table style="width:560px" cellpadding="0"
  cellspacing="0"><tr><td style="width:241px" valign="top"><![endif]-->
  <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
  <tr>
  <td class="es-m-p0r es-m-p20b" valign="top" align="center" style="padding:0;Margin:0;width:241px">
  <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td class="es-m-txt-c" style="padding:0;Margin:0;font-size:0px" align="left"><a target="_blank" href="${link}" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#3B8026;font-size:14px"><img src="https://gwfaxf.stripocdn.email/content/guids/CABINET_8082746a599603d43778c22862b822d5dc3fcb61670c6b8ed0fa35c8a0d7e1ec/images/logo_png_02.png" alt="Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" title="Logo" width="127.594"></a></td>
  </tr>
  </table></td>
  </tr>
  </table><!--[if mso]></td><td style="width:20px"></td><td style="width:299px" valign="top"><![endif]-->
  <table cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="left" style="padding:0;Margin:0;width:299px">
  <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td style="padding:0;Margin:0">
  <table class="es-menu" width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr class="links-images-right">
  <td style="Margin:0;padding-left:5px;padding-right:5px;padding-top:10px;padding-bottom:0px;border:0" id="esd-menu-id-0" width="100%" valign="top" align="center"><a target="_blank" href="https://viewstripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:'Josefin Sans', helvetica, arial, sans-serif;color:#3B8026;font-size:18px">Vidventures<img src="https://gwfaxf.stripocdn.email/content/guids/CABINET_8082746a599603d43778c22862b822d5dc3fcb61670c6b8ed0fa35c8a0d7e1ec/images/logo_png_02.png" alt="Vidventures" title="Vidventures" width="42" align="absmiddle" style="display:inline-block !important;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;padding-left:15px;vertical-align:middle"></a></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table><!--[if mso]></td></tr></table><![endif]--></td>
  </tr>
  </table></td>
  </tr>
  </table>
  <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
  <tr>
  <td align="center" style="padding:0;Margin:0">
  <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
  <tr>
  <td align="left" style="padding:40px;Margin:0">
  <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td valign="top" align="center" style="padding:0;Margin:0;width:520px">
  <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#fef852;border-radius:20px" width="100%" cellspacing="0" cellpadding="0" bgcolor="#fef852" role="presentation">
  <tr>
  <td align="center" style="Margin:0;padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:30px"><h1 style="Margin:0;line-height:48px;mso-line-height-rule:exactly;font-family:'Josefin Sans', helvetica, arial, sans-serif;font-size:40px;font-style:normal;font-weight:normal;color:#2D033A">Your Order is here<br></h1></td>
  </tr>
  <tr>
  <td align="center" style="padding:0;Margin:0;padding-bottom:30px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'Josefin Sans', helvetica, arial, sans-serif;line-height:24px;color:#38363A;font-size:16px"><br></p></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  <tr>
  <td align="left" style="padding:0;Margin:0;padding-bottom:40px;padding-left:40px;padding-right:40px">
  <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td valign="top" align="center" style="padding:0;Margin:0;width:520px">
  <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="left" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:'Josefin Sans', helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#2D033A">Dear ${name},<br></h3><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'Josefin Sans', helvetica, arial, sans-serif;line-height:21px;color:#38363A;font-size:14px"><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'Josefin Sans', helvetica, arial, sans-serif;line-height:21px;color:#38363A;font-size:14px">We just wanted to take a moment to thank you for choosing us for your food delivery needs. We hope that you enjoyed the food and the service, and that we met your expectations.<br><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'Josefin Sans', helvetica, arial, sans-serif;line-height:21px;color:#38363A;font-size:14px">If there's anything we can do to make your experience even better, please don't hesitate to let us know. We appreciate your feedback and are always looking for ways to improve.<br><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'Josefin Sans', helvetica, arial, sans-serif;line-height:21px;color:#38363A;font-size:14px">Thank you again for your business. We look forward to serving you again soon!<br><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'Josefin Sans', helvetica, arial, sans-serif;line-height:21px;color:#38363A;font-size:14px">Best regards,<br>Delivery Company</p></td>
  </tr>
  <tr>
  <td align="center" style="padding:0;Margin:0;padding-top:20px"><!--[if mso]><a href="${link}" target="_blank" hidden>
  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="${link}"
  style="height:41px; v-text-anchor:middle; width:158px" arcsize="50%" stroke="f" fillcolor="#ff6e12">
  <w:anchorlock></w:anchorlock>
  <center style='color:#ffffff; font-family:"Josefin Sans", helvetica, arial, sans-serif; font-size:15px; font-weight:400; line-height:15px; mso-text-raise:1px'>Go To Product</center>
  </v:roundrect></a>
  <![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#ff6e12;border-width:0px;display:inline-block;border-radius:30px;width:auto;mso-border-alt:10px;mso-hide:all"><a href="${link}" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;display:inline-block;background:#FF6E12;border-radius:30px;font-family:'Josefin Sans', helvetica, arial, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;padding:10px 20px 10px 20px;border-color:#ff6e12">Go To Product</a></span><!--<![endif]--></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table>
  </div>
  </body>
  </html>`, // HTML body with a link
  };

  await transporter.sendMail(message, function (error, info) {
    if (error) {
      console.log("Error occurred while sending email: ", error.message);
      return process.exit(1);
    }
    console.log("Email sent successfully to: ", info.messageId);
  });
  res.redirect(`/admin/viewOrder?id=${id}&productId=${productId}`);
};

const loadCoordinators = async (req, res) => {
  const coordinator = await userModel.find({ coordinator: true });

  res.render("coordinators", { coordinator });
};

const blockCord = async (req, res) => {
  try {
    const id = req.query.id;

    const userData = await adminModel.getUserById(id);

    if (userData.coordinator) {
      await adminModel.findByIdAndUpdate(
        { _id: id },
        { $set: { coordinator: false } }
      );
    } else {
      await adminModel.findByIdAndUpdate(
        { _id: id },
        { $set: { coordinator: true } }
      );
    }

    res.redirect("/admin/coordinators");
  } catch (error) {
    console.log(error);
  }
};

const listPost = async (req, res) => {
  const post = await postModel.find({ postType: "Story" }).sort({ _id: -1 });

  res.render("postList", { post, type: "Story" });
};

const loadAddPost = async (req, res) => {
  const id = req.query.id;

  if (id) {
    const post = await postModel.findById(id);

    res.render("addPost", { post });
  } else {
    res.render("addPost");
  }
};

const addPost = async (req, res) => {
  const { author, heading, caption, content, id, postType } = req.body;

  if (id) {
    try {
      if (req.file.filename) {
        await postModel.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              author: author,
              heading: heading,
              image: req.file.filename,
              caption: caption,
              content: content,
              postType: postType
            },
          }
        );
      }
    } catch (error) {
      await postModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            author: author,
            heading: heading,
            caption: caption,
            content: content,
            postType: postType
          },
        }
      );
    }
  } else {
    const post = new postModel({
      author: author,
      heading: heading,
      caption: caption,
      content: content,
      image: req.file.filename,
      postType: postType
    });

    await post.save();
  }
  if (postType === "Blog") {
    res.redirect("/admin/listBlogs");
  } else {
    res.redirect("/admin/listPosts");
  }

};

const unListPosts = async (req, res) => {
  const id = req.query.id;

  const post = await postModel.findById(id);

  if (post.isAvailable) {
    await postModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          isAvailable: false,
        },
      }
    );
  } else {
    await postModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          isAvailable: true,
        },
      }
    );
  }
  res.redirect("/admin/listPosts");
};

const loadFormData = async (req, res) => {
  const formData = await Form.find({}).sort({ _id: -1 });

  res.render("formData", { formData });
};

const loadPriceTableList = async (req, res) => {

  try {

    // const priceTableList = await priceTable.find().sort({ _id: -1 });

    const priceTableList = [{ title: 'hai', planName: 'silver', price: '39284', list: ['sdfsf', 'dfssf'] }]
    res.render("PriceTableList", { priceTableList });

  } catch (error) {

  }

};

const addPriceTableList = async (req, res) => {
  try {
    const { title, planName, price, list } = req.body;

    const priceTable = new priceTable({
      title,
      planName,
      price,
      list,
    });

    await priceTable.save();

    res.redirect('/pricetable')


  } catch (error) { }
};

const loadBlog = async (req, res) => {

  try {

    const post = await postModel.find({ postType: "Blog" }).sort({ _id: -1 });

    res.render("postList", { post, type: "Blog" });

  } catch (error) {
    console.log(error.message);
  }


}

const loadAddCareer = async (req, res) => {

  try {

    id = req.query.id ?? null;
    const career = await careerModel.findOne({ _id: id });
    console.log(career)
        
    res.render("addCareer", { career })

  } catch (error) {

  }

}
const careerList = async (req, res) => {
  try {

    const careerList = await careerModel.find().sort({ _id: -1 });

    console.log(careerList)

    res.render("careerlist", { job:careerList })
  } catch (error) {

  }
}

const addCareer = async (req, res) => {
  try {

    const { Title, subTitle, description, list, link } = req.body
console.log('addCareer')
    const id = req.body.id ?? null;
    

    if (id) {

      const career = await careerModel.findByIdAndUpdate({
        _id: id,
      }, {
        $set: {
          title:Title,
          subTitle,
          description,
          requirements:list,
          link,
        }
      }).then(()=> res.redirect('/admin/careers'))

    } else {

      const career = new careerModel({

        title:Title,
        subTitle,
        description,
        requirements:list,
        link,
      })

      career.save().then(() =>{
        res.redirect('/admin/careers')
        console.log('career added')
      } )

    }
  } catch (error) {

    console.log(error.message)

  }
}

const listCareers = async (req, res) => {
  try {
    const id = req.query.id || null;
    const career = await careerModel.findOne({ _id: id });
    console.log('search', id, 'careers', career.isAvailable);

    const updatedAvailability = !career.isAvailable;
    await careerModel.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: updatedAvailability } });

    res.redirect('/admin/careers');
    console.log(updatedAvailability ? 'true' : 'false');
  } catch (error) {
    // Handle error
  }
};


module.exports = {
  listCareers,
  loadAddCareer,
  careerList,
  addCareer,
  loadBlog,
  addPriceTableList,
  loadPriceTableList,
  loadFormData,
  unListPosts,
  addPost,
  loadAddPost,
  listPost,
  blockCord,
  loadCoordinators,
  DeliverOrder,
  moveToThumbnail,
  moveToVoiceover,
  moveToVideoEditing,
  moveToCopyright,
  startScripting,
  listOrders2,
  deleteReview,
  listReview,
  addReview,
  loadAddReview,
  loadReview,
  addLink,
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
  listOrders,
};
