const express = require('express');
const User = require('../models/user');
const Product = require('../models/product');
const admin = require('../middlewares/admin');
const router = express.Router();


router.post('/admin/add-product',admin, async (req,res,next)=>{
    try{
        const { name, description, images, quantity, price, category } = req.body;
        let product = Product({
            name : name,
            description : description,
            quantity : quantity,
            price : price,
            type : category,
            images : images
        })

        product = await product.save()
        console.log('the product saved is');
        console.log(product);
        res.status(200).json(product);
    }catch(err){
        res.status(500).json({
            msg : err.message,
        })
    }
});

router.get('/admin/get-product',admin,async (req,res,next)=>{
    try{
        const products = await Product.find();
        return res.status(200).json(products);
    }catch(e){
        res.status(500).json({
            msg: 'an error occured in fetching the data'
        })
    }
});

router.post('/admin/delete-product',admin, async (req,res,next)=>{
    try{
        const pId = req.header('pId');
        console.log(pId);
        const result = await Product.findByIdAndDelete(pId);
        return res.status(200).json({
            msg : 'Product deleted'
        });
    }catch(e){
        return res.status(500).json({
            msg : 'couldnot delete the product'
        });
    }
});

module.exports = router;