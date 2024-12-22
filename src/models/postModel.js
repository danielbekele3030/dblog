import {model,Schema} from 'mongoose'


const postSchema=new Schema({

      title:{type:String,required:true},
      catagory:{type:String,enum:["Agireculter","Business","Education",
        "Entertement","Art","investment","uncatagorized","weather"],message:"{VALUE is not supported"},
      description:{type:String,required:true},
      thumbnale:{type:String,required:true},
      creater:{type:Schema.Types.ObjectId,ref:"User"}
},{timestamps:true})

export default model('Post', postSchema);