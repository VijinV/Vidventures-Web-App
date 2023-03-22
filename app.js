const express = require("express");
const app = express();
const mongoose = require('mongoose');
const session = require('express-session')
const nocache = require('nocache');


// requiring config files
require("dotenv").config();

const path = require("path");
// hbs
const hbs = require("express-handlebars");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(nocache()) 

app.use(session({

  secret:'ijuytrdsfxcgvhbj',
  saveUninitialized:true,
  resave:true,
  cookie:{
    maxAge:1000*60*60*24*7
  }

}))



// user Router

const userRoute = require("./router/userRouter");
const adminRoute = require('./router/adminRouter')

app.use("/", userRoute);
app.use("/admin", adminRoute);

userRoute.set("views", path.join(__dirname+'/views/user'));
userRoute.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: "userLayout",
    partialsDir: __dirname + "/views/partials/user",
    layoutsDir: __dirname + "/views/layout",
  })
);

// admin route

adminRoute.set("views", path.join(__dirname+'/views/admin'));
adminRoute.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "adminLayout",
    partialsDir: __dirname + "/views/partials/admin",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir: __dirname + "/views/layout",
  })
);

userRoute.use(express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "public/admin")));





mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/Vidventures", () =>
  console.log("Database connection established")
);
app.listen(process.env.PORT, () =>
  console.log("listening on port " + process.env.PORT)
);
