import post from '../models/postModel.js'
import HttpError from "../models/errorModel.js";
import path from 'path'
import fs from 'fs'
import User from '../models/userModel.js'
import {v4} from 'uuid'
// ===========APTI TO CREATE A POST
// api/posts
//PROTECTED
export const createPost=(req,res,next)=>{

  try {
    const {title,catagory,description}=req.body
    if(!title||!catagory||!description|| !req.files){
        return next(new HttpError("emplty field",422))
    }
 const {thuminal}=req.files
 if(thuminal.size >2000000){
    return next(new HttpError("image file to large",422))
 }
 let fileName=thuminal.name
 let spilettedFileName=fileName.split('.')
 let newFileName=spilettedFileName[0] + v4() + '.' + spilettedFileName[spilettedFileName.length-1]
    
 thuminal.mv(path.join('uploads',newFileName),async (error)=>{
    if(error){ 
       return next(new HttpError(error))
    }
    const newPost=await post.create({title,catagory,description,thumbnale:newFileName,creater:req.user.id})
     if(!newPost){
       return next(new HttpError("post faild",422))
     }
     const curretuser=await User.findById(req.user.id)
     const userPostCount=curretuser.posts +1
     await User.findByIdAndUpdate(req.user.id,{posts:userPostCount})

     res.status(201).json(newPost)

 })


  } catch (error) {
    return next(error)
  }
}

// ===========APTI TO fetch single post
// api/posts/:id
//UNPROTECTED
 export const getPost=async (req,res,next)=>{
   const postId=req.params.id
   const Post=await post.findById(postId)
   if(!Post){
    return next(new HttpError("post  not found",404))
   }
   res.status(200).json(Post)
}


// ===========APTI TO fetching  multiple posts
// api/posts
//UNPROTECTED
export const getPosts= async (req,res,next)=>{
 try {
    const posts=await post.find().sort({updatedAt:-1})
    res.json(posts)
 } catch (error) {
    return next(new HttpError(error))
 }
}

// ===========APTI TO fetching post by catagory
// GET: api/posts/catagoris/:catagory
//UNPROTECTED
 export const getCatagoryPosts=async (req,res,next)=>{
    try {
        const {catagory}=req.params
        const postCatagory=await post.find({catagory}).sort({createdAt:-1})
        if(postCatagory.length==0){
           return next(new HttpError("no post in this catagory",404)) 
        }
        res.status(200).json(postCatagory)
 
    } catch (error) {
        return next(new HttpError(error))
    }
}


// ===========APTI TO fetching post by catagory
// GET: api/posts/catagoris/:catagory
//UNPROTECTED
export const getPostsByAuthor=async (req,res,next)=>{
    try {
       
       
    } catch (error) {
        return next(new HttpError(error))
    }
}

// ===========APTI TO fetching post by catagory
// GET: api/posts/user/:id
//UNPROTECTED
 export const getUserPost=async (req,res,next)=>{
    try {
        const {id}=req.params
        const userPost=await post.find({creater:id}).sort({createdAt:-1})
        if(userPost.length==0) {
            return next(new HttpError("no post still",404))
        }
        res.status(200).json(userPost)
    } catch (error) {
        return next(new HttpError(error))
    }
}



// ===========APTI TO CREATE A POST
// patch: api/posts/edit-post/:id
//PROTECTED
export const editPost=async (req,res,next)=>{
 try {
    
   const {postId}=req.params
   let fileName;
   let newFileName;
   let updatedPost;
const {title,catagory,description}=req.body;
if(!title || !description || !catagory){
  return next(new HttpError("fill the fields ...",422))
}

if(!req.files){
  updatedPost=await post.findByIdAndUpdate(postId,{title,catagory,description},{new:true})
}else{
  const oldPost=await post.findById(postId)
  fs.unlink(path.join('uploads',oldPost.thumbnale),async (err)=>{
     if(err){
       return next(new HttpError(err))
     }
  })
  const {thumbnale}=req.files
  if(thumbnale.size >2000000){
    return next(new HttpError("image too large",422))
  }
  fileName=thumbnale.name
  let spilettedFileName=fileName.split('.')
  newFileName=spilettedFileName[0] + v4() + '.' + spilettedFileName[spilettedFileName.length-1]
  thumbnale.mv(path.join('uploads',newFileName),async (err)=>{
    if (err) {
      return next(new HttpError(err))
    }
  })
  updatedPost=await post.findByIdAndUpdate(postId,{title,catagory,description,thumbnale:newFileName},{new:true})

}

if (!updatedPost) {
  return next(new HttpError("udating faild",500))
}
res.status(200).json(updatedPost)

 } catch (error) {
    return next(new HttpError(error))
 }
}

// ===========APTI TO CREATE A POST
//Delete: api/posts/delete/:id
//PROTECTED
export const deletePost=async (req,res,next)=>{
 try {
  const {id}=req.params
  const Post=await post.findById(id)
  const fileName=Post?.thumbnale
  if(req.user.id==Post.creater){
     fs.unlink(path.join('uploads',fileName),async (err)=>{
     if(err){
       return next(new HttpError(err))
     }else{
         await post.findByIdAndDelete(id)
         const currentUser=await User.findById(req.user.id)
         const postcount=currentUser?.posts -1
        await User.findByIdAndUpdate(req.user.id,{posts:postcount})
        res.json(`Post ${id} has been deleted successfully`)

     }

  })
  }else{
    return next(new HttpError("post not found",404))
  }
 
 
  
 } catch (error) {
   return next(new HttpError(error))
 }
}




export default {createPost,editPost,getPost,getPosts,deletePost,getCatagoryPosts,getPostsByAuthor,getUserPost}