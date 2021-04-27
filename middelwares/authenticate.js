const User=require("../models/user");
module.exports=async(req,res,next)=>{
    try{
        const authorization=req.headers.authorization;
        if(!authorization){
          const error=new Error("authorization required");
          error.statusCode=401;
          throw error
        };
        req.user=await User.getUserFromToken(authorization);
        if(!req.user){
          const error=new Error("authorization required");
          error.statusCode=401;
          throw error
        }
        next();
  }catch(err){
    next(err)
  }
  }