const express = require('express');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth');

const app = express();


app.use(express.json());
app.use(authRouter);


mongoose.connect(
    'mongodb+srv://aryan:mongo@cartcluster.0qhwtdi.mongodb.net/'
)
.then(()=>{
    console.log('connected to mongo');
})
.catch((e)=>{
    console.log('error in connecting to mongo');
    console.log(e)
})

app.listen(3000,'0.0.0.0',()=>{
    console.log('Port started')
})