import { NextFunction,Request, Response} from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const isAuth = async (req : Request , res : Response , next : NextFunction) => {
   const token = req.headers.authorization?.split(" ")[1];

   try{
      if(!token) return res.status(401).json({message : "No token found"});

      const decode = jwt.verify(token,process.env.JWT_SECRET as string);
      req.user = decode
      next();
   }
   catch(error){
    console.error("Error : ",error)
    
   }
}