const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/user.model')

module.exports = function (req,res,next){
    var token = req.headers["authorization"]
    ? req.headers["authorization"]
    : req.query.token
    ? req.query.token
    : null;

    if(token){
        jwt.verify(token, config.jwtSecret, function(err, hash){
            let u_id = hash.i_hash;
            userModel.findById(u_id)
            .then(user=>{
                req.loggedInUser = user;
                next()
            })
            .catch(err=>next(err))
        })
             }

}