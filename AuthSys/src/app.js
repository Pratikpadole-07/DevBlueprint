import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";

const app=express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(cookieParser());


app.get("/", (req,res)=>{
    res.status(200).json({
        success:true,
        message:"Authentication API running"
    })
});

app.use("/api/auth",authRoutes);

app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});

app.use(errorHandler);

export default app;
