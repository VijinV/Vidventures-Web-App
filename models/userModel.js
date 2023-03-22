const mongoose = require("mongoose");

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
  }
});

userSchema.statics.getUserByEmail = async function(email) {
    const user = await this.findOne({ email });
    return user;
  };

userSchema.statics.getUserById = async function(id) {
    const user = await this.findOne({ email });
    return user;
  };


module.exports = mongoose.model("User", userSchema);
