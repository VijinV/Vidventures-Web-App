const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({


    name:{
        type:String,
        
    },
    description:{
        type:String,
        
    },
    maximumDiscount:{
        type:Number,
        
    },
    discountPercentage:{
        type:Number,
        
    },
    expirationDate:{
        type:Date,
        
    },
    isAvailable:{
        type:Boolean,
        default:false
    },
    usedBy:{
      type:mongoose.Types.ObjectId,
      ref:'User'
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

  couponSchema.statics.getCoupon = async function(coupon) {
    const user = await this.findOne({ name: coupon});
    return user;
  };

  

module.exports = mongoose.model('Coupon',couponSchema)