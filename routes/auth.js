const express = require('express')
const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')


const authRouter = express.Router()

authRouter.post('/api/signup', async (req,res,next)=>{

    try{
        const {name , email, password} = req.body;

        // console.log(`name is : ${name}`)
        // console.log(`name is : ${email}`)
        // console.log(`name is : ${password}`)
    
        const existingUser = await User.findOne({ email : email })
    
        if(existingUser){
            return res.status(400).json({
                msg : 'User with Email Already exits'
            })
        }

        const hashpswd =  await bcryptjs.hash(password,8) 
    
        let user = new User({
            name : name,
            email : email,
            password : hashpswd,
    
        })
    
        user = await user.save();
    
        res.status(200).json({
            user : user
        })
    }catch(e){
        res.status(500).json({
            error : e.message
        })
    }
});


authRouter.get('/api/signin', async (req,res,next)=>{
    const { email,password } = req.headers;

    // const email = req.headers['email']
    // const password = req.headers['password']

    // console.log(req.headers)

    // console.log(`email is : ${email}`)
    // console.log(`password is : ${password}`)

    try{
        const existingUser = await User.findOne({ email });

        if(!existingUser){
            return res.status(400).json({
                msg : "No username/Email exists for these credentials"
            })
        }
        // console.log(existingUser['password'])

        bcryptjs.compare(password,existingUser['password'],
            async (err,match)=>{
                if(match){
                    const token = jwt.sign({id : existingUser._id},"passwordkey")
                    return res.status(200).json({token,...existingUser._doc})
                }else{
                    return res.status(400).json({
                        msg : 'password doesnot match'
                    })
                }
            }


        )
    }catch(e){
        return res.status(500).json({
            error : e.message
        })
    }
    
})

authRouter.post('/isValidToken',async(req,res,next)=>{
    const token = req.header('x-auth-token');
    // console.log(token)
    if(!token) return res.json(false)
    const verified = jwt.verify(token,"passwordkey");
    if(!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if(!user) return res.json(false);

    return res.json(true);

})

authRouter.get('/',auth,async(req,res,next)=>{
    const user = await User.findById(req.user)
    res.status(200).json({
        ...user._doc,
        token : req.token
    })

})


module.exports = authRouter