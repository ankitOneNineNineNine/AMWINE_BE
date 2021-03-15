const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = new Schema(
    {
    rating: Number,
    text: String,
    addedBy: {
     type: Schema.Types.ObjectId,
     ref: "user",
    }
    },
    {timestamps:true}
    );


const productSchema = new Schema(
{
name: {
    type:String,
    required:true,
    trim:true,
},
price: {
    type:Number,
    required:true
},
quantity: {
    type: Number,
    required:true
},
sold: {
    type: Number,
},
reviews: [reviewSchema],
pType: {
type:String,
enum: ["wine", "beer"],
default: 'wine'
},
variety: {
    required:true,
    type:String,
    trim:true,
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