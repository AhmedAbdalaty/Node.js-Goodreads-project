const config=require("./config.json");
const port=config.port;
const express = require('express');
const app = express();
const morgan=require('morgan');
const path=require('path');
const userRouter=require('./routers/user');
const bookRouter=require('./routers/books');

require('./db');

app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(['/user','/users','/myuser'],userRouter);
app.use(['/books','/book','/mybooks'],bookRouter);


//this is an error handler beacuse it takes 4 paramters and if it doesnot it would search for the nearest one
app.use((err,req,res,next)=>{
  console.error(err);
    err.statusCode=err.statusCode||500;
    const handledError=err.statusCode<500;
    res.status(err.statusCode)
    .send(handledError?err:{
      message:'something went wrong'
    })
    //next();
}) 

app.listen(port, () => {
    console.log(`GoodReads http://localhost:${port}`)
  });