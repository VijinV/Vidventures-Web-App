const express = require('express');
const route = express();

const userController = require('../controllers/userController');
const userAuth = require('../middlewares/userAuth');

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

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


// =======================

route.get('/payment',userController.payment)


route.post('/charge', (req, res) => {
    const token = req.body.stripeToken;
    const amount = req.body.amount;
    const description = req.body.description;
  
    stripe.charges.create({
      amount: amount,
      currency: 'usd',
      description: description,
      source: token
    })
    .then(charge => res.send('Payment Successful'))
    .catch(err => {
      console.log('Error:', err);
      res.status(500).send({ error: 'Payment Failed' });
    });
  });
  





















module.exports = route