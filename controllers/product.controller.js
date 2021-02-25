
const productModel = require('../models/product.model')

function get(req,res,next){
  
        productModel.find({})
        .then(products=>{
           res.status(200).json(products)
        })
        .catch(err=>{
            return next(err)
        })
   

}
function getById(req,res,next){
    productModel.findById(req.params.id)
    .then(product=>{
       res.status(200).json(product)
    })
    .catch(err=>{
        return next(err)
    })
}

function add(req,res,next){
    let newProduct = new productModel({});
    let {name, price, quantity, variety, pType } = req.body;
    
    let images = [];
    if(req.files){
        req.files.forEach(file=>{
            console.log(file)
            let fileName = file.filename;
            images.push(fileName);
        })
    }
    newProduct.name = name;
    newProduct.price = price;
    newProduct.quantity = quantity;
    images.forEach(image=>{
        newProduct.images.push(image)
    })
    newProduct.pType = pType;
    newProduct.variety = variety;
    newProduct.addedBy = req.loggedInUser._id;
    newProduct.save()
    .then(product=>{
        console.log(product)
        res.status(200).json(product)
    })
    .catch(err=>{
        return next(err)
    })
}
function update(req,res,next){
    console.log(req.body)
}
module.exports = {
    get, getById,add, update
}