const mongoose = require('mongoose');

// const mongoURI = 'mongodb://localhost:27017/WINEAM'

const mongoURI = 'mongodb+srv://ankitProj:<password>@cluster0.v1cqa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(`${mongoURI}`,{ useNewUrlParser: true,   useUnifiedTopology: true  }, function(err,connect){
    if(err){
        console.log(err)
    }
    else{
        console.log('connected to database WINEAM')
    }
})