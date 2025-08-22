import mongoose from "mongoose";

export const connectDB=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"PORTFOLIO"
    }).then(()=>{
        console.log("Database connected successfully")
    }).catch((err)=>{
        console.log("Failed to connect database",err)
    })
}