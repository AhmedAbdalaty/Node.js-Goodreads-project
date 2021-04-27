const express=require('express');
const router=express.Router();
const book=require('../models/book');
const {check,validationResult}=require('express-validator');
const checkMiddelWare=require('../middelwares/checkMiddelWare')
const CustomError=require('../helpers/customError');


router.get('/',
    async(req,res,next)=>
    {
        try{
            const AllBooks=await book.find({});
            res.json({
                AllBooks
            })
        }
        catch(err){
            const error=new CustomError('Unhandled Error',422)
            next(error);
        }
    })

router.get('/id',
check('id').isLength({min:1}),
checkMiddelWare,
async(req,res,next)=>
{
    try{
        const newBook=await book.find({"_id":req.body.id});
        res.json({
            newBook
        })
    }
    catch(err){
        const error=new CustomError('Wrong id',401,{message:"invalid book"});
        next(error);
    }
})

router.post('/',
    check('isbn').isLength({min:1}),
    check('title').isLength({min:1}),
    checkMiddelWare,
     async(req,res,next)=>{
        try{
            const createdBook=new book({
                isbn:req.body.isbn,
                title:req.body.title,
                subtitle:req.body.subtitle,
                author:req.body.author,
                published:req.body.published,
                publisher:req.body.publisher,
                pages:req.body.pages,
                description:req.body.description,
                website:req.body.website
            });
            const Book=await createdBook.save();
            res.status(200).send(Book);
        }catch(err){
            const error=new CustomError('Unhandled Error',422)
            next(error);
        }
})

router.put('/', 
    check('_id').isLength({min:1}),
    check('isbn').isLength({min:1}),
    check('title').isLength({min:1}),
    checkMiddelWare,
    async (req, res, next) => {
    try {
   
        const searchedBook=await book.findById({"_id": req.body._id});
        searchedBook.isbn= req.body.isbn
        searchedBook.title=req.body.title
        searchedBook.subtitle=req.body.subtitle
        searchedBook.author= req.body.author
        searchedBook.published= req.body.published
        searchedBook.publisher=req.body.publisher
        searchedBook.pages= req.body.pages
        searchedBook.description= req.body.description
        searchedBook. website=req.body.website
        
        const updatedBook = await searchedBook.save();
        res.status(200).send(updatedBook);
    } catch (err) {
        const error=new CustomError('Wrong id',420,{message:"error"});
        next(error);
    }
})

router.delete('/id',
check('id').isLength({min:1}),
checkMiddelWare,
async(req,res,next)=>
{
    try {
        const searchedBook=await book.findById({"_id": req.body._id});
        const updatedBook = await searchedBook.remove();
        res.status(200).send(updatedBook);
    } catch (err) {
        const error=new CustomError('Wrong id',420,{message:"invalid book"});     
        next(error);
    }
})

module.exports=router;