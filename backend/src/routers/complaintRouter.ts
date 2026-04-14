// routes/complaintRoutes.ts
import express from "express";
import { createComplaint, getUserComplaints } from "../controllers/complaintController";
import { upload } from "../middleware/upload";
import { isAuth } from "../middleware/authMiddleware";

const complaintRouter = express.Router();

complaintRouter.post("/", isAuth,upload.single("image"), createComplaint);
complaintRouter.get("/user", isAuth, getUserComplaints);
export default complaintRouter;