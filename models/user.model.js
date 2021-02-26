const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
{
fullName: {
    type:String,
    required:true,
},
role: {
    type: String,
    enum: ["ADMIN_P", "ADMIN_S", "User"],
    default: "User"
},
userName: {
    type: String,
    required: true,
    unique: true,
},
email: {
    type: String,
    required: true,
    unique: true,
},
password:{
    type:String,
    required:true
},
image: String,
address:String,
number:Number,
cart: [{
    type: Schema.Types.ObjectId,
    ref: 'wine'
}]
},
{timestamps:true}
)


const user = mongoose.model("user", userSchema);
module.exports = user;