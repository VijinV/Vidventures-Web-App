const bcrypt = require("bcrypt");
const adminModel = require("../models/userModel");
const Products = require("../models/productModel");
const couponModel = require("../models/couponModel");
const orderModel = require("../models/orderModel");
// const invoice = require("easyinvoice");
const UserModel = require("../models/userModel");
const visitorsModel = require("../models/visitorsModel");
const moment = require("moment");




const loadDashboard = async (req, res, next) => {
  try {
    const order = await orderModel.find()
      .limit(6)
      .sort({ createdAt: -1 })
      .populate("products.item.productId")
      .populate("userId");

    // calculating total Revenue
    const revenue = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$products.totalPrice" },
        },
      },
    ]);

    const Orders = await orderModel.find({});
    let totalRevenueSales = 0;

    Orders.forEach(order => {
      const totalPrice = parseFloat(order.products.totalPrice);
      if (!isNaN(totalPrice)) {
        totalRevenueSales += totalPrice;
      }
    });



    // counting the total number of Orders
    const salesCount = await orderModel.countDocuments({});

    // Visitors count
    // Use the variable outside of the callback function
    // console.log(dailyVisitorCount, "dailyVis");

    // for calculating the current month's revenue
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;



    // Aggregate orders by month and calculate total revenue
    const monthlyRevenue = await orderModel.aggregate([
      {
        $match: {
          status: "Confirm",
          createdAt: {
            $gte: new Date(`${currentYear}-0${currentMonth}-01T00:00:00.000Z`),
            $lt: new Date(
              `${currentYear}-0${currentMonth + 1}-01T00:00:00.000Z`
            ),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $toDouble: "$products.totalPrice" } },
        },
      },
    ]);



    // dashboard charts
    const nowMonth = now.getMonth();

    // Create an array to store the number of sales for each month
    const salesArray = new Array(12).fill(0);

    // Loop through each month of the current year
    for (let i = 0; i <= nowMonth; i++) {
      const firstDayOfMonth = moment().month(i).startOf("month");
      const lastDayOfMonth = moment().month(i).endOf("month");

      const query = {
        createdAt: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      };

      const count = await orderModel.countDocuments(query);
      salesArray[i] = count;
    }


    // users chart line
    const usersArray = new Array(12).fill(0);

    for (let i = 0; i <= nowMonth; i++) {
      const firstDayOfMonth = moment().month(i).startOf("month");
      const lastDayOfMonth = moment().month(i).endOf("month");

      const query = {
        registeredAt: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      };

      const count = await UserModel.countDocuments(query);
      usersArray[i] = count;
    }

    //each month revenue chart

    // Create an array to store the revenue for each month
    const revenueArray = new Array(12).fill(0);
    // Loop through each month of the current year
    for (let i = 0; i <= nowMonth; i++) {
      const firstDayOfMonth = moment().month(i).startOf("month");
      const lastDayOfMonth = moment().month(i).endOf("month");

      const query = {
        createdAt: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      };

      const orders = await orderModel.find(query);
      const revenue = orders.reduce((total, order) => total + parseInt(order.products.totalPrice), 0);
      revenueArray[i] = revenue;
    }



    ////////////////

    const salesData = salesArray.slice(0, nowMonth + 1);
    const userData = usersArray.slice(0, nowMonth + 1);

    const users = await UserModel.find();
    const user = await UserModel.find({}).sort({ registeredAt: -1 }).limit(3);
    const usersCount = users.length;

    res.render("dashboard", {
      data: salesData,
      order,
      users,
      revenue: totalRevenueSales,
      Sales: salesCount,
      monthlyRevenue,
      userData,
      user,
      revenueArray
    });
  } catch (error) {
    console.log(error.message);
  }
};


module.exports = {
  loadDashboard,

};
