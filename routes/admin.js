const express = require('express');
const admin = require('../middlewares/admin');
const { Product } = require('../models/product');



const adminRouter = express.Router();


adminRouter.post('/admin/add-product',admin, async (req,res,next)=>{
   try{
    console.log('entered in the selling backend')
        const { name,description,price,quantity,images,category } = req.body;
        let product = Product({
            name : name,
            description : description,
            price : price,
            quantity : quantity,
            images : images,
            category : category,
            userId : req.id
        })

        product = await product.save();

        console.log(product)

        return res.status(200).json({
            product : product
        })


   }catch(e){

    return res.status(500).json({
        error : e.message
    })

   }
})


adminRouter.get('/admin/get-product',admin, async (req,res,next)=>{
    try{
        // console.log('passed the admin auth');
        const products = await Product.find({
            userId : req.id,
        });

        console.log(products)

        return res.status(200).json(
            products
        )

    }catch(e){
        return res.status(500).json({
            error : e.message
        })
    }
})

adminRouter.post('/admin/delete-product',admin,async (req,res,next)=>{
    try{
        const productId = req.header('productId')

        // console.log(productId);

        const product = await Product.findById({
            _id : productId
        })

        // console.log(product)

        const count = await Product.deleteOne({
            _id : productId
        })

        if(count==1){
            return res.status(200).json({
                msg : 'product deleted'
            })
        }else{
            return res.status(200).json({
                msg : 'Product deleted somehow'
            })
        }

    }catch(e){
        return res.status(500).json({
            error : 'something went wrong in deleting proces'
        })
    }
})









module.exports = adminRouter