const express = require('express');
const route = express();

const userController = require('../controllers/userController');
const userAuth = require('../middlewares/userAuth');
const stripe = require('stripe')('sk_test_51MZrWbSFyX3NIqQBT7JLBYjz1kjSQfCLX3iD6LgW7S4GUrFbLjjEyMQr6zSL6hK3DpOTyEgu4auV2BzmqN9plrCg00pTq5OqOl');


require('dotenv').config();


// get 

route.get('/',userController.loadHome)

route.get('/login',userAuth.isLogout,userController.loadLogin)

route.get('/cart',userAuth.isLogin,userController.loadCart)

route.get('/verify',userController.verifyUserEmail)

route.get('/logout',userAuth.logout)

route.get('/profile',userAuth.isLogin,userController.loadProfile)

route.get('/shop',userController.loadShop)

route.get('/productDetails',userController.loadProductDetails)

route.get('/addToCart',userAuth.isLogin,userController.addToCart)

route.get('/removeFromCart',userAuth.isLogin,userController.removeFromCart)

// post 

route.post('/login',userAuth.isLogout,userController.verifyUser)

route.post('/register',userAuth.isLogout,userController.registerUser)



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
          price: 'price_1MqE7PSFyX3NIqQBeNLMopLk',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/success`,
      cancel_url: `http://localhost:3000/cancel`,
    });
  
    res.redirect(303, session.url);
  });
  






















module.exports = route