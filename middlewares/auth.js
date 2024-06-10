const express = require('express')
const jwt = require('jsonwebtoken')

const auth = (req,res,next)=>{
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).json({
            msg : 'auth verfication failed : token wise'
        })
    }

    const verified = jwt.verify(token,'passwordkey');

    if(!verified){
        return res.status(401).json({
            msg : 'auth verification failed : differnet auth'
        })
    }

    req.user = verified.id
    req.token = token

    next()
}

module.exports = auth;

