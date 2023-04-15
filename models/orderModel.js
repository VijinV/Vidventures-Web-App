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

orderSchema.statics.getOrder= async function (id){
  const orders = await this.findById(id).populate('products.item.productId').populate('userId')

  return orders
}


orderSchema.statics.getProducts = async function() {
  const order = await this.find().populate('products.item.productId').populate('userId')
  return order;
};

orderSchema.statics.getProductSummary = async function(orderId) {
  const result = await this.aggregate([
    { $match: { orderId: orderId } },
    { $unwind: "$products.item" },
    {
      $group: {
        _id:null,
        products: {
          $push: {
            productId: "$products.item.productId",
            quantity: "$products.item.qty",
            price: "$products.item.price",
            totalPrice: "$products.item.price" * "$products.item.qty",
          },
        },
      },
    },
  ]);

  return result[0];
};


module.exports = mongoose.model('Order',orderSchema)