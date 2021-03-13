const express = require('express');
const router = express.Router();
const userModel = require('../../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const config = require('../../config');
const user = require('../../models/user.model');
const redisClient = require('../../databases/redis.db');
const mailSend = require('../../middlewares/mail.send')
const randomString = require("randomstring");
//adminSignup

router.route('/adminSignup')
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
          config.jwtSecret, 
        );
        
        redisClient.set(token, `${user._id}`, function(err, reply){
          if(err){
            console.log(err)
            return next(err)
          }
          console.log(reply)
          res.status(200).json({
           token,
           user
         })
        });
           
     
     
      })
      .catch(err=>{
          next(err)
      })
    }
});
})

router.route('/signin')
.post(function(req,res,next){
  let {eoru, password} = req.body;


  userModel.findOne({
    $or: [
      {
        email: req.body.eoru,
      },
      {
        userName: req.body.eoru,
      },
    ],
  })
  .exec(function(err, user){
    if(err){
      return next(err)
    }
    if(!user){
      return next({
        msg: "Email or password incorrect"
      })
    }
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
        config.jwtSecret,
      );
     redisClient.set(token, `${user._id}`, function(err, reply){
       if(err){
         console.log(err)
         return next(err)
       }
       console.log(reply)
       res.status(200).json({
        token,
        user
      })
     });
     
   
    
  })

})
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
router.post('/logout', function(req,res,next){
  redisClient.del(req.body.token);
  res.status(200).json("Logged Out");
})


router.route("/forgot-password").post(function (req, res, next) {
 
  userModel.findOne({
    $or: [
      {
        email: req.body.eoru,
      },
      {
        userName: req.body.eoru,
      },
    ],
  })
    .then((user) => {
      
      var passwordResetToken = randomString.generate(25);
      var passwordResetExpiry = new Date(Date.now(1000 * 60 * 60 * 24));
      let link = `${req.headers.origin}/reset-password/${passwordResetToken}`;
      var mailData = {
        subject: "Password Recovery",
        html:  `
        <p>Hi <strong>${user.userName}, </strong></p>
        <p>We noticed that you are having problem logging into our website.
        Please click the link given below to reset your password.
        </p>
        <p>Click on this link <a href = ${link}>here</a> to reset your password. </p>
        <p>Please note that this link will only sustain to work for 24 hours.</p>
        <p>If you did not send the request please contact the customer support for the possibility of intrusion </p>
        <p>Regards, </p>
        <p>AMWINE SHOP</p>
        `,
        email: user.email,
      };

      var mailContent = mailSend.prepareMail(mailData);
     
      user.passwordResetToken = passwordResetToken;
      user.passwordResetExpiry = passwordResetExpiry;
      user.save(function (err, saved) {
          if (err) return next(err);
          else {
            mailSend.sender.sendMail(mailContent, function (err, sent) {
              if (err) return next(err);
              else res.status(200).json(sent);
            });
          }
        });
    })
    .catch((err) => next({ msg: "user not found" }));
});

router.route("/reset-password/:token").post(function (req, res, next) {
  var passResetToken = req.params.token;

  userModel
    .findOne({
      passwordResetToken: passResetToken,
      passwordResetExpiry: {
        $lte: new Date() ,
      },
    })
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return next({ msg: "invalid token" });

      user.password = bcrypt.hashSync(req.body.password, 10);
      user.passwordResetToken = null;
      user.passwordResetExpiry = null;
      user.save(function (err, reset) {
        if (err) return next(err);
        else res.status(200).json("Resetted");
      });
    });
});
module.exports = router;
