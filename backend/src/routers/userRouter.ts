import express from "express";
import { generateCommonQuestions } from "../controllers/questionnaireController";
import { updateProfile } from "../controllers/userController";
import { isAuth } from "../middleware/authMiddleware";

const userRouter = express.Router();

userRouter.get("/common_questions", generateCommonQuestions);
userRouter.patch("/profile",isAuth, updateProfile);
export default userRouter;