const mongoose = require('mongoose');
const ratingSchema = require('./rating');


const productSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
    },
    description : {
        type : String,
        required : true,
        trim : true,
    },
    images : [
        {
            type : String,
            required : true,
        }
    ],
    category :{
        type : String,
        required : true,
    },
    price :{
        type : Number,
        required : true,
    },
    quantity :{
        type : Number,
        required : true,
    },
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    rating :[
        ratingSchema
    ],
})

const Product = mongoose.model('PRODUCT',productSchema);

module.exports = { Product , productSchema} 