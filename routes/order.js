const express = require('express')
const auth = require('../middlewares/auth')
const orderRouter = express.Router();
const Order = require('../models/order');
const admin = require('../middlewares/admin');

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

orderRouter.get('/admin/fetch-order',admin,async(req,res,next)=>{
    try{
        const orderslist = await Order.find();
        const productlist = [];
        for(let i=0;i<orderslist.length;i++){
            let productfound = orderslist[i].products;
            for(let j=0;j<productfound.length;j++){
                if(productfound[j].product.userId.equals(req.id)){
                    productlist.push(productfound[j].product)
                }
            }
        }
        // console.log(productlist);
        res.status(200).json(productlist)
    }catch(e){
        res.status(500).json({
            error : e.message
        })
    }
})


module.exports = orderRouter