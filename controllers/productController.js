const bcrypt = require("bcrypt");
const adminModel = require("../models/userModel");
const Products = require("../models/productModel");
const couponModel = require("../models/couponModel");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const visitorsModel = require("../models/visitorsModel");
const nodemailer = require('nodemailer')

const cloudinary = require('../config/cloudinary')



const addProduct = async (req, res,next) => {
    try {
      const {
        name,
        description,
        mrp,
        discountedPrice,
        image,
        sdescription,
      } = req.body;

  
  // Upload
  
  const res = cloudinary.uploader.upload('./image_1681537385279.png', {public_id: "hai"})
  
  res.then((data) => {
    console.log(data);
    console.log(data.secure_url);
  }).catch((err) => {
    console.log(err);
  });
  
  
  // Generate 
  const url = cloudinary.url("hai", {
    width: 100,
    height: 150,
    Crop: 'fill'
  });

      const product = {
        name: name,
        description: description,
        mrp: mrp,
        discountedPrice: discountedPrice,
        image: req.file.filename,
        link: link,
        sdescription: sdescription,
      };
  
      await Products.addProduct(product).then(() =>
        console.log("product saved successfully")
      );
  
      res.redirect("/admin/product");
    } catch (err) {
        console.log("err")
     next(err);
    }
  };
  


