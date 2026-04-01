// routes/complaintRoutes.ts
import express from "express";
import { createComplaint } from "../controllers/complaintController";
import { upload } from "../middleware/upload";

const complaintRouter = express.Router();

complaintRouter.post("/", upload.single("image"), createComplaint);

export default complaintRouter;