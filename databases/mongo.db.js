const mongoose = require('mongoose');

// const mongoURI = 'mongodb://localhost:27017/WINEAM'

const mongoURI = 'mongodb+srv://ankitProj:BARCA@nkit$980@cluster0.v1cqa.mongodb.net/WINEAM?retryWrites=true&w=majority'

mongoose.connect(`${mongoURI}`,{ useNewUrlParser: true,   useUnifiedTopology: true  }, function(err,connect){
    if(err){
        console.log(err)
    }
    else{
        console.log('connected to database WINEAM')
    }
})