const express = require('express');
const router = express.Router();
const userModel = require('../../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const config = require('../../config');
const user = require('../../models/user.model');

//adminSignup

router.route('/adminLogin')
.post(function(req,res,next){
  let admin = new userModel({})
  let {userName, fullName, email, password, number} = req.body;
  admin.role = "ADMIN_P"
  admin.userName = userName;
  admin.email = email;
  admin.number = number;
  admin.fullName = fullName;
  bcrypt.hash(password, 15, function(err, hash) {
    if(err){
      return next(err)
    }
    if(hash){
      admin.password = hash;
      admin.save()
      .then(user=>{
       
        res.status(200).json({
          user
        })
           
  
     
      })
      .catch(err=>{
          next(err)
      })
    }
});
})



//routes
router.route('/signup')
.post(function(req,res,next){
  let newUser = new userModel({})
  let {userName, fullName, email, password, number} = req.body;
  newUser.userName = userName;
  newUser.email = email;
  newUser.number = number;
  newUser.fullName = fullName;
  bcrypt.hash(password, 15, function(err, hash) {
    if(err){
      return next(err)
    }
    if(hash){
      newUser.password = hash;
      newUser.save()
      .then(user=>{
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
      .catch(err=>{
          next(err)
      })
    }
});
})

router.route('/signin')
.post(function(req,res,next){
  let {eoru, password,token} = req.body;

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
  })
  .catch(err=>next(err))

})
router.route('/')
.get(function(req,res,next){
  userModel.find({}).then(users=>{
    let showFilter = users.map(user=>{
     return {email:user.email, userName: user.userName}
    })
    res.status(200).json(showFilter)
  })

})

router.route('/forgot-password')
.post(function(req,res,next){
  console.log(req.body)

})

module.exports = router;
