const mongoose = require('mongoose');
const config=require('./config.json');
// if a callback function isn't given then a promise would be returned and you can 
//use then and catch to understand the success and failure of these functions.
mongoose.connect(config.connectionString.url,config.connectionString.setting)
.then(()=>{
    console.log(`connected to db ${config.connectionString.url}`);
}).catch((err)=>{
    console.error(err);
    process.exit(1);
})
