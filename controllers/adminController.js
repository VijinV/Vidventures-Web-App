const bcrypt = require('bcrypt');
const adminModel = require('../models/userModel')
const Products = require('../models/productModel')
const multer = require('../config/multer');
const { response } = require('../router/adminRouter');




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

const loadProduct = async (req, res) =>{

    const product = await Products.getAllProducts()

    res.render('product',{product})


}

const loadAddProduct = async (req, res) =>{

   

    res.render('addProduct')
}


const addProduct = async (req, res) =>{
    try {
        const {name,description,mrp,discountedPrice,image} = req.body
        const product = {
            name: name,
            description: description,
            mrp:mrp,
            discountedPrice:discountedPrice,
            image:req.file.filename,
        }

        Products.addProduct(product).then(()=>console.log('product saved successfully'))

        res.redirect('/admin/product')

    } catch (error) {
        
        console.log(error.message)

    }
}

const loadEditProduct = async (req, res) => {

    const id = req.query.id
    const product = await Product.getProduct(id)

    res.render('editProduct', { product})


}

const editProduct = (req, res) => {


    Products.findByIdAndUpdate({_id:req.query.id},{$set:{

    }})



}

const ListProduct = async (req, res) => {

    try {
        const product = await Products.getProduct(req.query.id)

        if (product.isAvailable == true) {
            const Product = await Products.findByIdAndUpdate({_id:req.query.id},{$set:{
               isAvailable:false
            }}).then(()=>console.log('updated'))
        } else {
            const Product = await Products.findByIdAndUpdate({_id:req.query.id},{$set:{
                isAvailable:true
             }})
        }

        res.redirect('/admin/product')

    } catch (error) {
        
    }

}





module.exports ={
    loadLogin,
    loadDashboard,
    verifyAdmin,
    loadUser,
    loadProduct,
    loadAddProduct,
    addProduct,
    loadEditProduct,
    ListProduct
}