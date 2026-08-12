import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req,res,next)=>{
    try{
        let token;

        if(req.headers.authorization && 
           req.headers.authorization.startsWith("Bearer")
        )
        {
            token=rq.headers.authorization.split(" ")[1];

        }
        if(!token){
            return res.status(401).json({
                message: "Not Authorized. Token Missing"
            });
        }

        const decoded=jwt.verify(
            token,process.env.JWT_SECRET
        )

        req.user=await user.findById(decoded.id).select("-password");

        if (!req.user) {

            return res.status(401).json({
                message: "User Not Found"
            });

        }

        next();

    }
     catch (error) {

        return res.status(401).json({
            message: "Invalid or Expired Token"
        });

    }
}