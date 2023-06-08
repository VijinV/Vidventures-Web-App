const mongoose = require('mongoose');

const priceSchema = mongoose.Schema({
    title:{
        type:"String",
        required: true
    },
    planName:{
        type:"String",
        required: true
    },
    price:{
        type:"String",
        required: true
    },
    list:{
        type:"Array",
        required: true,
    }
})


module.exports = mongoose.model("PriceTable",priceSchema)