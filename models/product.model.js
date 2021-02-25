const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
{
name: {
    type:String,
    required:true,
},
price: {
    type:Number,
    required:true
},
quantity: {
    type: Number,
    required:true
},
in_stock:{
    type:Number,
},
pType: {
type:String,
enum: ["wine", "beer"],
default: 'wine'
},
variety: {
    required:true,
    type:String
},
images: [String],
addedBy: {
 type: Schema.Types.ObjectId,
 ref: "user",
}
},
{timestamps:true}
)


const product = mongoose.model("wine", productSchema);
module.exports = product;