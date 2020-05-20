/* Description-: simple tweet app, with sigun, login, search user with @userName , post and tag users, view the post 
created by me, view the post you are taged on 
   note-: 1-no middleware is created as no authentication was required 
          2- user data has been handled through userId, which is taken in body,
          3- all the body data is of raw type      
          4- only few apis were required so no saperate route or controller is needed*/
        
const express = require('express');
const app = express();
const { UserModel } = require("./model/user");
const { PostModel } = require("./model/post");
const bodyParser = require ('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
let server = app.listen((3000));


 //************************************* signup ************************** */
  // please pass in body -: name,password
  app.post('/signup', async(req,res)=>{
    try{
    if(!req.body.name || !req.body.password) 
    throw new Error("Some parameter are missing!") 
    const checkUser = await UserModel.findOne({name:req.body.name})
    if(checkUser)
    throw new Error("User already registered")
    let tagName = "@"+req.body.name;
    const data = await UserModel.create({name:req.body.name, password: req.body.password,tagName})
    if(!data)
    throw new Error("Unable to save data!")
    res.status(200).json({response:data, message:"Signup successful!"});
}
    catch(error){
        res.status(403).json({error:error.message});
    }
});

//************************************* Login ************************** */
  // please pass in body -: name,password
app.post('/login', async(req,res)=>{
    try{
    const data = await UserModel.findOne({name:req.body.name, password: req.body.password},{password:0})
    if(!data)
    throw new Error("Invalid credentials!")
    res.status(200).json({response:data, message:"Login successful!"});
    }
  catch(error){
        res.status(403).json({error:error.message});
    }  
})

//************************************* Post ************************** */
  // please pass in body -: post,userId-your _id , tagedUser: array of userId of the users whom you want to tag
app.post('/post', async(req,res)=>{
    try{
    const checkUser = await UserModel.findOne({_id:req.body.userId})
    if(!checkUser)
    throw new Error("Invalid User!")
    if(!req.body.post)
    throw new Error("Please enter valid post!")
    if(!req.body.tagedUser)
    throw new Error("Please tag atleast one user")
    if(req.body.tagedUser.length == 0)
    throw new Error("Please tag atleast one user")
    let createPost = await PostModel.create({post:req.body.post,userId:req.body.userId,tagedUser:req.body.tagedUser})
    if(!createPost)
    throw new Error("Unable to save data!")
    res.status(200).json({response:createPost, message:"Post successfully uploaded!"});
    }
  catch(error){
        res.status(403).json({error:error.message});
    }  
})

//***************************** Search @user *************************** */
  // please pass in body -: search: key you want to search along with @ (eg. @yourName),userId-your _id 
app.post('/searchUser', async(req,res)=>{
    try{
    if(!req.body.userId)
    throw new Error("Please send your _id!")   
    if(!req.body.search)
    throw new Error("Please enter name!")
    const userList = await UserModel.find({
            $nor:[{
                _id:req.body.userId
            }],
            tagName: {
                $regex: req.body.search,
                $options: 'i'
            }
    },{
        tagName:1
    })
    res.status(200).json({response:userList});
    }
  catch(error){
        res.status(403).json({error:error.message});
    }  
})

//************************************* Post ************************** */
// body- userId:your userId
app.post('/myTweet', async(req,res)=>{
    try{
    if(!req.body.userId)
    throw new Error("Please send your userId!")      
    const checkUser = await UserModel.findOne({_id:req.body.userId})
    if(!checkUser)
    throw new Error("Invalid User!")
    let postList = await PostModel.find({}).sort({createdAt:-1})
    res.status(200).json({response:postList});
    }
  catch(error){
        res.status(403).json({error:error.message});
    }  
})

//************************************* Post ************************** */
// body- userId:your userId
app.post('/myMentions', async(req,res)=>{
    try{
    if(!req.body.userId)
    throw new Error("Please send your userId!")      
    const checkUser = await UserModel.findOne({_id:req.body.userId})
    if(!checkUser)
    throw new Error("Invalid User!")
    let postList = await PostModel.find({tagedUser:{$in:req.body.userId}}).sort({createdAt:-1})
    res.status(200).json({response:postList});
    }
  catch(error){
        res.status(403).json({error:error.message});
    }  
})