const bcrypt = require("bcrypt");
const adminModel = require("../models/userModel");
const Products = require("../models/productModel");
const couponModel = require("../models/couponModel");
const orderModel = require("../models/orderModel");
const invoice = require("easyinvoice");
const userModel = require("../models/userModel");
const visitorsModel = require("../models/visitorsModel");

const loadDashboard = async (req, res, next) => {

    const order = await orderModel.find().limit(6).populate("products.item.productId").populate("userId")
  
    // calculating total Revenue
  const  revenue = await orderModel.aggregate([
    {
      $group: {
        _id: null,
        totalPrice: { $sum: "$products.totalPrice" }
      }
    }
  ]);
  
  // counting the total number of Orders
  
  const Sales = await orderModel.find({ status: 'Confirm'});
 
  
  
  // Visitors count 
  
  const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0); // Set the time to the beginning of the day   

let dailyVisitorCount = null; // Define a variable to hold the result

await visitorsModel.aggregate([
  {
    $match: { createdAt: { $gte: startOfDay } } // Only consider documents created today
  },
  {
    $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, // Group by date
      count: { $sum: '$count' } // Sum the count field for each group
    }
  },
  {
    $project: {
      _id: 0,
      date: '$_id',
      count: 1
    }
  }
], function(err, results) {
  if (err) {
    console.log(err);
  } else {
    dailyVisitorCount = results; // Save the result to the variable
  }
});


// for calculating the current months revenue



// Get the current year and month
// Get the current year and month
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1; // Add 1 to get the month number (January is 0)
console.log(`Current year: ${currentYear}, Current month: ${currentMonth}`);

// Aggregate orders by month and calculate total revenue
const monthlyRevenue = await orderModel.aggregate([
  {
    $match: {
      status: 'Confirm', // Filter by orders with confirmed status
      createdAt: {
        $gte: new Date(`${currentYear}-0${currentMonth}-01T00:00:00.000Z`), // Start of the current month
        $lt: new Date(`${currentYear}-0${currentMonth + 1}-01T00:00:00.000Z`) // Start of the next month
      }
    }
  },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: '$products.totalPrice' } // Sum the totalPrice for the filtered orders
    }
  }
]).exec();


  
  



    const users = await userModel.getUser()
  
    const usersCount = users.length
  
    const data =  [50, 70, 19, 1, 4, 5, 7, 30, 54, 8, 27, 2]
    res.render("dashboard",{data,order,users,revenue,Sales:Sales.length,dailyVisitorCount,monthlyRevenue});
  };




module.exports = {
    loadDashboard
}