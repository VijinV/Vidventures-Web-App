const bcrypt = require('bcrypt');
const userModel = require('../models/userModel')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'techcab.india@gmail.com',
      pass: 'techcabindia@swargam'
    }
  });

  function sendEmail(to, subject, text) {
    const mailOptions = {
      from: 'techcabindia@gmail.com',
      to: "techcabindia@gmail.com",
      subject: 'this is a test',
      text: 'testing nodemailer'
    };
  
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  sendEmail()
  

const loadHome = (req,res,next)=>{
    res.render('home')
}

const loadLogin = async (req,res,next)=>{
    res.render('login')

}

const registerUser = async (req,res,next)=>{

    try {
        const {email,name,password} = req.body

        const userData = await userModel.findOne({email:email})

        if (!userData) {
            
            const newPassword = await bcrypt.hash(password,10)

            const user = new userModel({
                name:name,
                email:email,
                password:newPassword
            })

            if(user){
                user.save(()=>console.log('userSaved'))

            }

        } else {
            
        }

    
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = {
    loadHome,
    loadLogin,
    registerUser
}
