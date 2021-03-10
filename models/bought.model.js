const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const boughtSchema = new Schema({
   products: [
       {
           product: {
               type: Schema.Types.ObjectId,
               ref: 'wine'
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