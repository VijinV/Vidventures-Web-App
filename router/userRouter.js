const express = require('express');
const route = express();
const userModel = require('../models/userModel')
const userController = require('../controllers/userController');
const userAuth = require('../middlewares/userAuth');
// const session = require("express-session");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const userHome = require('../controllers/userHome');
const orderModel = require('../models/orderModel');


require('dotenv').config();

// get 

route.get('/',userHome.loadHome)

route.get('/login',userAuth.isLogout,userController.loadLogin)

route.get('/cart',userAuth.isLogin,userController.loadCart)

// route.get('/verify',userController.verifyUserEmail)

route.get('/logout',userAuth.logout)

route.get('/profile',userAuth.isLogin,userController.loadProfile)

route.get('/shop',userController.loadShop)

route.get('/productDetails',userController.loadProductDetails)

route.get('/addToCart',userAuth.isLogin,userController.addToCart)

route.get('/removeFromCart',userAuth.isLogin,userController.removeFromCart)

route.get('/contact',userController.contact)

route.get('/viewOrderDetails',userAuth.isLogin,userController.viewOrderDetail)

route.get('/about',userController.loadAbout)

route.get('/faq',userController.loadFaq)

route.get('/addInstructions',userAuth.isLogin,userController.loadAddInstruction)

route.get('/termsandconditions',userController.loadTerms)

route.get('/successstories',userController.loadBlog)

route.get('/blogDetails',userController.loadBlogDetails)

route.get('/privacypolicy',userController.loadPrivacy)

route.get('/ourstory',userController.loadOurStory)

route.get('/homepage',(req, res) => {res.redirect('/')})

route.get('/blog',userController.loadPosts)

route.get('/forgetpassword',userController.loadForgetPassword)



// post 

route.post('/login',userAuth.isLogout,userController.verifyUser)

route.post('/register',userAuth.isLogout,userController.registerUser)

route.post('/verifyEmail',userController.verifyUserEmail)

route.post('/editProdile',userAuth.isLogin,userController.editProfile)

route.post('/addInstructions',userAuth.isLogin,userController.addInstruction)


// =======================


route.get('/success',userAuth.isLogin,userController.loadSuccess)

route.get('/cancel',(req,res)=>{
    res.send('cancel');
})


route.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1MqhvhSFyX3NIqQBuDZ6gSlr',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/success`,
      cancel_url: `http://localhost:3000/cancel`,
    });
  
    res.redirect(303, session.url);
  });
  
  
  route.post('/create-checkout', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
  
    res.redirect(303, session.url);
  });
  

  route.get('/save',userAuth.isLogin,userController.placeOrder)

  route.post('/checkout',userAuth.isLogin,userController.stripePayment)

  route.post('/updateQuantity',userAuth.isLogin,userController.updateCart)


  route.post('/getFormData',userHome.formData)    
  


  // Route to handle the webhook events
route.post('/stripe-webhook', async (req, res) => {
  // Retrieve the event data from the request body
  const event = req.body;

  // Handle the event based on its type
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Payment succeeded, process the order or update the status
      const paymentIntent = event.data.object;
      // Your code here
      console.log('Payment succeeded:', paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      // Payment failed, handle the failure
      // Your code here
      console.log('Payment failed:', event.data.object);
      break;
    // Add other event types as needed
  }

  // Return a response to acknowledge receipt of the event
  res.sendStatus(200);
});


route.get('/paymentpage',userController.payment)
route.post('/paymentpage',userAuth.isLogin,userController.payment)

route.get('/career',userController.careerPage)

route.post('/forgetpassmail',userController.forgetpassmail)

route.post('/otpconfirmforget',userController.forgetotpConfirm)

route.post('/confimpassword',userController.resetPasswords)

route.get('/serviceSearch',userController.searchProduct)

route.get('/sort',userController.sortProduct)



route.get('/successpage', async(req, res, next) =>{

  const order = await orderModel.findOne({_id:'649ee2260fdcd055bf805999'})

  console.log(order)

  const products = order.products.item

  console.log(products[0].productId)


  res.render('success');
})


module.exports = route