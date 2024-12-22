

//page not found
export const notFound=(request,response,next)=>{
    const error=new Error(`not found - ${request.orginalUrl}`)
    response.status(404)
    next(error)
}

//error middleware

export const errorHandler=(error,request,response,next)=>{
    if(response.headerSent){
        return next(error)
    }
    response.status(error.code||500).json({message:error.message||"unknown server erro"})
}
