
const product = require('../models/product.model')
const productModel = require('../models/product.model')
const moment = require('moment');
function getAll(req,res,next){
  let {pageNumber, itemsToShow} = req.body
        productModel.find({})
        .sort({updatedAt:-1})
        .skip((pageNumber-1)*itemsToShow)
        .limit(+itemsToShow)
       .exec(function(err, products){
        if(err){
            return next(err)
        }
        if(!products){
            return next({
                msg: 'No Products Found'
            })
        }
        res.status(200).json(products)
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
function searchLatest(req,res,next){
    let today = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]');
    let reqdate = moment().add(-5, 'days').format('YYYY-MM-DD[T00:00:00.000Z]');
    productModel.find({
      updatedAt: {
          $gte: reqdate
      }              
     })
     .sort({updatedAt: -1})
     .limit(10)
     .exec(function(err, products){
         if(err){
             return next(err)
         }
         if(!products){
             return next({
                 msg: 'No Products Found'
             })
         }
         res.status(200).json(products)
     })
}

function search(req,res,next){
    let{min,name, max, type,variety,pageNumber,itemsToShow} = req.body;
    if(!type.length){
        type = ['wine', 'beer']
    }
    if(!max || max === 0){
        max = 15000
    }
    if(!variety.length){
        variety = ["Chardonnay","Sparkle", "Booze", "Red"]
    }
    let queryModel;
    if(!name.length){
        queryModel =  productModel.find({
            pType: { $in: type },
            variety: { $in: variety },
            price: {$gte: min, $lte: max} 
         })

    }
    else{
        queryModel =  productModel.find({
            name: name,
            pType: { $in: type },
            variety: { $in: variety },
            price: {$gte: min, $lte: max} 
         })
    }
 
   
   queryModel
   .sort({updatedAt:-1})
   .skip((pageNumber-1)*itemsToShow)
   .limit(+itemsToShow)
   .exec(function(err, products){
       if(err){
           return next(err)
       }
       if(!products){
           return next({
               msg: 'No Products Found'
           })
       }
       console.log(products)
       res.status(200).json(products)
   })

}

module.exports = {
    getAll, getById,add, update, search,searchLatest
}