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
  }
});

module.exports = mongoose.model("User", userSchema);
