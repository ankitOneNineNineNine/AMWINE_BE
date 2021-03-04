const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const boughtSchema = new Schema({
   user: {
       type: Schema.Types.ObjectId,
       ref: 'user'
   },
   products: [
       {
           product: {
               type: Schema.Types.ObjectId,
               ref: 'wines'
           },
           quantity: Number,
       }
   ],
   subTotal: Number,
    shippingCharge: Number

}, {
    timestamps:true
})

const boughtModel = mongoose.model('bought', boughtSchema);

module.exports = boughtModel;