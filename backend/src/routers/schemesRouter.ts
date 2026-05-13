import express from "express";
import { login, register } from "../controllers/authControllers";
import { isAuth } from "../middleware/authMiddleware";
import { getAllSchemes, getRecomenderSchemes, getSingleScheme } from "../controllers/schemeControllers";
import { generateSmartQuestions } from "../controllers/questionnaireController";

const schemeRouter = express.Router();

schemeRouter.get("/",isAuth,getAllSchemes);
schemeRouter.post("/:id",getRecomenderSchemes)
schemeRouter.get("/recommender",isAuth,getRecomenderSchemes)
schemeRouter.get("/:slug/questions",isAuth,generateSmartQuestions)
schemeRouter.get("/:slug",isAuth,getSingleScheme)
export default schemeRouter