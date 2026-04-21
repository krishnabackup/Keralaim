import { Users, UsersType } from "../models/Users";
import { ApiResponse, LoginBody, LoginResponseBody, RegisterBody, RegisterResponseBody } from "../types/auth.types";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();

export const login = async (req: Request<{}, {}, LoginBody>, res: Response<ApiResponse<LoginResponseBody>>) => {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required ", success: false })
    const normalizedemail = email.trim().toLowerCase();
    const user: UsersType | null = await Users.findOne({ email : normalizedemail });
    if (!user) return res.status(404).json({ message: "Invalid Credential", success: false })

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) return res.status(404).json({ message: "Invalid Credential", success: false });

    const token = jwt.sign({
        userId: user._id,
        isAdmin: user.isAdmin
    }, process.env.JWT_SECRET as string)

    return res.status(200).json({
        message: "Login Succesfull",
        success: true,
        data: {
            userId: user._id,
            token: token
        }
    })

}

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response<ApiResponse<RegisterResponseBody>>) => {
    try{
 const { name, district, email, password} = req.body;
   console.log(name,district,email,password);
    if (!name || !district || !email || !password) return res.status(400).json({ message: "All fields required ", success: false });

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists",
        });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Users.create({
        name: name,
        email: email,
        password: hashedPassword,
        district : district,
    });

    const token = jwt.sign({
        userId: newUser._id,
        isAdmin: newUser.isAdmin
    }, process.env.JWT_SECRET as string)


    return res.status(201).json({ message: "registered succesfully ", success: true, data: { userId: newUser._id, token: token } })
}
    catch(error){
        console.error("Error : ",error)
    }
}  


