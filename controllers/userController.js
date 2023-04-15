const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");
const otplib = require('otplib')
const secret = otplib.authenticator.generateSecret();

require('dotenv').config();

const Product = require("../models/productModel");
const couponModel = require("../models/couponModel");
const orderModel = require("../models/orderModel");
const visitorModel = require("../models/visitorsModel" );
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const reviewModel = require("../models/reviewModel")

const orderIdCreate = require('order-id')('key');

let message;

let newUser;

let order

let login = false;

const getSession = (req, res) => {
  return req.session.user_id;
};

// Create a transporter object with SMTP configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vfcvijin@gmail.com", // your Gmail address
    pass: "nkmgensuqskzdgze", // your Gmail password
  },
});

const loadHome = async (req, res, next) => {
  // const product = await Product.find({}).sort({_id:-1}).limit(3)

  // Storing the records from the Visitor table
  let visitors = await visitorModel.findOne({name: 'localhost'})
  
  // If the app is being visited first
  // time, so no records
  if(visitors == null) {
        
      // Creating a new default record
      const beginCount = new visitorModel({
          name : 'localhost',
          count : 1,
      })

      // Saving in the database
      beginCount.save()
      // Logging when the app is visited first time
      console.log("First visitor arrived")
  }
  else{
        
      // Incrementing the count of visitor by 1
      visitors.count += 1;

      // Saving to the database
      visitors.save()

      // Logging the visitor count in the console
      console.log("visitor arrived: ",visitors.count)
  }

  const review = await reviewModel.find({})

  console.log(review)

  res.render("home", { login, session: getSession(req, res),review:review });
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

      const token = otplib.authenticator.generate(secret);
      emailOtp = token

// Create a message object
const message = {
  from: "vfcvijin@gmail.com", // Sender address
  to: email, // List of recipients
  subject: "Test Email from Node.js", // Subject line
  text: "Hello, this is a test email sent from Node.js using Nodemailer!", // Plain text body
  html: `<p style:"color:red">Hello, this is a test email sent from Node.js using Nodemailer! <br>this is your otp token ${token}</p>`, // HTML body with a link
};

await transporter.sendMail(message, function (error, info) {
  if (error) {
    console.log("Error occurred while sending email: ", error.message);
    return process.exit(1);
  }
  console.log("Email sent successfully to: ", info.messageId);

  
});
res.render('otp',{ login: true })
    } else {
      res.render("login.html", { message: "Account already exists" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const verifyUserEmail = (req, res) => {
  try {

    const otpString = req.body.digit1 + req.body.digit2 + req.body.digit3 + req.body.digit4 + req.body.digit5 + req.body.digit6;
    const otp = Number(otpString);
    console.log(otp);
    console.log('email Otp'+ emailOtp);
    if(otp == emailOtp){
      newUser.isVerified = true;

      newUser.save(() => {
        console.log("user saved successfully");
      });
      console.log(newUser);
       
      res.redirect("/");
    }
    else{
      console.log('otp error');
      res.render('otp',{message:'otp not valid',login: true})
    }
      

    
  } catch (error) {
    
  }
};

const verifyUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userDate = await userModel.getUserByEmail(email);

    // console.log('userData',userDate)

    if (userDate) {
      const passwordMatch = await bcrypt.compare(password, userDate.password);

      if (passwordMatch) {
        req.session.user_id = userDate._id;
        cartCount = await userModel.getCartItems(req.session.user_id);
        console.log(cartCount.length, "count");
        res.locals.count = cartCount.length;
        res.redirect("/");
      }
    } else {
      res.send("user not found");
    }
  } catch (error) {}
};


const viewOrderDetail = async (req,res)=>{
  try {

    res.render('viewOrderDetails')
    
  } catch (error) {
    console.log(error);
    
  }
}


const loadProfile = async (req, res) => {
 try {
const userData = await userModel.getUserById(req.session.user_id)

const order = await orderModel.find({userId:req.session.user_id}).populate("products.item.productId").populate("userId").sort({createdAt:-1})
console.log(userData);

const orderDetails = await orderModel.find({})
.populate('products.item.productId')
.exec((err, orders) => {
  if (err) {
    console.log(err);
  } else {
    orders.forEach((order) => {
      console.log(`Order Id: ${order.orderId}`);
      order.products.item.forEach((item) => {
        console.log(`Product Id: ${item.productId._id}`);
        console.log(`Product Name: ${item.productId.name}`);
        console.log(`Quantity: ${item.qty}`);
        console.log(`Price: ${item.price}`);
      });
    });
  }
});

console.log(orderDetails,'orderDetails')

  res.render("userProfile", { session: true,userData,order});
  
 } catch (error) {

  console.log(error);
  
 }
};


const editProfile = async (req, res) => {
  try {
    const password = req.body.cpasswrd;
    const userData = await userModel.getUserById(req.session.user_id);
    const passwordMatch = await bcrypt.compare(password, userData.password);
    const newpassword = req.body.newpasswrd
    if(passwordMatch) {
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

const contact = async (req,res)=>{
  try{

    res.render('contact')

  }
  catch(err)
  {
    console.log(err)
  }
}



const loadShop = async (req, res) => {
  const product = await Product.getAvailableProducts();

  res.render("shop", { session: true, product });
};

const loadProductDetails = async (req, res) => {
  const product = await Product.getProduct(req.query.id);

  res.render("productDetails", { session: true, product });
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

  const user = await userModel.findById(req.session.user_id)
  const cartItems = await userModel.getCartItems(req.session.user_id)

  const oid = orderIdCreate.generate();

  order = new orderModel({

    products:user.cart,
    userId:req.session.user_id,
    status:'Confirm',
    orderId:oid
  })

  order.save()

}

const stripePayment = async (req, res) => {

  const cartItems = await userModel.findById(req.session.user_id).populate('cart.item.productId');

  
 let line_items =[]

 let line_object

 await cartItems.cart.item.forEach(item => {

    let name = item.productId.name
    let price = item.productId.discountedPrice * 100

    console.log(name, price)

    line_object =  {
      price_data: {
        currency: 'usd',
        product_data: { 
          name: name,
          images:["https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8="]
        },
        unit_amount: price,
      },
      quantity: item.qty,
    }
    line_items.push(line_object) 
  })

  console.log(line_items,'line_items')

  
  const session = await stripe.checkout.sessions.create({
    line_items: line_items,
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
  });

  res.redirect(303, session.url);

}

const updateCart = async (req, res) => {

  

  try {
    const { productId,newQuantity} = req.body 

    console.log(productId, newQuantity)
    // Find the user by ID
    const user = await userModel.findById(productId);

    // Find the item in the cart with the matching product ID
    const cartItem = user.cart.item.find(item => item.productId.toString() === productId);

    // Calculate the new total price of the cart
    const oldPrice = cartItem.price * cartItem.qty;
    const newPrice = cartItem.price * newQuantity;
    const totalPrice = user.cart.totalPrice - oldPrice + newPrice;

    // Update the quantity and total price of the cart item
    cartItem.qty = newQuantity;

    // Save the user object with the updated cart data
    await user.save();

    // Send back the updated cart data as a response
    res.status(200).json({ cart: user.cart, totalPrice: totalPrice });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }


}


const payment = async (req, res) => {
  res.render("payment");
};

let logged


const loadAbout = async (req, res) => {



  if(req.session.user_id){
    logged= true;
  }else{
    logged=false;
  }
  res.render("aboutUs",{logged,session:getSession(req, res)});

}

const loadFaq = (req, res) =>{

  res.render("faq",{session:getSession(req, res)});

}


// =================================================================

module.exports = {

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
  viewOrderDetail
};
