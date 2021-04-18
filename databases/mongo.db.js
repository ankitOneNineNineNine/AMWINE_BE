const mongoose = require('mongoose');

// const mongoURI = 'mongodb://localhost:27017/WINEAM'


mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true,   useUnifiedTopology: true  }, function(err,connect){
    if(err){
        console.log(err)
    }
    else{
        console.log('connected to database WINEAM')
    }
})