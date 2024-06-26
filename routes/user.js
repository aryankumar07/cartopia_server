const express = require('express')
const userRouter = express.Router()
const { Product } = require('../models/product')
const User = require('../models/user')
const auth = require('../middlewares/auth')

userRouter.post('/api/add-to-cart',auth, async (req,res,next)=>{
    try{
        const { productId } = req.body
        // console.log(productId)
        let product = await Product.findById(productId)
        let user = await User.findById(req.user)

        var found = false;

        // console.log(user.cart.length)

        if(user.cart.length==0){
            user.cart.push({
                product,
                quantity : 1
            })
        }else{
            for(let i=0;i<user.cart.length;i++){
                if(user.cart[i].product._id.equals(product._id) ){
                    // user.cart[i].quantity = user.cart[i].quantity + 1;
                    found = true;
                }
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


module.exports  = userRouter