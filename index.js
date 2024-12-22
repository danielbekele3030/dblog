import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fileuploads from 'express-fileupload'
import userRoute from './src/routers/userRoute.js'
import mongoose from 'mongoose'
import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url';
import postRoute from './src/routers/postRoute.js'
import {notFound,errorHandler} from './src/middlwares/errorMiddleware.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app=express()

app.use(express.json({extended:true}))
app.use(express.urlencoded({extended:true}))
app.use(cors({credentials:true,origin:"http://localhost:3000"}))
dotenv.config()

app.use(fileuploads())
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use(notFound)
app.use(errorHandler)


const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const PORT=7000
mongoose.connect(process.env.URL).then(()=> { 
    
    // Use the connecti  on object to perform database operations
    app.listen(PORT,()=>{
        console.log(`server started on http://localhost:${PORT}`)
    }) 
    // ...
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
    // Handle the error
  });








 
