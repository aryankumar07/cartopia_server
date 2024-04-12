const express = require("express");
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middlewares/auth');


router.post('/admin/signup', async (req,res,next)=>{
    try{
        console.log(req.body);
        const { email,password,name } = req.body;
        console.log('reached');
        console.log(`email fo the user is ${email}`);
        const existingUser = await User.findOne({email : email});
        if(existingUser){
            return res.status(400).json({msg : 'user with same email already exist'})
        }
        const hashedPassword = await bcryptjs.hash(password,8);
        let user = new User({
            name : name,
            email : email,
            password : hashedPassword
        });
        console.log(user);
        user = await user.save();
        res.status(200).json({user : user});
    }catch(e){
        res.status(500).json({msg : 'something went wrong with mongo in user creation'})
    }

});

router.post('/api/signin', async (req,res,next)=>{
    try{
        // console.log(req.body); 
        const { email,password } = req.body;
        // console.log(email);
        // console.log(password);
        const user = await User.findOne({email:email});
        if(!user){
            res.status(400).json({
                msg : 'This email doesnot exist'
            })
        }
        const isMatch = await bcryptjs.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({
                msg : "password doesnot match"
            })
        }

        const token =  jwt.sign({id:user._id},"passwordKey");
        // console.log(token);

        res.status(200).json({
            token : token,
            ...user._doc
        })
        

    }catch(e){
        res.status(500).json({
            msg : "something terrible went wrong",
        })
    }
});

router.post('/tokenIsValid', async (req,res,next)=>{
    try{
        const token = req.header('x-auth-token');
        console.log(token);
        if(!token) res.status(400).json({
            msg : 'no token found',
        });

        const verified = jwt.verify(token,'passwordKey');
        if(!verified) res.status(400).json(({
            msg : 'not verified',
        }));

        const user = await User.findById(verified.id);
        console.log(user);
        if(!user) res.status(400).json({
            msg : 'user not found',
        });

        res.status(200).json({
            msg : 'Voila found',
        });
    }catch(e){
        res.status(500).json({
            msg : e.message,
        });
    }
});

router.get('/',auth,async (req,res,next)=>{
    const user = await User.findById(req.user);
    if(!user){
        res.status(400).json({
            msg : 'no user found',
        })
    }
    res.status(200).json({
        ...user._doc ,token : req.token,
    });
});





module.exports = router;