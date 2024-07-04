const express = require('express')
const auth = require('../middlewares/auth')
const orderRouter = express.Router();
const Order = require('../models/order')

orderRouter.get('/api/fetch-order',auth,async(req,res,next)=>{
    try{
         const orders = await Order.find({userid : req.user})
         res.status(200).json(orders)
    }catch(e){
        res.status(500).json({
            error : e.message
        })
    }
})


module.exports = orderRouter