const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true,
    },
    count:{
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),

    }

})


module.exports = mongoose.model("Count",visitorSchema)