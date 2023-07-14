
const stripePayment = async (req, res) => {
    const {
      line1,
      line2,
      city,
      state,
      postal_code,
      country,
      name,
      email,
      mobile,
      shortsqty,
      shortsTotal,
      thumbnailqty,
      thumbnail,
      channelTotal,
    } = req.body;
  
    const address = {
      name,
      mobile,
      email,
      line1,
      line2,
      city,
      state,
      postal_code,
      country,
    };
  
    const cartItems = await userModel
      .findById(req.session.user_id)
      .populate("cart.item.productId");
  
    const oid = orderIdCreate.generate();
  
    const user = await userModel.findById(req.session.user_id);
  
    let line_items = [];
  
    let line_object;
  
    cartItems.cart.item.forEach((item) => {
      let name = item.productId.name;
      let price = parseInt(item.productId.discountedPrice) * 100;
      let newimage = item.productId.image;
  
      line_object = {
        price_data: {
          currency: "usd",
          product_data: {
            name: name,
            images: [
              `https://www.vidventuresyt.com/admin/assets/ProductImages/${newimage}`,
            ],
          },
          unit_amount: price,
        },
        quantity: item.qty,
      };
      line_items.push(line_object);
    });
  
    // add on items
  
    // payment line items
  
    // shortsqty,shortsTotal,thumbnailqty,thumbnail,channelTotal
  
    //converting shorts into line items
  
    if (shortsqty) {
      shortsPrice = 8 * 100;
      line_object = {
        price_data: {
          currency: "usd",
          product_data: {
            name: "shorts",
            images: [
              "https://lh3.googleusercontent.com/p/AF1QipNl0KL5RiHkyjn6GWNcFtnyav2-cNug_A4AfWYO=s680-w680-h510",
            ],
          },
          unit_amount: shortsPrice,
        },
        quantity: parseInt(shortsqty),
      };
      line_items.push(line_object);
    } else {
      shortsPrice = null;
    }
  
    //converting thumbnail to line items
    if (thumbnailqty) {
      thumbnailPrice = 5 * 100;
  
      line_object = {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Premium Thumbnail",
            images: [
              "https://lh3.googleusercontent.com/p/AF1QipNl0KL5RiHkyjn6GWNcFtnyav2-cNug_A4AfWYO=s680-w680-h510",
            ],
          },
          unit_amount: thumbnailPrice,
        },
        quantity: parseInt(thumbnailqty),
      };
      line_items.push(line_object);
    } else {
      thumbnailPrice = null;
    }
  
    //converting channelManagement to line_items
  
    if (channelTotal) {
      channelManagementPrice = 150 * 100;
  
      line_object = {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Channel Management",
            images: [
              "https://lh3.googleusercontent.com/p/AF1QipNl0KL5RiHkyjn6GWNcFtnyav2-cNug_A4AfWYO=s680-w680-h510",
            ],
          },
          unit_amount: channelManagementPrice,
        },
        quantity: 1,
      };
      line_items.push(line_object);
    } else {
      channelManagement = null;
    }
  
    // const session = await stripe.checkout.sessions.create({
    //   line_items: line_items,
    //   mode: "payment",
    //   // success_url: "http://vidventuresyt.com/success",
    //   // cancel_url: "http://vidventuresyt.com/cancel",
    //   success_url: "http://localhost:3000/success",
    //   cancel_url: "http://localhost:3000/cancel",
    // });
  
    if (user) {
      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: "payment",
        success_url: "http://vidventuresyt.com/success",
        cancel_url: "http://vidventuresyt.com/cancel",
      });
      const paymentString = await randomstring.generate();
      req.session.paymentString = paymentString;
  
      const updatedUser = await userModel.findByIdAndUpdate(
        { _id: user._id },
        { $set: { paymentString: paymentString } }
      );
  
      order = await new orderModel({
        products: user.cart,
        userId: req.session.user_id,
        status: "Confirm",
        orderId: oid,
        address: address,
        paymentString: paymentString,
      });
  
      res.redirect(303, session.url);
    } else {
      res.redirect("/login");
    }
  };
  