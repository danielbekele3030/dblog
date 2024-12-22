
import jsonwebtoken from "jsonwebtoken";
import HttpError from "../models/errorModel.js";

 const auth=(req,res,next)=>{
    const Authorization=req.headers.Authorization || req.headers.authorization
    if(Authorization && Authorization.startsWith('Bearer')){
        const token=Authorization.split(' ')[1]
        jsonwebtoken.verify(token,process.env.JWT_SECRET,(error,info)=>{
            if(error){
                return next(new HttpError("unauthorized invalid token used"))
            }
            req.user=info
            next()
        })
    }else{
        return next(new HttpError("unauthorized No token",402))
    }

}
export default auth;