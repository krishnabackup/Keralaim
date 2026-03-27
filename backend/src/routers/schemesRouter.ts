import express from "express";
import { login, register } from "../controllers/authControllers";
import { isAuth } from "../middleware/authMiddleware";
import { getAllSchemes, getRecomenderSchemes } from "../controllers/schemeControllers";

const schemeRouter = express.Router();

schemeRouter.get("/",isAuth,getAllSchemes);
schemeRouter.post("/:id",getRecomenderSchemes)

export default schemeRouter