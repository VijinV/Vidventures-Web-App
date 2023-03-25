const mongoose = require("mongoose");

const Product = require('./productModel')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile:{
    type:Number,
    required: true,
  },
  isVerified:{
    type:Boolean,
    required: true,
  },
  isAdmin:{
    type:Boolean,
    required: true,
    default: false,
  },
  registeredAt:{
    type:Date,
    default:Date.now()
  },isAvailable:{
    type:Boolean,
    default: true
  },
  cart: {
    item: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
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
});

userSchema.methods.addToCart = async function (product) {
  let cart = this.cart;

  const isExisting = cart.item.findIndex((item) => {
    return new String(item.productId).trim() === new String(product._id).trim();
  });

  if (isExisting >= 0) {
    cart.item[isExisting].qty += 1;
  } else {
    cart.item.push({
      productId: product._id,
      qty: 1,
    });
  }

  if (isNaN(cart.totalPrice)) {
    cart.totalPrice = 0;
  }
  cart.totalPrice += parseInt(product.discountedPrice);
  return this.save();
};


userSchema.methods.removeFromCart = async function (productId) {
const cart = this.cart
const isExisting = cart.item.findIndex(
  (objInItems) =>
    new String(objInItems.productId).trim() === new String(productId).trim()
)

console.log(isExisting)

if (isExisting >= 0) {
  const prod = await Product.findById(productId)
  cart.totalPrice -= prod.discountedPrice * cart.item[isExisting].qty
  cart.item.splice(isExisting, 1)
  return this.save()
}
}


userSchema.statics.getUserByEmail = async function(email) {
    const user = await this.findOne({ email });
    return user;
  };

userSchema.statics.getUserById = async function(id) {
    const user = await this.findOne({ id });
    return user;
  };

  userSchema.statics.getCartItems = async function(userId) {
    const user = await this.findById(userId).populate('cart.item.productId');
    return user.cart.item;
  };
  
  userSchema.statics.getCartTotalPrice = async function (userId) {
    const user = await this.findById(userId);
    if (user) {
      return user.cart.totalPrice;
    }
    return 0;
  };
  


module.exports = mongoose.model("User", userSchema);
