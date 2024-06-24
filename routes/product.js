const express = require('express')
const auth = require('../middlewares/auth')
const productRouter = express.Router();
const Product = require('../models/product');
const ratingSchema = require('../models/rating');


productRouter.get('/api/products',auth,async (req,res,next)=>{
    try{

        console.log('entered in the backend of /api/products')

        const category = req.query.category

        console.log(category)

        const products = await Product.find({
            category : category
        })

        // console.log(products)

        if(products==null){
            return res.status(401).json({
                msg : 'failed to fetch the producs'
            })
        }

        return res.status(200).json(products);



    }catch(e){
        return res.status(500).json({
            error : 'an error occured in category'
        })
    }
})


productRouter.get('/api/products/search/:name',auth,async(req,res,next)=>{
    try{
        const query = req.params.name 
        console.log(query)

        const products = await Product.find({
            name : { $regex : query , $options : 'i' },
        })

        console.log(products)

        res.status(200).json(products);


    }catch(e){
        res.status(500).json({
            error : e.message
        })
    }
})

productRouter.post('/api/products/rating',auth, async (req,res,next)=>{
    try{
        const { productId, rating } = req.body;

        // console.log(productId);
        // console.log(rating);

        // const product = await Product.findById(productId);
        // const updatedProduct = await product.updated{}

        // const filter = { _id : productId};
        // const update = { rating : rating};

        // const updatedProduct = await Product.findOneAndUpdate(filter,update,{new:true});

        // console.log(updatedProduct);

        // console.log(productId);


        var product = await Product.findById(productId);

        for(let i=0;i<product.rating.length;i++){
            // console.log('iterating')
            // console.log(product.rating[i])
            // console.log(req.user)
            if(product.rating[i].userId==req.user){
                // console.log('found');
                product = product.rating.splice(i,1);
                break;
            }
        }

        const ratingSchema = { 
            userId : req.user,
            rating : rating,
        }


        console.log(ratingSchema)

        product.rating.push(ratingSchema);

        product = await product.save();


        res.status(200).json(product);

    }catch(e){
        return res.status(500).json({
            error : e.message
        })
    }
})


module.exports = productRouter;