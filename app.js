const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const nocache = require("nocache");
const moment = require("moment");
const cors = require('cors');

// requiring config files
require("dotenv").config();
app.use(cors())


const port = process.env.PORT || 4000

const defaultPort = process.env.PORT;
const fallbackPort = 4000;

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

app.use(nocache());

app.use(
  session({
    secret: "ijuytrdsfxcgvhbj",
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// user Router

const userRoute = require("./router/userRouter");
const adminRoute = require("./router/adminRouter");

app.use("/", userRoute);
app.use("/admin", adminRoute);

userRoute.set("views", path.join(__dirname + "/views/user"));
userRoute.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: "userLayout",
    partialsDir: __dirname + "/views/partials/user",
    layoutsDir: __dirname + "/views/layout",
    helpers:{
      formatDate:function (num) {
        return num.toLocaleDateString('en-US');
      },
      multi:function(val1,val2){
        return  parseInt(val1)*parseInt(val2)
      },
      eq: function (v1, v2) {  
        if (v1 === v2) {
          return v2;
        } else {
        }
      },
      limit:function(ary, max, options) {
        if(!ary || ary.length == 0)
            return options.inverse(this);
    
        var result = [ ];
        for(var i = 0; i < max && i < ary.length; ++i)
            result.push(options.fn(ary[i]));
        return result.join('');
    }
    }
  })
);

// admin route

adminRoute.set("views", path.join(__dirname + "/views/admin"));
adminRoute.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "adminLayout",
    partialsDir: __dirname + "/views/partials/admin",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir: __dirname + "/views/layout",
    helpers: {
      eq: function (v1, v2) {  
        if (v1 === v2) {
          return v2;
        } else {
        }
      },
      multi:function(val1,val2){
        return  parseInt(val1)*parseInt(val2)
      },
      formatDate:function (num) {
        return num.toLocaleDateString('en-US');
      },
      statusConfirm:function (v1){
        if (v1 === "Scripting" || v1 === "Confirm"){

          return v1

        }else{
          return false
        }
      }
    
  
    },
  })
);

// error handing 
// ! page not done yet


app.use((err,req, res, next) => {
  res.status(500).render('admin/40')
})



userRoute.use(express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "public/admin")));

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL, () =>
  console.log("Database connection established")
);







app.listen(4000, () => console.log("listening on port "+ process.env.PORT));
