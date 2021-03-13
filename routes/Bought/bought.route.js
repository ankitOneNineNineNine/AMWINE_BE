const router = require('express').Router();
const path = require('path')
const createReceipt = require('../../middlewares/pdf.create');
const mailSend = require('../../middlewares/mail.send')
const boughtModel = require('../../models/bought.model');
const productModel = require('../../models/product.model')


// const details  = {
//     id: 123,
//     shipping:{
//         from: "AMWINE",
//         to: "ANKIT PRADHAN",
//         address: "Bhaktapur",
//         city: "Bhaktapur",
//         state: "Bagmati",
//         postalCode: 44812,
//         country: "Nepal",
    
//     },
//     items: [{
//         name: "THIS WINE",
//         variety: "This",
//         type: "Wine",
//         quantity: 10,
//         price: 1500,
//     },
//     {
//         name: "THIS WINE2",
//         variety: "This2",
//         type: "Wine2",
//         quantity: 5,
//         price: 2500,
//     }]
//     ,
//     subTotal: 5000,
//     shippingFee: 150,
//     total: 2000,
//     paid: 0,
//     remaining: 5150,
// }
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

     let {productReq, subTotal, shippingCharge, address, city, state,postalCode, country} = req.body;
     let details = {
         items: [],
        subTotal: subTotal,
        shippingFee: shippingCharge,
        total: subTotal+shippingCharge,
        paid: 0,
        remaining: subTotal+shippingCharge,
     }

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
          details["id"]  = boughtDetails._id;
          details["shipping"] = {
              from: "AMWINE",
              to: cUser.fullName,
              address: address,
              city: city,
              state: state,
              postalCode: postalCode,
              country: country,

          }
        let bought = cUser.bought;
        bought.push(boughtDetails._id);
        cUser.bought = bought;
        boughtDetails.products.forEach((product, i)=>{
            let productId = product.product;
            cUser.cart.splice(cUser.cart.indexOf(productId), 1);
            let quantity = product.quantity;
            productModel.findById(productId)
            .then(async p=>{
                p.sold = quantity;
                await p.save();
                details["items"] = [...details.items, {
                    name: p.name,
                    variety: p.variety,
                    type: p.pType,
                    quantity:quantity,
                    price: p.price,
                }]
                if(i === boughtDetails.products.length-1){
                    createReceipt(details);
                }
            })
            
        })
    await cUser.save();
    var mailData = {
        subject: "Bought Receipt",
        html:  `
        <p>Hi <strong>${user.userName}, </strong></p>
      <p>We thank you for choosing us for buying beverages.</p>
      <p>Buy more than 5 and contact us for more discounts.</p>
      <p>You will be called before delivery shortly</p>
        <p>Regards, </p>
        <p>AMWINE SHOP</p>
        `,
        email: cUser.email,
        attachments: [{
            filename: 'output.pdf',
            path: path.join(__dirname, "../../output.pdf"),
            contentType: 'application/pdf'
        }]
      };

      var mailContent = mailSend.prepareMail(mailData);
      mailSend.sender.sendMail(mailContent, function (err, sent) {
        if (err) return next(err);
        else   res.status(200).json("Mail is Sent to your Email!!");
      });
  
    })
    .catch(err=>{
        console.log(err)
    })
})



router.post('/samplePDF', function(req,res,next){
    
    console.log('done')
})


module.exports = router;