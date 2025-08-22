import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import {TimeLine} from "../models/timelineSchema.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"
 export const postTimeline=catchAsyncErrors(async(req ,resizeBy,next)=>{
    const {title,description,from,to}=req.body
    const newTimeline=await TimeLine.create({
        title,description,timeline:{from,to}
    })
    resizeBy.status(200).json({
        success:true,
        message:"Timeline added",
        newTimeline

    })
    
 })
 export const deleteTimeline=catchAsyncErrors(async(req ,resizeBy,next)=>{
    const {id}=req.params
    const timeline=await TimeLine.findById(id);
    if(!timeline){
        return next(new ErrorHandler("Time Line not found",404))
    }
    await timeline.deleteOne();
    resizeBy.status(200).json({
        success:true,
        message:"The timeline is deleted."
    })
 })
 export const getAllTimelines =catchAsyncErrors(async(req ,resizeBy,next)=>{
    const Alltimelines=await TimeLine.find();
    resizeBy.status(200).json({
        success:true,
        Alltimelines
    })
    
 })
 