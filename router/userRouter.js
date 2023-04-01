const express = require('express');
const route = express();
const userModel = require('../models/userModel')
const userController = require('../controllers/userController');
const userAuth = require('../middlewares/userAuth');
// const session = require("express-session");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


require('dotenv').config();

// (function (req,res){

//   route.locals.count = userController.cartCount()

// })()


// get 

route.get('/',userController.loadHome)

route.get('/login',userAuth.isLogout,userController.loadLogin)

route.get('/cart',userAuth.isLogin,userController.loadCart)

// route.get('/verify',userController.verifyUserEmail)

route.get('/logout',userAuth.logout)

route.get('/profile',userAuth.isLogin,userController.loadProfile)

route.get('/shop',userController.loadShop)

route.get('/productDetails',userController.loadProductDetails)

route.get('/addToCart',userAuth.isLogin,userController.addToCart)

route.get('/removeFromCart',userAuth.isLogin,userController.removeFromCart)



// post 

route.post('/login',userAuth.isLogout,userController.verifyUser)

route.post('/register',userAuth.isLogout,userController.registerUser)

route.post('/verifyEmail',userController.verifyUserEmail)



// =======================

route.get('/payment',userController.payment)

route.get('/success',(req,res)=>{
    res.send('success');
})
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
  





















module.exports = route