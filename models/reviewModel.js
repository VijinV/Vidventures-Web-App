const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name:{
        type: 'String',
        required: true
    },
    channelName:{
        type:"String",
        required: true
    },
    review:{
        type:"String",
        required: true
    },
    image:{
       type:"String", 
    },
    isAvailable:{
        type:"Boolean",
        default: false
    }
});


module.exports = mongoose.model('Review',reviewSchema)
