const mongoose = require('mongoose')
const { productSchema } = require('../models/product')

const orderSchema = mongoose.Schema({
    products : [
        {
            product : productSchema,
            quantity : {
                type : Number,
                require : true, 
            }
        }
    ],
    totalprice : {
        type : Number,
        required: true,
    },
    address : {
        type : String,
        required : true,
    },
    userid : {
        type : String,
        required : true,
    },
    orderedAt : {
        type : Number,
        require : true,
    },
    status : {
        type : Number,
        default : 0,
    }
})

const Order = mongoose.model("ORDER",orderSchema)

module.exports = Order