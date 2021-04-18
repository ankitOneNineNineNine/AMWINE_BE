const jwt = require('jsonwebtoken');

const config = require('../config');
const userModel = require('../models/user.model')
const redisClient = require('../databases/redis.db');
const { jwtSecret } = require('../config');

module.exports = function (req,res,next){
    var token = req.headers["authorization"];
  
  if(!token){
      return next({
          msg: 'Please Login First'
      })
  }
 else{
      
        redisClient.get(token, function(err, id){
            if (err) {
                return next(err);
            }            
            
         if(id){
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