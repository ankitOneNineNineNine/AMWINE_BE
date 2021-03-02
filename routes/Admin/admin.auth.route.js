const express = require('express');
const router = express.Router();
const userModel = require('../../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const config = require('../../config');
const user = require('../../models/user.model');
const { primaryAuthorization, secondaryAuthorization } = require('../../middlewares/authorize');


//routes


router.route('/:id')
.delete(primaryAuthorization, function(req,res,next){
  
 userModel.deleteOne({
   _id: req.params.id
 })
.exec(function(err, done){
  if(err){
    return next(err)
  }
  if (done){
    res.status(200).json('done')
  }
})

})

router.route('/')
.get(secondaryAuthorization, function(req,res,next){
  userModel.find({
    role: {$in: ["ADMIN_P", "ADMIN_S"]}
  })
  .exec(function(err, admins){
    if(err){
      return next(err)
    }
    if(!admins){
      return next({
        msg: "no admins created yet"
      })
    }
    let adToShow = [];
    admins.forEach(admin=>{
      adToShow.push({
        _id: admin._id,
        image: admin.image,
        fullName: admin.fullName,
        userName: admin.userName,
        role: admin.role
      })
    })
    res.status(200).json(adToShow)
  })
})
.post(primaryAuthorization, function(req,res,next){
  let newSAdmin = new userModel({})
  let {userName, fullName,role, email, password} = req.body;
  newSAdmin.role = role;
  newSAdmin.userName = userName;
  newSAdmin.email = email;
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


module.exports = router;
