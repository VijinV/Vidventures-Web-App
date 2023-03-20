const bcrypt = require('bcrypt');
const userModel = require('../models/userModel')
const nodemailer = require('nodemailer');


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
