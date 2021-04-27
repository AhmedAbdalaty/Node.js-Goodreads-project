const {check,validationResult}=require('express-validator');
const CustomError=require('../helpers/customError');

module.exports=(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){  
      const error=new CustomError('Validation error',422,errors.mapped())
      // new Error('Validation error');
      // error.statusCode=422;
      // error.errors=errors.reduce((agg,FieldError)=>{
      //   agg[FieldError.param]=FieldError;
      //   return agg;
      // },{});
      return next(error);
    }
    next();
  }
