const PORT = 3000;
const express = require('express');
const { DB }  = require('./locker')
const mongoose = require('mongoose');

const app = express();

const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user')
const checkoutRouter = require('./routes/checkout')
const orderRouter = require('./routes/order')


app.use(express.json())
app.use(checkoutRouter)
app.use(authRouter)
app.use(adminRouter)
app.use(productRouter)
app.use(userRouter)
app.use(orderRouter)

app.get('/hello-world',(req,res,next)=>{
    res.send('hello world')
})


mongoose.connect(DB)
.then(()=>{
    console.log('connection to database successfull')
})
.catch((e)=>{
    console.log(e)
})


app.listen(PORT,()=>{
    console.log(`connection set on ${PORT}`);
})