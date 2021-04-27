const express=require('express');
const router=express.Router();
const user=require('../models/user');
const book=require('../models/book');
const checkMiddelWare=require('../middelwares/checkMiddelWare');
const {check,validationResult}=require('express-validator');
const authenticationMiddeleware=require('../middelwares/authenticate');
const CustomError=require('../helpers/customError');
const _=require('lodash');

router.post('/signUp',
    check('username').isLength({min:5}),
    check('password').isLength({min:5}),
    checkMiddelWare
    ,
     async(req,res,next)=>{
        try{
            const createdUser=new user({
                username:req.body.username,
                password:req.body.password
            });
            const savedUser=await createdUser.save();
            res.status(200).send(savedUser);
        }catch(err){
            const error=new CustomError('Unhandled Error',422)
            next(error);
        }
})

router.get('/login',
    check('username').isLength({min:5}),
    check('password').isLength({min:5}),
    checkMiddelWare,
    async(req,res,next)=>
    {
        try{
            const loginUser=await user.findOne({username:req.body.username});
            if(!loginUser){
                throw new CustomError('Wrong username or password',401);
            }
            const Match=await loginUser.CheckPassword(req.body.password);
            if(!Match){
                throw new CustomError('Wrong username or password',401);
            }
            const token=await loginUser.GenerateToken();
            res.json({
                loginUser,
                token
            })
        }
        catch(err){
            const error=new CustomError('Unhandled Error',422)
            next(error);
        }
    })

router.get('/profile',
    authenticationMiddeleware,
    async(req, res,next) => {
        try{
        let {favoriteBooks}=await user.findOne({username:req.user.username}).populate("favoriteBooks");
        res.json({
            user:req.user.username,
            Books:favoriteBooks
        })}
        catch(err){
            const error=new CustomError('Wrong id',401,{message:"Server Error"});
            next(error);
        }
        //const searchedBook=await book.findById({"_id": req.body._id});
});

router.post('/addBooks',
    authenticationMiddeleware,
    async(req,res,next)=>
    {
        try{
            const newBook=await book.find({"_id":req.body.id});
            //console.log(newBook)
            //console.log(JSON.stringify(newBook))
            req.user.favoriteBooks.push(req.body.id);
            var updateUser=await req.user.save();
            res.send('book added')
        }
        catch(err){
            const error=new CustomError('Wrong id',401,{message:"invalid book"});
            next(error);
        }
})

module.exports=router;