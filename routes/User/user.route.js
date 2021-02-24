var express = require('express');
const uploadProfileImage = require('../../middlewares/upload.profile');
const { update } = require('../../models/user.model');
const userModel = require('../../models/user.model')
var router = express.Router();

router.route('/')
.get(function(req,res,next){
  res.status(200).json(req.loggedInUser)
})
.put(uploadProfileImage.single('image'),function(req,res,next){
  let {fullName, password, number, address} = req.body;
  let fileName;
 console.log(req.body)
  if(req.file){
     fileName = req.file.filename
  }

  let updatedUser = {};
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
    updatedUser.image = fileName
  }
 if(address){
   updatedUser.address = address;
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
