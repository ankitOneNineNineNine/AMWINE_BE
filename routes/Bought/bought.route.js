const router = require('express').Router();

const boughtModel = require('../../models/bought.model');
const productModel = require('../../models/product.model')
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
    newBought.products = products;
    newBought.subTotal = subTotal;
    newBought.shippingCharge = shippingCharge;

    newBought.save()
    .then(async boughtDetails =>{
        let cUser = req.loggedInUser;
        cUser.bought.push(boughtDetails._id);
        boughtDetails.products.forEach(product=>{

            let productId = product.product;
            cUser.cart.splice(cUser.cart.indexOf(productId), 1);
            let quantity = product.quantity;
            productModel.findById(productId)
            .then(async product=>{
                product.sold = quantity;
                product.quantity = product.quantity - quantity;
                await product.save();
            })
        })
    await cUser.save();
    res.status(200).json("Mail is Sent to your Email!!");
    })
    .catch(err=>{
        console.log(err)
    })
})


module.exports = router;