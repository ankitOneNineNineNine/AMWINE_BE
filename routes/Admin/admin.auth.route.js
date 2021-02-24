const express = require('express');
const router = express.Router();
const userModel = require('../../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const config = require('../../config');
const user = require('../../models/user.model');


//routes

// router.route('/adminLogin')
// .post(function(req,res,next){
//   let admin = new userModel({})
//   let {userName, fullName, email, password, number} = req.body;
//   admin.role = "ADMIN_P"
//   admin.userName = userName;
//   admin.email = email;
//   admin.number = number;
//   admin.fullName = fullName;
//   bcrypt.hash(password, 15, function(err, hash) {
//     if(err){
//       return next(err)
//     }
//     if(hash){
//       admin.password = hash;
//       admin.save()
//       .then(user=>{
       
//         res.status(200).json({
//           user
//         })
           
  
     
//       })
//       .catch(err=>{
//           next(err)
//       })
//     }
// });
// })




router.route('/addSecondaryAdmin')
.post(function(req,res,next){
  let newSAdmin = new userModel({})
  let {userName, fullName, email, password, number} = req.body;
  newSAdmin.role = "ADMIN_S"
  newSAdmin.userName = userName;
  newSAdmin.email = email;
  newSAdmin.number = number;
  newSAdmin.fullName = fullName;
  bcrypt.hash(password, 15, function(err, hash) {
    if(err){
      return next(err)
    }
    if(hash){
      newSAdmin.password = hash;
      newSAdmin.save()
      .then(user=>{
        
     res.status(200).json(user)
       
           
  
     
      })
      .catch(err=>{
          next(err)
      })
    }
});
})

router.route('/signinAdmin')
.post(function(req,res,next){
  let {eoru, password,token} = req.body;
    console.log(eoru, password,token)
  let id;
  if(token){
    jwt.verify(token, config.jwtSecret, function(err, hash){
 
    id = hash.i_hash
    })
  }
 
  userModel.findOne({
    $or: [
      {
        email: req.body.eoru,
      },
      {
        userName: req.body.eoru,
      },
      {
        _id: id
      }
    ],
  }).then(user=>{
    if(!user){
      return next({
        msg: "User doesn't exist"
      })
    }
    if((user.role === "ADMIN_P") || (user.role === "ADMIN_S")){
        if(token){
            res.status(200).json({
              token,
              user
            })
          }
          else{
        bcrypt.compare(password, user.password, function(err,result){
          if(err){
            return next(err)
          }
      
         if(!result){
             return next({
               msg: 'Incorrect Password'
             })
          }
      
          var token = jwt.sign(
            {
             i_hash: user._id
            },
            config.jwtSecret
          );
          res.status(200).json({
            token,
            user
          })
        
        })
      
      
      }
    }
  
  })
  .catch(err=>next(err))

})

module.exports = router;
