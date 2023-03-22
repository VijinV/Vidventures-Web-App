const bcrypt = require('bcrypt');
const adminModel = require('../models/userModel')


const loadDashboard = (req, res, next) => {
    res.render('dashboard')
}

const loadLogin = (req, res, next) => {
    res.render('login')
}

const verifyAdmin = async (req, res, next) => {


  try {
      const {email, password} = req.body
  
      const adminData = await adminModel.findOne({email: email})
      
      if(adminData.isAdmin){

        const passwordMatch = bcrypt.compare(password, adminData.password)

        if(passwordMatch){

            req.session.admin_id = adminData._id

            res.redirect('/admin')

        }

      }else{
        res.render('login',{message:'You are not an administrator'})
      }
  
  
  } catch (error) {
    
  }
}



const loadUser = async (req, res,next) => {

try {
    
    adminModel.find({}).exec((err,users)=>{

        console.log(users);

        res.render('users',{users})

    })

} catch (error) {
    
}

}


module.exports ={
    loadLogin,
    loadDashboard,
    verifyAdmin,
    loadUser
}