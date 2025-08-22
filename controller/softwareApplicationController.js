import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js"
import {SoftwareApplication} from "../models/softwareApplicationSchema.js"

import {v2 as cloudinary} from "cloudinary"
export const addNewApplication=catchAsyncErrors(async(req ,res ,next)=>{
     if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Software application Icon/svg required.", 400));
  }
  const { svg} = req.files;
  const {name}=req.body;
  if(!name){
    return next(new ErrorHandler("Software name is required.",400))
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    svg.tempFilePath,
    {
      folder: "PORTFOLIO_SOFTWARE_APPLICATION",
    }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown cloudinary Error"
    );
  }

  const softwareApplication=await SoftwareApplication.create({
    name,
    svg:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url
    }
  })

  res.status(200).json({
    success:true,
    message:"New software application added.",
    softwareApplication
  })
})
export const deleteApplication=catchAsyncErrors(async(req ,res ,next)=>{
    const {id}=req.params;
    const softwareApplication=await SoftwareApplication.findById(id)
    if(!softwareApplication){
        return next(new ErrorHandler("Software application not found",404))
    }
    const softwareApplicationSvgId=softwareApplication.svg.public_id;
    await cloudinary.uploader.destroy(softwareApplicationSvgId);
    await softwareApplication.deleteOne();
    res.status(200).json({
        success:true,
        message:"Software application deleted."
    })

})
export const getAllApplication =catchAsyncErrors(async(req ,res ,next)=>{
     const AllSoftwareApliation=await SoftwareApplication.find();
        res.status(200).json({
            success:true,
            AllSoftwareApliation
        })

})


