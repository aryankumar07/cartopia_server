const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Product = require('../models/product');


router.get('/api/products',auth, async (req,res,next)=>{
    try{
        // console.log(req.query.category);
        const product = await Product.find({type : req.query.category});
        // console.log(product);
        res.status(200).json(product);
    }catch(e){
        res.status(500).json({
            msg : e.mesage,
        })
    }
});


router.get('/api/products/search/:searchQuery',auth, async (req,res,next)=>{
    try{
        const query = req.params.searchQuery;
        console.log(query);
        const list = await Product.find(
            { name : { $regex : query , $options:'i' } }
            // { name : query }
        );
        res.status(200).json(list);
    }catch(e){
        res.status(500).json({
            msg : e.message,
        })
    }
})











module.exports = router;