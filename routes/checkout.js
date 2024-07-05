const express = require('express');
const auth = require('../middlewares/auth')
// const { STRIPE_SECRET_KEY } = require('../locker')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const checkoutRouter = express.Router();


checkoutRouter.get('/checkout',(req,res,next)=>{
    res.json({
        msg : 'working'
    })
})


checkoutRouter.post('/user/checkout',async(req,res,next)=>{
    const session = await stripe.checkout.sessions.create({
        line_items:[
            {
                price_data :{
                    currency : 'usd',
                    product_data : {
                        name : 'product'
                    },
                    unit_amount : 50*100
                },
                quantity:1
            }
        ], 
        mode : 'payment',
        success_url : 'http://localhost:3000/complete',
        success_url : 'http://localhost:3000/cancel',
    })

    res.json(session);
})

checkoutRouter.get('/complete',(req,res,next)=>{
    res.json({
        msg : 'completed',
    })
})

checkoutRouter.get('/cancel',(req,res,next)=>{
    res.json({
        msg : 'canceled',
    })
})







module.exports = checkoutRouter;