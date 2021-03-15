const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
{
fullName: {
    type:String,
    required:true,
    trim:true,
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
    trim:true,
},
email: {
    type: String,
    required: true,
    unique: true,
    trim:true,
},
password:{
    type:String,
    required:true,
    trim:true,
},
image: String,
address:{
    type:String,
    trim:true,
},
number:Number,
cart: [{
    type: Schema.Types.ObjectId,
    ref: 'wine'
}],
bought: [{
    type: Schema.Types.ObjectId,
    ref: 'bought'
}],
passwordResetToken: String,
passwordResetExpiry: String,
},
{timestamps:true},
{
    usePushEach: true
  }
)


const user = mongoose.model("user", userSchema);
module.exports = user;