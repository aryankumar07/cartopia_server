const jwt = require('jsonwebtoken')
const User =  require('../models/user')

const admin = async (req,res,next)=>{

    try{
        const token = req.header('x-auth-token');
        // console.log(token)
        if(token==null){
            return res.status(401).json({
                msg : 'token for user was null'
            })
        }

        const verified = jwt.verify(token,'passwordkey')

        if(!verified){
            return res.status(401).json({
                msg : 'failed verifying the token'
            })
        }

        const user = await User.findById(verified.id) 

        if(user.type=='user' || user.type=='seller'){
            return res.status(401).json({
                msg : 'the user is not verfied for admin'
            })
        }

        req.id = verified.id;
        req.token = token;

        next();
        
    }catch(e){
        return res.status(500).json({
            error : e.message
        })
    }
}

module.exports = admin