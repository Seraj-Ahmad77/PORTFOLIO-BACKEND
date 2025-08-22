import express from "express"
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
const app=express()
import { connectDB } from "./database/db.js";
import {errorMiddleware} from "./middlewares/errorMiddleware.js"
import messageRouter from "./routes/messageRoutes.js"
import userRouter from "./routes/userRoutes.js"
import timelineRouter from "./routes/timelineRoute.js"
import softwareApplicationRouter from "./routes/softtwareApplicationRoute.js"
import skillRouter from "./routes/skillRoute.js"
import projectRouter from "./routes/projectRoute.js"

dotenv.config({path:"./config/config.env"})

app.use(cors({
    origin:[process.env.PORTFOLIO_URL,process.env.DASHBOARD_URL],
    methods:["GET","POST","DELETE","PUT"],
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))

app.use("/api/v1/message",messageRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/timeline",timelineRouter)
app.use("/api/v1/software-application",softwareApplicationRouter)
app.use("/api/v1/skill",skillRouter)
app.use("/api/v1/project",projectRouter)

connectDB()
app.use(errorMiddleware)

export default app;