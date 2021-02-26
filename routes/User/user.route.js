var express = require('express');
const uploadProfileImage = require('../../middlewares/upload.profile');
const { update } = require('../../models/user.model');
const userModel = require('../../models/user.model');
const fs = require('fs');
const path = require('path');
var router = express.Router();

router.route('/')
.get(function(req,res,next){
  res.status(200).json(req.loggedInUser)
})
.put(uploadProfileImage.single('image'),function(req,res,next){
  let {fullName, password, number, address,cart} = req.body;
  console.log(req.body)
  let fileName;
 
  if(req.file){
     fileName = req.file.filename
  }

  let updatedUser ={...req.loggedInUser};
  if(fullName){
    updatedUser.fullName = fullName
  }
  if(password && password>8){
    bcrypt.hash(password, 15, function(err, hash) {
      updatedUser.password = hash

    })
  }
  if(number){
    updatedUser.number = number;
  }
  
  if(fileName){
    let picPath = path.join(process.cwd(), `ProfilePictures/${req.loggedInUser.image}`);
    fs.unlinkSync(picPath)
    updatedUser.image = fileName
  }
 if(address){
   updatedUser.address = address;
 }
 if(cart){
   if(req.body.action){
     updatedUser.cart.push(cart)
   }
   else updatedUser.cart.splice(updatedUser.cart.indexOf(cart), 1)
 }
  userModel.findByIdAndUpdate(req.loggedInUser._id, updatedUser,{new: true}, function(err, afterUpdate){
    if(err){
      return next(err)
    }
    if(afterUpdate){
      res.status(200).json(afterUpdate)
    }
  })
 
})



module.exports = router;
