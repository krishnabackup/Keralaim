
import express from "express";
import { createComplaint, getUserComplaints , getImprovedDescription} from "../controllers/complaintController";
import { upload } from "../middleware/upload";
import { isAuth } from "../middleware/authMiddleware";

const complaintRouter = express.Router();

complaintRouter.post("/", isAuth,upload.single("image"), createComplaint);
complaintRouter.get("/me", isAuth, getUserComplaints);
complaintRouter.post("/improve-description",isAuth,getImprovedDescription)
export default complaintRouter;