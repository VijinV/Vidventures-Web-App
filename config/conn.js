const mongoose = require('mongoose');

require('dotenv').config()

const connectDB = async ()=>{
  await mongoose
    .connect("mongodb://127.0.0.1:27017")
    .then(() => console.log("Database connection established"));
}


module.exports = {connectDB}