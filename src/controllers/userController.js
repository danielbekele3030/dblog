//==============================Register Route
//=======================/api/users/register
//UNPROTECTED

import HttpError from "../models/errorModel.js";
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

import  {v4} from 'uuid'

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
export const  userRegister=async (req,res,next)=>{
   try {
      const {name,email,password,password2}=req.body;
      if(!name||!email||!password){
         return next(new HttpError("can not be left balnk",422))
      }
      
      
      const newEmail=email.toLowerCase()
      const emailExists=await User.findOne({email:newEmail})
      if(emailExists){
         return next(new HttpError("email alrready exists",422))
      }
      if(password !=password2){
         return next(new HttpError("password do not much",422))
      }
      const salt=await bcrypt.genSalt(10);
      const hashPassword=await bcrypt.hash(password,salt)

      const newUser=await User.create({name,email:newEmail,password:hashPassword})
      res.status(201).json(newUser)
   } catch (error) {
      return next(new HttpError(error));
   }
}


 //==============================goes to login  Route
//=======================/api/users/login
//PROTECTED
export const  loginUser=async (req,res,next)=>{
     try {
      const {email,password}=req.body;
      const user=await User.findOne({email})
      if(!user){
         return next(new HttpError("invalid credinstional",422))
      }
      const passwordCompare=await bcrypt.compare(password,user.password)
      if(!passwordCompare){
         return next(new HttpError("invalid credinstional",422))
      }
      const {_id:id,name}=user;
      const token=jwt.sign({id,name},process.env.JWT_SECRET,{expiresIn:"1d"})
      res.status(200).json({token,id,name})
      
     } catch (error){
       return next(new HttpError("login Failed",422))
     }
 } 

  //==============================goes to profile  Route
//=======================/api/users/:id
//PROTECTED
export const getUser= async (req,res,next)=>{
     try {
        const {id}=req.params
        const user=await User.findById(id).select('-password')
        if (!user) { 
         return next(new HttpError("User not found",404))
        }
        res.status(200).json(user)

      
     } catch (error) {
       return next(new HttpError("opreation faild",422))
     }
 }
  //==============================change user Avater
//=======================/api/users/change-avater
//PROTECTED
export const  chageAvater=async (req,res,next)=>{
    try{
      if(!req.files.avator){
         return next(new HttpError("please choose an image",422))
      }

      //
      const user=await User.findById(req.user.id)
      if(user.avator){
         fs.unlink(path.join('uploads',user.avator),(error)=>{
            if(error){
               return next(new HttpError(error))
            }
         })
      }
      const {avator}=req.files
      if(avator.size > 500000){
         return next(new HttpError("profiel image to large",422))
      }
      let fileName=avator.name

      let spilettedFileName=fileName.split('.')
      const newFileName=spilettedFileName[0] + v4() + '.' + spilettedFileName[spilettedFileName.length-1]
      avator.mv(path.join('uploads',newFileName),async (error)=>{
         if(error){ 
            return next(new HttpError(error))
         }
         const updateAvatar=await User.findByIdAndUpdate(req.user.id,{avator :newFileName},{new:true})
          if(!updateAvatar){
            return next(new HttpError("updating the avatar faild",422))
          }
          res.status(200).json(updateAvatar)
      })

    } catch(error){
      return next(new HttpError(error))
    }
   
 }
 //==============================Edit profile
//=======================/api/users/edit-user
//PROTECTED
export const  editeUser=async (req,res,next)=>{
    try {
      const {name,email,currentPassword,newPassword,confirmPassword}=req.body
      if(!name ||!email || !currentPassword || !newPassword || !confirmPassword){
         return next(new HttpError("empty field",422))
      }
      const user=await User.findById(req.user.id)
      if(!user){
         return next(new HttpError("user not found",403))
      }
      const emailExists=await User.findOne({email})
      if(emailExists && (emailExists._id) !=req.user.id){
         return next(new HttpError("this email aready exists",422))
      }
      const validatePassword=await bcrypt.compare(currentPassword,user.password)
      if(!validatePassword){
         return next(new HttpError("wrong password",422))
      }

     if(newPassword !== confirmPassword){
      return next(new HttpError("password do not much",422))
     }
      const salt=await bcrypt.genSalt(10)
      const hash=await bcrypt.hash(newPassword,salt)

      const updateUser=await User.findByIdAndUpdate(req.user.id,{name,email,password:hash},{new:true})
      res.status(200).json(updateUser)
      
      
    } catch (error) {
      return next(new HttpError("internal server error",500))
    }
 }
 //==============================get all authors
//=======================/api/users/authors
//PROTECTED
export const  getAuthors=async (req,res,next)=>{
  try {
     const authors=await User.find().select('-password')
     if(!authors){
      return next(new HttpError("no use found",404))
     }
     res.status(200).json(authors)
  } catch (error) {
   return next(new HttpError(error))
  }
    
}
  

 export default {userRegister,loginUser,chageAvater,getAuthors,editeUser,getUser}

