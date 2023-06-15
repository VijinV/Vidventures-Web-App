const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author:{
        type: 'String',
        required: true
    },
    image:{
       type:"String", 
    },
    caption:{
        type:"String", 
     },
    heading:{
        type:"String", 
     },postType:{
        type:"String",
     },
    isAvailable:{
        type:"Boolean",
        default: false
    },
    content:{
        type:"String",
        required: true
    }
});


module.exports = mongoose.model('Post',postSchema)
