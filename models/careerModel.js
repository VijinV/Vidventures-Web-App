const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema({
  Title: {
    type: "String",
  },
  subTitle: {
    type: "String",
  },
  description: {
    type: "String",
  },
  requirements: {
    type: "Array",
  },
  link:{
    type: "String",
  },
  isAvaliable: {
    type: "Boolean",
    default: false
  }
});

module.exports = mongoose.model("Career", careerSchema);
