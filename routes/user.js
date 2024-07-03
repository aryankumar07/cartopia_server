const express = require('express')
const userRouter = express.Router()
const { Product } = require('../models/product')
const User = require('../models/user')
const auth = require('../middlewares/auth')
const Order = require('../models/order')

userRouter.post('/api/add-to-cart',auth, async (req,res,next)=>{
    try{
        const { productId } = req.body
        // console.log(productId)
        let product = await Product.findById(productId)
        let user = await User.findById(req.user)

        var found = false;

        // console.log(user.cart.length)
        for(let i=0;i<user.cart.length;i++){
            if(user.cart[i].product._id.equals(product._id) ){
                // user.cart[i].quantity = user.cart[i].quantity + 1;
                found = true;
            }
        }

        if(found){
            let fproduct = user.cart.find((productt)=>
                productt.product._id.equals(product._id  )
            )
            fproduct.quantity+=1
        }else{
            user.cart.push({product,quantity : 1})
        }

        user = await user.save();

        res.status(200).json(user)

    }catch(e){
        res.status(500).json({
            error : e.message
        })
    }
})

userRouter.delete('/api/rm-from-cart/:id',auth, async (req,res,next)=>{
    try{
        const { id } = req.params
        // console.log(productId)
        let product = await Product.findById(id)
        let user = await User.findById(req.user)

        for(let i=0;i<user.cart.length;i++){
            if(user.cart[i].product._id.equals(product._id) ){
                if(user.cart.quantity==1){
                    user.cart.splice(i,1)
                }else{
                    user.cart[i].quantity-=1
                }
            }
        }

        user = await user.save();

        res.status(200).json(user)

    }catch(e){
        res.status(500).json({
            error : e.message
        })
    }
})


userRouter.post('/api/add-new-address',auth,async (req,res,next)=>{
    try{
        const newaddress = req.body['address']
        console.log(newaddress)
        let user = await User.findById(req.user)
        user.address.push(newaddress);
        user = await user.save();
        res.status(200).json(user);
    }catch(e){
        res.status(500).json({
            error : e.message
        })
    }


})

userRouter.post('/api/order',auth,async(req,res,next)=>{
    try{
        const {cart,totalprice,address} = req.body;
        let products = []
        for(let i=0;i<cart.length;i++){
            let product = await Product.findById(cart[i].product._id);
            if(product.quantity >= cart[i].quantity){
                product.quantity -= cart[i].quantity,
                products.push({
                    product,
                    quantity : cart[i].quantity
                })
                await product.save();
            }else{
                return res.status(400).json({
                    msg : "out of stock"
                })
            }
        }
        let user = await User.findById(req.user)
        user.cart = []
        user = await user.save();

        let order = new Order({
            products,
            totalprice,
            address,
            userid : req.user,
            orderedAt : new Date().getTime()
        })

        order = await  order.save();

        res.status(200).json(order)
    }catch(e){
        res.status(500).json({
            error : e.message
        })
    }
})


module.exports  = userRouter