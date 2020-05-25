/* Description-: simple tweet app, with sigun, login, search user with @userName , post and tag users, view the post 
created by me, view the post you are taged on 
   note-: 1-no middleware is created as no authentication was required 
          2- user data has been handled through userId, which is taken in body,
          3- all the body data is of raw type      
          4- only few apis were required so no saperate route or controller is needed*/
        
const express = require('express');
const app = express();
const fs = require('fs')
const bodyParser = require ('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
let server = app.listen((3000));


 //************************************* signup ************************** */
  // please pass in body -: userName
  app.post('/signup', async(req,res)=>{
    try{
    if(!req.body.userName) 
    throw new Error("userName is required!") 
    let tagName = "@"+req.body.userName;
    fs.readFile('user.json', 'utf8', function readFileCallback(err, userList){
        if (err){
            console.log(err);
        } else {
        if(userList)
        obj = JSON.parse(userList);
        else
        obj = []
        if(obj.length){
            if(userList.includes(tagName)){
                res.status(403).json({error:"User already registered"});
                return
            }
        }            
        obj.push(tagName)
        json = JSON.stringify(obj); 
        fs.writeFile('user.json', json, 'utf8',(err)=>{
            if (err){
                console.log(err);
            } else {
                res.status(200).json({response:{name:tagName}, message:"Signup successful!"});
            }
        })}
    });
}
    catch(error){
        res.status(403).json({error:error.message});
    }
});



//************************************* Post ************************** */
  // please pass in body -: post,userName-your userName , tagedUser: array of @userName of the users whom you want to tag
app.post('/post', async(req,res)=>{
    try{
        if(!req.body.userName)
        throw new Error("Please send user name!")

        let tagedUser = req.body.tagedUser
        fs.readFile('user.json', 'utf8', function readFileCallback(err, userList){
            if (err){
                console.log(err);
            } else {
            if(userList)
            obj = JSON.parse(userList);
                if(!userList.includes(req.body.userName) && !userList.includes('@'+req.body.userName)){
                    res.status(403).json({error:"Inavalid user!"});
                    return
                }
                for(let i =0; i<tagedUser.length;i++){
                    if(!userList.includes(tagedUser[i]) && !userList.includes('@'+tagedUser[i])){
                        res.status(403).json({error:"Invalid taged user!"});
                        return
                    }
                }
                if(!req.body.post)
                throw new Error("Please enter valid post!")
                if(!req.body.tagedUser)
                throw new Error("Please tag atleast one user")
                if(req.body.tagedUser.length == 0)
                throw new Error("Please tag atleast one user")
                let data = {post:req.body.post,userName:req.body.userName,tagedUser:req.body.tagedUser}
                var postList = []
                fs.readFile('post.json', 'utf8', function readFileCallback(err, data1){
                    if (err){
                        console.log(err);
                    } else {
                        
                    if(data1){
                        obj = JSON.parse(data1);
                        obj.push(data)
                        json = JSON.stringify(obj);
                     } 
                     else{
                         postList.push(data)
                         json = JSON.stringify(postList);
                     }
                     fs.writeFile('post.json', json, 'utf8',(err)=>{
                        if (err){
                            console.log(err);
                        } else {
                            res.status(200).json({response:data, message:"Post created successfully!"});
            
                        }
                    })
                }
            });
        }
    });
}
  catch(error){
        res.status(403).json({error:error.message});
    }  
})

//***************************** Search @user *************************** */
  // please pass in body -: search: key you want to search along with @ (eg. @yourName),
app.post('/searchUser', async(req,res)=>{
    try{ 
        let search = req.body.search 
    if(!search)
    throw new Error("Please enter name!")
    fs.readFile('user.json', 'utf8', function readFileCallback(err, userList){
        if (err){
            console.log(err);
        } else {
        if(userList)
        obj = JSON.parse(userList);
            if(userList.includes(search) || userList.includes("@"+search)){
                res.status(200).json({response:{name:search}});
                return
            }
             else {
                res.status(403).json({message:"user not found!"});

            }
        }
    });
}
    catch(error){
            res.status(403).json({error:error.message});
        }  
})

//************************************* Post ************************** */
// body- userId:your userId
app.post('/myTweet', async(req,res)=>{
    try{
    var myPost = []
    if(!req.body.userName)
    throw new Error("Please send your user name!") 
    fs.readFile('user.json', 'utf8', function readFileCallback(err, userList){
        if (err){
            console.log(err);
        } else {
        if(userList)
        obj = JSON.parse(userList);
            if(!obj.includes(req.body.userName) && !obj.includes("@"+req.body.userName)){
                res.status(403).json({error:"Invalid user!"});
                return
            }
            else{    
                fs.readFile('post.json', 'utf8', function readFileCallback(err, postList){
                    if (err){
                        console.log(err);
                    } else {
                    if(postList)
                    objPost = JSON.parse(postList);
                    for( let list of objPost){
                        if(list.userName == req.body.userName)
                        myPost.push(list)
                    }
                    res.status(200).json({response:myPost});
                }}); 
            }            
        }
    }); 
}
    catch(error){
        res.status(403).json({error:error.message});
    }  
})

//************************************* Post ************************** */
// body- userName:your userName
app.post('/myMentions', async(req,res)=>{
    try{
        let mytags = []
        if(!req.body.userName)
        throw new Error("Please send your user name!") 
        fs.readFile('user.json', 'utf8', function readFileCallback(err, userList){
            if (err){
                console.log(err);
            } else {
            if(userList)
            obj = JSON.parse(userList);
                if(!userList.includes(req.body.userName) && userList.includes("@"+req.body.userName)){
                    res.status(403).json({error:"Inavalid user!"});
                    return
                }
                else{
                    fs.readFile('post.json', 'utf8', function readFileCallback(err, postList){
                        if (err){
                            console.log(err);
                        } else {
                        if(postList)
                        obj = JSON.parse(postList);
                        for( let list of obj){
                            if(list.tagedUser.includes(req.body.userName) || userList.includes("@"+req.body.userName))
                            mytags.push(list)
                        }
                        res.status(200).json({response:mytags});
                        }});
                    }
                }
            });     
        }       
    catch(error){
        res.status(403).json({error:error.message});
    }  
})