const jwt = require('jsonwebtoken');

const config = require('../config');
const userModel = require('../models/user.model')
const client = require('../app').client;
module.exports = function (req,res,next){
    var token = req.headers["authorization"]
    ? req.headers["authorization"]
    : req.query.token
    ? req.query.token
    : null;

    console.log(client)
  
  if(!token){
      return next({
          msg: 'Please Login First'
      })
  }
 else{
        jwt.verify(token, config.jwtSecret, function(err, hash){
            userModel.findById(hash.i_hash)
            .then(user=>{
             
                req.loggedInUser = user;
                next()
            })
            .catch(err=>next({
                msg: 'Please Login With Valid Credentials'
            }))
        })
    }
          
          
        

}