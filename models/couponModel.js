const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({


    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    maximumDiscount:{
        type:Number,
        required:true,
    },
    discountPercentage:{
        type:Number,
        required:true
    },
    expirationDate:{
        type:Date,
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:false
    }
})

couponSchema.statics.addCoupon = async function (couponData) {
    const coupon = new this(couponData);
    try {
      const savedCoupon = await coupon.save();
      return savedCoupon;
    } catch (err) {
      throw new Error(err);
    }
  };

  couponSchema.statics.getAllCoupon = async function() {
    try {
      const allCoupon = await this.find().sort({_id:-1})
      return allCoupon;
    } catch (err) {
      console.error(err);
    }
  };

  

module.exports = mongoose.model('Coupon',couponSchema)