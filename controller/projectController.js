import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Project } from "../models/projectSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewProject = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Project banner image is required", 400));
  }

  const { projectBanner } = req.files;
  const {
    title,
    description,
    gitRepoLink,
    projectLink,
    technologies,
    stack,
    deployed,
  } = req.body;

  if (
    !title ||
    !description ||
    !gitRepoLink ||
    !projectLink ||
    !technologies ||
    !stack ||
    !deployed
  ) {
    return next(new ErrorHandler("Please provide all details.", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    projectBanner.tempFilePath,
    { folder: "PROJECT_IMAGE" }
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown cloudinary Error"
    );
    return next(
      new ErrorHandler("Failed to upload project banner to cloudinary.", 500)
    );
  }

  const project = await Project.create({
    title,
    description,
    gitRepoLink,
    projectLink,
    technologies,
    stack,
    deployed,
    projectBanner: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "New project created",
    project,
  });
});

export const deleteProject = catchAsyncErrors(async (req, res, next) => {
    const {id}=req.params;
    const project=await Project.findById(id);
    if(!project){
        return next(new ErrorHandler("Project not found",404))
    }

    await project.deleteOne();
    res.status(200).json({
        suuces:true,
        message:"project deleted."
    })

});
export const updateProject = catchAsyncErrors(async (req, res, next) => {
  const newProjectData = {
    title: req.body.title,
    description: req.body.description,
    gitRepoLink: req.body.gitRepoLink,
    projectLink: req.body.projectLink,
    technologies: req.body.technologies,
    stack: req.body.stack,
    deployed: req.body.deployed,
  };

  if (req.files && req.files.projectBanner) {
    const projectBanner = req.files.projectBanner;
    const existingProject = await Project.findById(req.params.id);

    if (existingProject?.projectBanner?.public_id) {
      await cloudinary.uploader.destroy(existingProject.projectBanner.public_id);
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      projectBanner.tempFilePath,
      { folder: "PROJECT_IMAGE" }
    );

    newProjectData.projectBanner = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    newProjectData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Project updated.",
    project: updatedProject,
  });
});

export const getSingleProject = catchAsyncErrors(async (req, res, next) => {
    const {id}=req.params
    const project=await Project.findById(id);
    if(!project){
        return next(new ErrorHandler("Project not found",400))
    }
    res.status(200).json({
        success:true,
        project
    })
});
export const getAllProject = catchAsyncErrors(async (req, res, next) => {
    const projects=await Project.find();
    res.status(200).json({
        success:true,
        projects
    })
});
