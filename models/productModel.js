const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({


    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    mrp:{
        type:Number,
        required:true,
    },
    discountedPrice:{
        type:Number,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    isAvailable:{
        type:Boolean,
        required:true,
        default:false,
    },

})


productSchema.statics.addProduct = async function (productData) {
    const product = new this(productData);
    try {
      const savedProduct = await product.save();
      return savedProduct;
    } catch (err) {
      throw new Error(err);
    }
  };
  
  productSchema.statics.getAllProducts = async function() {
    try {
      const allProducts = await this.find().sort({_id:-1})
      return allProducts;
    } catch (err) {
      console.error(err);
    }
  };


  productSchema.statics.getProduct = async function(id) {
    try {
      const product = await this.findOne({_id:id})
      return product;
    } catch (err) {
      console.error(err);
    }
  };

  productSchema.statics.getAvailableProducts = async function() {
    try {
      const availableProducts = await this.find({ isAvailable: true }).sort({_id:-1})
      return availableProducts;
    } catch (err) {
      console.error(err);
    }
  };

module.exports = mongoose.model("Product", productSchema);
