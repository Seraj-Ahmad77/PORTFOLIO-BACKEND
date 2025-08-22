import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"

import {Message} from "../models/messageSchema.js"

export const sendMessage=catchAsyncErrors(async(req , res ,next)=>{
    const {senderName,message,subject}=req.body;
    if(!message || !senderName || ! subject){
        return next(new ErrorHandler("Please enter all fields",400))
    }
    const data=await Message.create({senderName,subject,message});
    res.status(200).json({
        success:true,
        message:"Message Sent",
        data
    })
})

export const getAllMessages=catchAsyncErrors(async(req,res,next)=>{
    const messages=await Message.find();
    res.status(200).json({
        success:true,
        messages
    })
})

export const deleteMessage=catchAsyncErrors(async(req,res,next)=>{
    const {id}=req.params;
    const message=await Message.findById(id);
    if(!message){
        return next(new ErrorHandler("Message already deleted.",400));
    }
    await message.deleteOne();
    res.status(200).json({
        success:true,
        message:"Message Deleted."
    })
})
