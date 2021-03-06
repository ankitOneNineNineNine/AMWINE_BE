
const product = require('../models/product.model')
const productModel = require('../models/product.model')
const moment = require('moment');
const fs =  require('fs');
const path = require('path')
function getAll(req,res,next){
  let {pageNumber, itemsToShow} = req.query

        productModel.find({})
        .sort({sold: -1})
        .skip((pageNumber-1)*itemsToShow)
        .limit(+itemsToShow)
       .exec(async function(err, products){
        if(err){
            return next(err)
        }
        if(!products){
            return next({
                msg: 'No Products Found'
            })
        }
        let count = await getTotal({}, "");
        console.log(count)
        res.status(200).json({
            products,
            count
        })
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
        res.status(200).json(product)
    })
    .catch(err=>{
        return next(err)
    })
}
function update(req,res,next){
    let productId = req.params.id;
  
    productModel.findById(productId)
    .exec(function(err,oproduct){
        if(err)  return next(err);
        if(!oproduct) return next({msg: 'product not active'});
        let {name, price, quantity, variety, pType, removeImage } = req.body;
        let updatedProduct = oproduct;
        if(name) updatedProduct.name = name;
        if(price) updatedProduct.price = +price;
        if(quantity) updatedProduct.quantity = +quantity;
        if(variety) updatedProduct.variety = variety;
        if(pType) updatedProduct.pType = pType;
        if(removeImage && removeImage.length){
            removeImage.forEach(image=>{
                let urlPath = path.join(__dirname, `../ProductImages/${image}`)
                console.log(urlPath)
               fs.unlinkSync(urlPath);
               updatedProduct.images.splice(updatedProduct.images.indexOf(image),1);
            })
        }
        let images = [];
        if(req.files){
            req.files.forEach(file=>{
             
                let fileName = file.filename;
                images.push(fileName);
                images.forEach(image=>{
                    updatedProduct.images = [...updatedProduct.images, images]
                })
            })
        }
        updatedProduct.save()
        .then(pr=>{
            res.status(200).json(pr)
        })
        .catch(err=>{
            console.log(err)
            return next(err)
        })
    })
  
 
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
async function getTotal(filter, name){
    let pC = await productModel.find(filter);
    if(name && name.length){
        return pC.filter(product=>product.name.toLowerCase().includes(name.toLowerCase())).length;
    }
    else{
        return pC.length;
    }
}
async function search(req,res,next){
    let{min,name, max, type,variety,pageNumber,itemsToShow} = req.body;
    if(!min){
        min = 0
    }
    if(!type || !type.length){
        type = ['wine', 'beer']
    }
    if(!max || max === 0){
        max = 15000
    }
    if(!variety|| !variety.length){
        variety = ["Chardonnay","Sparkle", "Booze", "Red"]
    }
    
    let queryModel;

    const filter = {
        pType: { $in: type },
        variety: { $in: variety },
        price: {$gte: min, $lte: max} 
     }
     let count =await getTotal(filter, name);
     

    productModel.find(filter)
   .sort({updatedAt:-1})
   .skip((pageNumber-1)*itemsToShow)
   .limit(+itemsToShow)
   .exec(async function(err, products){
       if(err){
           return next(err)
       }
       if(!products){
           return next({
               msg: 'No Products Found'
           })
       }
   

       if(name && name.length){
        products = products.filter(product=>product.name.toLowerCase().includes(name.toLowerCase()))
        count = products.length;
       }
       res.status(200).json({
           products,
           count
       })
   })

}
function getVariety(req,res,next){
    productModel.find({})
    .exec(function(err, products){
        if(err){
            return next(err)
        }
        if(!products){
            return next({
                msg: 'No Products Found'
            })
        }
 
        let varieties = []; 
        products.forEach(p=>{
            if(varieties.indexOf(p.variety)<0){
                varieties.push(p.variety)
            }
        })
        res.status(200).json(varieties)
    })
}
function postReview(req,res,next){
 
let addedBy = req.loggedInUser._id;
let text = req.body.text;
let rating = req.body.rating;

productModel.findById(req.body.pId)
.exec(function(err, product){
    if(err){
        return next(err);
    }
    if(!product){
        return next({
            msg: 'No product available for review'
        })
    }
    product.reviews = [ {
        addedBy,
        text,
        rating
    }, ...product.reviews]
    product.save()
    .then(function(product){
        res.status(200).json(product)
    })
    .catch(err=>next(err))
})



}

module.exports = {
    getAll, getById,add, update, search,searchLatest, getVariety,
    postReview,
}