const mongoose = require("mongoose");

const moment = require("moment");

const orderSchema = new mongoose.Schema({
  products: {
    item: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          // required:true
        },
        qty: {
          type: Number,
          // required:true
        },
        price: {
          type: Number,
        },
        status: {
          type: String,
          default: null,
        },
        link: {
          type: String,
          default: null,
        },
        instruction: {
          script: {
            type: String,
          },
          voice: {
            type: String,
          },
          editing: {
            type: String,
          },
          thumbnail: {
            type: String,
          },
          channelname: {
            type: String,
          },
          niche: {
            type: String,
          },
          link: {
            type: String,
          },
          others: {
            type: String,
          },
        },
      },
    ],
    totalPrice: {
      type: String,
    },
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  orderId: {
    type: String,
    required: true,
  },
  paymentString: {
    type: String,
  },
  addon: {
    type: Array,
  },
  address: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    line1: {
      type: String,
    },
    line2: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postal_code: {
      type: String,
    },
    country: {
      type: String,
    },
  },
});

orderSchema.statics.getOrder = async function (id) {
  const orders = await this.findById(id)
    .populate("products.item.productId")
    .populate("userId");

  return orders;
};

orderSchema.statics.getProducts = async function () {
  const order = await this.find()
    .populate("products.item.productId")
    .populate("userId");
  return order;
};

orderSchema.statics.getProductSummary = async function (orderId) {
  const result = await this.aggregate([
    { $match: { orderId: orderId } },
    { $unwind: "$products.item" },
    {
      $group: {
        _id: null,
        products: {
          $push: {
            productId: "$products.item.productId",
            quantity: "$products.item.qty",
            price: "$products.item.price",
            totalPrice: "$products.item.price" * "$products.item.qty",
          },
        },
      },
    },
  ]);

  return result[0];
};

module.exports = mongoose.model("Order", orderSchema);
