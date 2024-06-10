const PORT = 3000;
const express = require('express');
const DB  = require('./locker');
const mongoose = require('mongoose');

const app = express();

const authRouter = require('./routes/auth')


app.use(express.json())
app.use(authRouter)

app.get('/',(req,res,next)=>{
    res.send('hello world')
})


mongoose.connect(DB)
.then(()=>{
    console.log('connection to database successfull')
})
.catch((e)=>{
    console.log(e)
})


app.listen(PORT,"0.0.0.0",()=>{
    console.log(`connection set on ${PORT}`);
})