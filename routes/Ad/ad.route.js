const authenticate = require('../../middlewares/authenticate');
const { secondaryAuthorization } = require('../../middlewares/authorize');
const uploadAdImage = require('../../middlewares/upload.ad');
const adModel = require('../../models/ad.model');
const router = require('express').Router();


router.route('/')
.post(authenticate, secondaryAuthorization,uploadAdImage.single('image') , function(req,res,next){

    let newPost = new adModel({});
    newPost.title =  req.body.title;
    newPost.image = req.file.filename;

    newPost.save()
    .then(post=>res.status(200).json(post))
    .catch(err=>next(err))
})
.get(function(req,res,next){
    adModel.find({})
    .sort({updatedAt: -1})
    .exec(function(err,products){
        if(err){
            return next(err)
        }
        if(!products){
            return next({
                msg: 'no adds posted yet'
            })
        }
        res.status(200).json(products[0])
    })
})
module.exports = router;