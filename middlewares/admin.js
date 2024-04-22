const jwt = require('jsonwebtoken');
const User  =require('../models/user')

const  admin = async (req,res,next)=>{
    try{
        console.log('int the admin middleware');
        const token = req.header('x-auth-token');
        console.log(token);
        if(!token){
            return res.status(401).jsonf({
                msg : 'cannot find the token',
            })
        }
        const verified = jwt.verify(token,'passwordKey');
        if(!verified){
            return res.status(401).json({
                msg : 'cannot verify the token',
            })
        }
        console.log('verfied the token');
        console.log(verified.id);
        const user = await User.findById(verified.id);
        console.log('the user is : ');
        console.log(user);
        if(user.type=='user' || user.type=='seller'){
            return res.status(500).json({
                msg : 'User not authorized',
            })
        }
    
        req.user = verified.id;
        req.token = token;
        console.log('reached here');
        next();
    }catch(e){
        res.status(500).json({
            msg : e.message,
        })
    }

}

module.exports = admin;