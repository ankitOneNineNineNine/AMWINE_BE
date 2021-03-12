const router = require('express').Router();

const createReceipt = require('../../middlewares/pdf.create');
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


const details  = {
    id: 123,
    shipping:{
        from: "AMWINE",
        to: "ANKIT PRADHAN",
        address: "Bhaktapur",
        city: "Bhaktapur",
        state: "Bagmati",
        postalCode: 44812,
        country: "Nepal",
    
    },
    items: [{
        name: "THIS WINE",
        variety: "This",
        type: "Wine",
        quantity: 10,
        price: 1500,
    },
    {
        name: "THIS WINE2",
        variety: "This2",
        type: "Wine2",
        quantity: 5,
        price: 2500,
    }]
    ,
    subTotal: 5000,
    shippingFee: 150,
    total: 2000,
    paid: 0,
    remaining: 5150,
}

router.post('/samplePDF', function(req,res,next){
    createReceipt(details);
    console.log('done')
})


module.exports = router;