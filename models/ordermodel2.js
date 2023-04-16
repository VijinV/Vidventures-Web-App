const mongoose = require("mongoose");

const moment = require('moment')

const orderSchema = new mongoose.Schema({
  products: {
    item: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          // required:true
        },
        qty: {
          type: Number,
          // required:true
        },
        price: {
          type: Number,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  userId:{
    type:mongoose.Types.ObjectId,
    ref:'User',
  },
  status:{
    type:String,
  }
  ,
  createdAt:{
    type:Date,
    default:Date.now()
  },
  orderId:{
    type:String,
    required:true,
  },
  driveLink:{
    type:String,
  }
});



