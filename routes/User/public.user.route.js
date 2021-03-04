const router = require('express').Router();
const userModel = require('../../models/user.model')


router.get('/:id', function(req,res,next){
    let userID = req.params.id;
    userModel.findById(userID)
    .exec(function(err, user){
        if(err){
            return next(err)
        }
        if(!user){
            return next({
                msg: 'This user is no more in this application'
            })
        }
     
        let userToShow = {
            image: user.image,
            fullName: user.fullName
        }
        res.status(200).json(userToShow)
    })
})


module.exports = router;