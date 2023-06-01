const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  name: {
    type: "String",
  },
  form_data: {
    type: "String",
  },
  form_data_one: {
    type: "String",
  },
  email: {
    type: "String",
  },
});

module.exports = mongoose.model("Form", formSchema);
