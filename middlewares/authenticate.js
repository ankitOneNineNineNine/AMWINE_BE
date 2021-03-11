const jwt = require('jsonwebtoken');

const config = require('../config');
const userModel = require('../models/user.model')
const redisClient = require('../databases/redis.db');
const { jwtSecret } = require('../config');

module.exports = function (req,res,next){
    var token = req.headers["authorization"]
    ? req.headers["authorization"]
    : req.query.token
    ? req.query.token
    : null;

  
  if(!token){
      return next({
          msg: 'Please Login First'
      })
  }
 else{
       
        redisClient.get(token, function(err, id){
            if (err) {
                return next(err)
            }
            if(!id)  {
               
                jwt.verify(token, jwtSecret, function(err, i_hash){
                if(err){
                    return next(err)
                }
                id = i_hash.i_hash
                userModel.findById(id)
                .then(user=>{
                    
                    req.loggedInUser = user;
                    next()
                })
                .catch(err=>next({
                    msg: 'Please Login With Valid Credentials'
                }))
                })
            }  
            else if(id){
                userModel.findById(id)
                .then(user=>{
                    
                    req.loggedInUser = user;
                    next()
                })
                .catch(err=>next({
                    msg: 'Please Login With Valid Credentials'
                }))
            }
            else{
               return next({
                    msg: "You are not logged in!"
                })
            }
        })

    }
          
          
        

}