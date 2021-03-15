const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adSchema = new Schema({
    title: String,
    image: {
        type:String,
        required:true,
        trim:true,
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    
    }
}, {
    timestamps:true
})

const adModel = mongoose.model('ad', adSchema);

module.exports = adModel;