const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");
const otplib = require("otplib");
const secret = otplib.authenticator.generateSecret();

require("dotenv").config();

const Product = require("../models/productModel");
const couponModel = require("../models/couponModel");
const orderModel = require("../models/orderModel");
const visitorModel = require("../models/visitorsModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const reviewModel = require("../models/reviewModel");
const productModel = require("../models/productModel");
const randomstring = require("randomstring");

const orderIdCreate = require("order-id")("key", {
  prefix: "5000",
});

let message;

let newUser;

let order;

let login = false;

const getSession = (req, res) => {
  return req.session.user_id;
};

// Create a transporter object with SMTP configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL ,// your Gmail address
    pass: process.env.EMAIL_PASSWORD // your Gmail password
  },
});

async function fetchInstagramPosts() {
  // Login to Instagram
  ig.state.generateDevice('sampkle');
  await ig.account.login('sampkle', '@narsmaster31');

  // Get user's media
  const user = await ig.user.searchExact('sampkle');
  const userFeed = ig.feed.user(user.pk);
  const mediaList = await userFeed.items();

  // Log the media URLs
  for (const media of mediaList) {
    console.log(media.image_versions2.candidates[0].url);
    console.log(`Description: ${media.caption.text}`);
  }
}

const loadHome = async (req, res, next) => {
  // const product = await Product.find({}).sort({_id:-1}).limit(3)

  // Storing the records from the Visitor table
  let visitors = await visitorModel.findOne({ name: "localhost" });

  // If the app is being visited first
  // time, so no records
  if (visitors == null) {
    // Creating a new default record
    const beginCount = new visitorModel({
      name: "localhost",
      count: 1,
    });

    // Saving in the database
    beginCount.save();
    // Logging when the app is visited first time
    console.log("First visitor arrived");
  } else {
    // Incrementing the count of visitor by 1
    visitors.count += 1;

    // Saving to the database
    visitors.save();

    // Logging the visitor count in the console
    console.log("visitor arrived: ", visitors.count);
  }

  const review = await reviewModel.find({});


  // !insta post 

  fetchInstagramPosts()



  // !


  res.render("home", { login, session: getSession(req, res), review: review });
};

const loadLogin = async (req, res, next) => {
  res.render("login", { login: true });
};

let emailOtp;

const registerUser = async (req, res, next) => {
  try {
    const { email, name, password, mobile } = req.body;

    const userData = await userModel.findOne({ email: email });

    if (!userData) {
      const newPassword = await bcrypt.hash(password, 10);

      newUser = new userModel({
        name: name,
        email: email,
        password: newPassword,
        mobile: mobile,
      });

      //  Create otp

      const token = await otplib.authenticator.generate(secret);
      emailOtp = token;

      const showEmail = email.slice(-13)
      console.log(token);
      // Create a message object
      const message = {
        from: "vfcvijin@gmail.com", // Sender address
        to: email, // List of recipients
        subject: "Vidventures OTP VERIFICATION", // Subject line
        text: "Hello, this is a test email sent from Node.js using Nodemailer!", // Plain text body
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:arial, 'helvetica neue', helvetica, sans-serif">
        <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>otp verification</title><!--[if (mso 16)]>
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
        <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet"><!--<![endif]-->
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
        @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:center!important } h2 { font-size:24px!important; text-align:center!important } h3 { font-size:20px!important; text-align:center!important } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:center!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:center!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:center!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:18px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
        </style>
        </head>
        <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
        <div class="es-wrapper-color" style="background-color:#FFFFFF"><!--[if gte mso 9]>
        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
        <v:fill type="tile" color="#ffffff"></v:fill>
        </v:background>
        <![endif]-->
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FFFFFF">
        <tr>
        <td valign="top" style="padding:0;Margin:0">
        <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
        <tr>
        <td align="center" style="padding:0;Margin:0">
        <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:510px" cellspacing="0" cellpadding="0" bgcolor="#FAD939" align="center">
        <tr>
        <td align="left" style="padding:0;Margin:0">
        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
        <td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:510px">
        <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
        <td style="padding:0;Margin:0;position:relative" align="center"><img class="adapt-img" src="https://gwfaxf.stripocdn.email/content/guids/bannerImgGuid/images/image16816607173956772.png" alt title width="100%" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
        </tr>
        </table></td>
        </tr>
        </table></td>
        </tr>
        </table></td>
        </tr>
        </table>
        <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
        <tr>
        <td align="center" style="padding:0;Margin:0">
        <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FAD939;border-radius:0 0 50px 50px;width:510px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
        <tr>
        <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px">
        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
        <td valign="top" align="center" style="padding:0;Margin:0;width:470px">
        <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
        <td align="center" style="padding:0;Margin:0"><h1 style="Margin:0;line-height:46px;mso-line-height-rule:exactly;font-family:Poppins, sans-serif;font-size:38px;font-style:normal;font-weight:bold;color:#5d541d">Please confirm<br>your email address</h1></td>
        </tr>
        <tr>
        <td align="center" style="padding:0;Margin:0;padding-top:40px;padding-bottom:40px"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:Poppins, sans-serif;font-size:20px;font-style:normal;font-weight:bold;color:#5D541D">Thanks for joining Vidventures</h3><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Poppins, sans-serif;line-height:27px;color:#5D541D;font-size:18px"><br></p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Poppins, sans-serif;line-height:27px;color:#5D541D;font-size:18px">To finish signing up, please confirm your email address. This ensures we have the right email in case we need to contact you.</p></td>
        </tr>
        <tr>
        <td align="center" style="padding:0;Margin:0"><!--[if mso]><a href="" target="_blank" hidden>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href=""
        style="height:49px; v-text-anchor:middle; width:141px" arcsize="50%" stroke="f" fillcolor="#8928c6">
        <w:anchorlock></w:anchorlock>
        <center style='color:#ffffff; font-family:Poppins, sans-serif; font-size:16px; font-weight:400; line-height:16px; mso-text-raise:1px'>${token}</center>
        </v:roundrect></a>
        <![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border" style="border-style:solid;border-color:#2CB543;background:#8928c6;border-width:0px;display:inline-block;border-radius:30px;width:auto;mso-border-alt:10px;mso-hide:all"><a href="" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:16px;padding:15px 35px 15px 35px;display:inline-block;background:#8928c6;border-radius:30px;font-family:Poppins, sans-serif;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center;border-color:#8928c6"> ${token}</a></span><!--<![endif]--></td>
        </tr>
        </table></td>
        </tr>
        </table></td>
        </tr>
        <tr>
        <td align="left" style="Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;padding-bottom:40px">
        <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
        <td align="left" style="padding:0;Margin:0;width:470px">
        <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
        <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Poppins, sans-serif;line-height:21px;color:#5D541D;font-size:14px">Thanks,<br>Team Vidventures!&nbsp;</p></td>
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
      res.render("otp", { login: true ,email:showEmail});
    } else {
      res.render("login.html", { message: "Account already exists" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const verifyUserEmail = (req, res) => {
  try {
    const otpString =
      req.body.digit1 +
      req.body.digit2 +
      req.body.digit3 +
      req.body.digit4 +
      req.body.digit5 +
      req.body.digit6;
    const otp = Number(otpString);
    if (otp == emailOtp) {
      newUser.isVerified = true;

      newUser.save(() => {});

      req.session.user_id = newUser._id;

      res.redirect("/");
    } else {
      res.render("otp", { message: "otp not valid", login: true });
    }
  } catch (error) {}
};

const verifyUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userDate = await userModel.getUserByEmail(email);

    if (userDate) {

      if(userDate.isVerified){

        const passwordMatch = await bcrypt.compare(password, userDate.password);

        if (passwordMatch) {
          req.session.user_id = userDate._id;
          cartCount = await userModel.getCartItems(req.session.user_id);
          console.log(cartCount.length, "count");
          res.locals.count = cartCount.length;
          res.redirect("/");
        }else{
  
          res.render("login",{message:"Invalid Password",})
  
        }

      }else{

        res.render("login",{message:"You Are Blocked By The Administrator",})
  

      }

    
    } else {
      res.send("user not found");
    }
  } catch (error) {}
};

const viewOrderDetail = async (req, res) => {
  try {
    const id = req.query.id;

    const productId = req.query.productId;

    const order = await orderModel
      .findById({ _id: id })
      .populate("products.item.productId")
      .populate("userId");
    let product;
    const newProduct = await productModel.findById(productId);

    if (order) {
      const item = order.products.item.find(
        (i) => String(i.productId._id) === String(productId)
      );
      if (item) {
        product = item;
      } else {
        console.log("No item found with the given productId");
      }
    } else {
      console.log("No order found with the given id");
    }

    res.render("viewOrderDetails", {
      product,
      order,
      newProduct,
      session: getSession(req, res),
    });
  } catch (error) {
    console.log(error);
  }
};

const loadProfile = async (req, res) => {
  try {
    const userData = await userModel.getUserById(req.session.user_id);
    const order = await orderModel
      .find({ userId: req.session.user_id })
      .populate("products.item.productId")
      .populate("userId")
      .sort({ createdAt: -1 });

    const orderDetails = await orderModel
      .find({})
      .populate("products.item.productId")
      .populate("userId")
      .sort({ createdAt: -1 });

    let data = [];

    // orderDetails.forEach((item) => {console.log(item.status)})

    await orderDetails.forEach((item) => {
      let id = item._id;
      let userId = item.userId;
      let orderId = item.orderId;
      let createdAt = item.createdAt;
      let itemStatus = item.status;

      let status;

      item.products.item.forEach((product) => {
        let productId = product.productId;
        let price = product.price;
        let qty = product.qty;
        let pStatus = product.status;
        let link = product.link;

        if (pStatus) {
          status = pStatus;
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
          link,
          createdAt,
        };

        data.push(newOrder);
      });
    });

    res.render("userProfile", { session: true, userData, data });
  } catch (error) {
    console.log(error);
  }
};

const editProfile = async (req, res) => {
  try {
    const password = req.body.cpasswrd;
    const userData = await userModel.getUserById(req.session.user_id);
    const passwordMatch = await bcrypt.compare(password, userData.password);
    const newpassword = req.body.newpasswrd;
    if (passwordMatch) {
      const newPassword = await bcrypt.hash(newpassword, 10);
      await userModel.findByIdAndUpdate(
        { _id: req.session.user_id },
        {
          $set: {
            name: req.body.name,
            mobile: req.body.mobile,
            password: newPassword,
          },
        }
      );
      console.log("success");
      res.redirect("/profile");
    } else {
      await userModel.findByIdAndUpdate(
        { _id: req.session.user_id },
        {
          $set: {
            name: req.body.name,
            mobile: req.body.mobile,
          },
        }
      );
      console.log("success password not changed");
      res.redirect("/profile");
    }
  } catch (error) {
    console.log(error);
  }
};

const contact = async (req, res) => {
  try {
    res.render("contact", { session: getSession(req, res) });
  } catch (err) {
    console.log(err);
  }
};

const loadShop = async (req, res) => {
  const product = await Product.getAvailableProducts();

  res.render("shop", { session: true, product });
};

const loadProductDetails = async (req, res) => {
  const product = await Product.getProduct(req.query.id);

  const products = await Product.find({ _id: { $ne: req.query.id } }).limit(2)


  res.render("productDetails", { session: true, product ,products});
};

const addToCart = async (req, res) => {
  try {
    userSession = req.session;
    const userData = await userModel.findById({ _id: userSession.user_id });
    const productData = await Product.getProduct(req.query.id);
    await userData.addToCart(productData);
    res.redirect("/cart");
  } catch (error) {
    console.log(error.message);
  }
};

const removeFromCart = async (req, res) => {
  userSession = req.session;
  const userData = await userModel.findById({ _id: userSession.user_id });
  await userData.removeFromCart(req.query.id);
  res.redirect("/cart");
};

const loadCart = async (req, res) => {
  const cartItem = await userModel.getCartItems(req.session.user_id);

  const totalPrice = await userModel.getCartTotalPrice(req.session.user_id);

  res.render("cart", { session: true, cartItem, totalPrice });
};

const placeOrder = async (req, res) => {
  const user = await userModel.findById(req.session.user_id);
  const cartItems = await userModel.getCartItems(req.session.user_id);

  const oid = orderIdCreate.generate();

  order = new orderModel({
    products: user.cart,
    userId: req.session.user_id,
    status: "Confirm",
    orderId: oid,
  });

  await order.save();
};



const stripePayment = async (req, res) => {
  const cartItems = await userModel
    .findById(req.session.user_id)
    .populate("cart.item.productId");

    const oid = orderIdCreate.generate();

    const user = await userModel.findById(req.session.user_id);

   

  let line_items = [];

  let line_object;

  await cartItems.cart.item.forEach((item) => {
    let name = item.productId.name;
    let price = item.productId.discountedPrice * 100;

    console.log(name, price);

    line_object = {
      price_data: {
        currency: "inr",
        product_data: {
          name: name,
          images: [
            "https://lh3.googleusercontent.com/p/AF1QipNl0KL5RiHkyjn6GWNcFtnyav2-cNug_A4AfWYO=s680-w680-h510",
          ],
        },
        unit_amount: price,
      },
      quantity: item.qty,
    };
    line_items.push(line_object);
  });

  const session = await stripe.checkout.sessions.create({
    line_items: line_items,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  req.session.paymentString = randomstring.generate()

  order = new orderModel({
    products: user.cart,
    userId: req.session.user_id,
    status: "Confirm",
    orderId: oid,
    paymentString:req.session.paymentString
  });

  res.redirect(303, session.url);

  
};

const updateCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.session.user_id;

    const user = await userModel
      .findById(userId)
      .populate("cart.item.productId");

    const cartItem = user.cart.item.find(
      (item) => item.productId._id.toString() === productId.toString()
    );

    const productPrice = cartItem.productId.discountedPrice;

    const qtyChange = qty - cartItem.qty;

    console.log(cartItem.price,'cart item quantity change')
    console.log(cartItem.qty,'cart item quantity change',qty)


    cartItem.qty = qty;
    console.log(typeof(productPrice),typeof(qty),'typeof')
    cartItem.price = parseInt(productPrice)*parseInt(qty) ;

    // recalculate the total price of the cart
    const totalPrice = user.cart.item.reduce(
      (acc, item) => acc + item.price,
      0
    );
    user.cart.totalPrice = totalPrice;

    // mark the cart and totalPrice fields as modified
    user.markModified("cart");
    user.markModified("cart.totalPrice");

    // save the updated user document
    await user.save().then((data) => {
      console.log(data);
    });

    // send the updated subtotal and grand total back to the client
    const subtotal = user.cart.item.reduce((acc, item) => acc + item.price, 0);
    const grandTotal = subtotal + 45;

    res.json({ subtotal, grandTotal, productPrice, qtyChange });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating cart item");
  }
};



const payment = async (req, res) => {
  res.render("payment");
};

let logged;

const loadAbout = async (req, res) => {
  if (req.session.user_id) {
    logged = true;
  } else {
    logged = false;
  }
  res.render("aboutUs", { logged, session: getSession(req, res) });
};

const loadFaq = (req, res) => {
  res.render("faq", { session: getSession(req, res) });
};

const loadAddInstruction = async (req, res) => {
  const { id, productId } = req.query;

  const order = await orderModel
    .findById({ _id: id })
    .populate("products.item.productId")
    .populate("userId");
  let instruction;

  order.products.item.forEach((product) => {
    if (new String(product.productId._id).trim() === productId) {
      instruction = product.instruction;
    }
  });

  console.log(productId, "productId");

  res.render("addInstruction", {
    session: getSession(req, res),
    id: id,
    pId: productId,
    instruction,
    productId: productId,
  });
};

const addInstruction = async (req, res) => {
  const { script, voice, editing, thumbnail, id } = req.body;

  const productId = req.body.productId;

  const instruction = {
    script: script,
    voice: voice,
    editing: editing,
    thumbnail: thumbnail,
  };

  console.log(productId);

  const order = await orderModel.findOneAndUpdate(
    { _id: id, "products.item": { $elemMatch: { productId: productId } } },
    { $set: { "products.item.$.instruction": instruction } },
    { new: true }
  );

  res.redirect(`/viewOrderDetails?id=${id}&productId=${productId}`);
};


const loadSuccess = async (req, res,next) => {

  try {
    if(req.session.paymentString == order.paymentString){
  
     await order.save()
  
     req.session.paymentString = null;
  
     res.render("success")
  
    }else{
      res.redirect('/cart')
    }
  } catch (err) {
    next(err)
  }

  

}

// =================================================================

module.exports = {
  loadSuccess,
  addInstruction,
  loadAddInstruction,
  loadFaq,
  loadAbout,
  updateCart,
  stripePayment,
  verifyUser,
  verifyUserEmail,
  loadHome,
  loadLogin,
  registerUser,
  loadCart,
  loadProfile,
  loadShop,
  loadProductDetails,
  addToCart,
  removeFromCart,
  payment,
  placeOrder,
  editProfile,
  contact,
  viewOrderDetail,
};
