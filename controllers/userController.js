const bcrypt = require('bcrypt');
const userModel = require('../models/userModel')
const nodemailer = require('nodemailer');


// const sendMessage = require('../config/email')
let message;

let newUser;

let login =false

const getSession = (req, res) => {

    return req.session.user_id

}

// Create a transporter object with SMTP configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vfcvijin@gmail.com', // your Gmail address
      pass: 'nkmgensuqskzdgze' // your Gmail password
    }
  });
  


const loadHome = (req,res,next)=>{
    
    


    res.render('home',{login,session:getSession(req,res)})
}

const loadLogin = async (req,res,next)=>{
    res.render('login',{login:true})

}

const registerUser = async (req,res,next)=>{

    try {
        const {email,name,password,mobile} = req.body

        const userData = await userModel.findOne({email:email})

        if (!userData) {
            
            const newPassword = await bcrypt.hash(password,10)

            newUser = new userModel({
                name:name,
                email:email,
                password:newPassword,
                mobile:mobile
            })

            // Create a message object
            const message = {
           from: 'vfcvijin@gmail.com', // Sender address
           to: email, // List of recipients
           subject: 'Test Email from Node.js', // Subject line
           text: 'Hello, this is a test email sent from Node.js using Nodemailer!', // Plain text body,
           html: '<p>Hello, this is a test email sent from Node.js using Nodemailer!</p><p>Here\'s a <a href="http://localhost:3000/verify">link</a> for you to check out.</p>' // HTML body with a link
            };



                transporter.sendMail(message, function(error, info) {
                    if (error) {
                      console.log('Error occurred while sending email: ', error.message);
                      return process.exit(1);
                    }
                    console.log('Email sent successfully to: ', info.messageId);
                  });
                  res.redirect('/login')

        } else {
            
            res.render('login.html',{message: 'Account already exists'})

        }

    
    } catch (error) {
        console.log(error.message)
    }
}

const verifyUserEmail = (req,res)=>{


    newUser.isVerified = true;

    newUser.save(()=>{
        console.log('user saved successfully')
    })
    console.log(newUser)

    res.redirect('/')

}

const verifyUser = async (req,res)=>{
    
    try {
        const {email,password} = req.body;

        const userDate = await userModel.getUserByEmail(email)

        if(userDate){

            const passwordMatch = await bcrypt.compare(password,userDate.password)

            if(passwordMatch){


                req.session.user_id = userDate._id

                res.redirect('/')

            }
        }else{
            res.send('user not found')
        }
    
    } catch (error) {
        
    }


}

const loadCart = (req, res) => {

    res.render('cart',{session:true})


}


module.exports = {
    verifyUser,
    verifyUserEmail,
    loadHome,
    loadLogin,
    registerUser,
    loadCart
}
