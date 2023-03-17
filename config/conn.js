const mongoose = require('mongoose');

require('dotenv').config()

const connectDB = async ()=>{
  await mongoose.connect(process.env.DB_CONNECTION).then(()=>console.log('Database connection established'))
}


module.exports = {connectDB}