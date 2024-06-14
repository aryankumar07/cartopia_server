const express = require('express')
const auth = require('../middlewares/auth')
const productRouter = express.Router();
const Product = require('../models/product')


productRouter.get('/api/products',auth,async (req,res,next)=>{
    try{

        console.log('entered in the backend of /api/products')

        const category = req.query.category

        console.log(category)

        const products = await Product.find({
            category : category
        })

        console.log(products)

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



module.exports = productRouter;