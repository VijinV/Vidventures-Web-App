const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    name:{
        type: 'String',
        required: true
    },
    image:{
       type:"String", 
    },
    isAvailable:{
        type:"Boolean",
        default: false
    },
    link:{
        type:"String",
        required: true
    }
});


module.exports = mongoose.model('Post',postSchema)
