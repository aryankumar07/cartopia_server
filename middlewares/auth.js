const jwt = require('jsonwebtoken');
const auth = (req,res,next)=>{
    try{
        const token = req.header('x-auth-token');
        if(!token){
            res.status(401).json({
                msg : 'No token',
            })
        }
        const verified = jwt.verify(token,'passwordKey');
        if(!verified){
            res.status(401).json({
                msg : 'cannot verify token',
            })
        }
    
        req.user = verified.id;
        req.token = token;
        next();
    }catch(e){
        res.status(500).json({
            msg: "something went wrong in token auth" 
        })
    }
    
};


module.exports = auth;