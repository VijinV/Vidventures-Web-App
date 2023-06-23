const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  subTitle: {
    type: String,
  },
  description: {
    type: String,
  },
  requirements: {
    type: Array,
  },
  link: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the updatedAt field before saving the document
careerSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Career", careerSchema);
