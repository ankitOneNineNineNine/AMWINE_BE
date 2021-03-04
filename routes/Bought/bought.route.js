const router = require('express').Router();

const boughtModel = require('../../models/bought.model');

router.route('/')
.get(function(req,res,next){
    boughtModel.find({})
    .exec(function(err, bought){
        if(err) return next(err);
        if(!bought) return next({msg: 'Noone bought yet'});
        res.status(200).json(bought)
    })
})
.post(function(req,res,next){
    let user = req.loggedInUser._id;
     
    let {productReq, subTotal, shippingCharge} = req.body;

    let products = [];
    productReq.forEach(product=>{
        products.push({
            product: product.p,
            quantity: +product.qty
        })
    })

    let newBought = new boughtModel({})
    newBought.user = user;
    newBought.products = products;
    newBought.subTotal = subTotal;
    newBought.shippingCharge = shippingCharge;

    newBought.save()
    .then(boughtDetails =>res.status(200).json(boughtDetails))
    .catch(err=>{
        console.log(err)
    })
})


module.exports = router;