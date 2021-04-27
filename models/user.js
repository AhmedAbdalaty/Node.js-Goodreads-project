const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const saltRounds=10;
const jwt=require('jsonwebtoken');
const util=require('util');
const { schema } = require('./book');
const { token } = require('morgan');
const secret="Ha^^&MMNhjg..<>7897123";//my secret
const _=require('lodash');///////////////////////////////

const signJWT=util.promisify(jwt.sign);
const verifyJWT=util.promisify(jwt.verify);

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique: true, // Unique index. If you specify `unique: true`
        minLength:5
    },
    password:{
        type:String,
        required:true,
        minLength:5
    },
    favoriteBooks: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'Book' }
    ]
},
{
    toJSON:{
        transform:(doc,ret)=>_.omit(ret,['__v','password','_id'])//remove those items from the returned json file 
        //or you can use .pick to choose certain fields
    }
})

userSchema.pre('save',async function(){
    const currentDocument=this;
    if(currentDocument.isModified("password")){
        currentDocument.password=await bcrypt.hash(currentDocument.password,saltRounds);
    }
});

userSchema.methods.CheckPassword=async function(inputPassword){
    const currentDocument=this;
    return await bcrypt.compare(inputPassword,currentDocument.password);
}

userSchema.methods.GenerateToken=function(){
    const currentDocument=this;
    return signJWT({id:currentDocument.id},secret,{expiresIn:"45m"});
}

userSchema.statics.getUserFromToken=async function(token){
    const currentUser=this;
    const {id}=await verifyJWT(token,secret);
    const user=await currentUser.findById(id);
    return user;
}

const User=mongoose.model('User',userSchema)
module.exports=User;