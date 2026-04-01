import e from "express";
import express from "express";
import { chatController } from "../controllers/aiChatBotController";

const aichatRouter = express.Router();

aichatRouter.post("/chat", chatController);

export default aichatRouter;