const mongoose=require('mongoose');

const bookSchema=new mongoose.Schema({
    isbn:{
        type:String,
        required:true,
        unique: true
        },
    title:{
        type:String,
        required:true
        },
    subtitle:{
        type:String
        },
    author:{
        type:String
        },
    published:{
        type:String
        },
    publisher:{
        type:String
        },
    pages:{
        type:Number
    },
    description:{
        type:String
    },
    website:{
        type:String
    }
});



const Book=mongoose.model('Book',bookSchema);
module.exports=Book;