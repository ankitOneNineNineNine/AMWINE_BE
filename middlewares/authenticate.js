const jwt = require('jsonwebtoken');

const config = require('../config');
const userModel = require('../models/user.model')
const redisClient = require('../databases/redis.db')

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
        console.log(token)
        redisClient.get(token, function(err, id){
            if (err) {
                return next(err)
            }
            console.log("inside", token, id)
            if(id){
                userModel.findById(JSON.parse(id))
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