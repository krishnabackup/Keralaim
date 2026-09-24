import express, { json } from  "express"
import cors from "cors"
import dotenv from "dotenv"
import authRouter from "./routers/authRouter";
import schemeRouter from "./routers/schemesRouter";
import complaintRouter from "./routers/complaintRouter";
import aichatRouter from "./routers/aichatRouter";
import serviceLocatorRouter from "./routers/servicelocatorRouter.";
import { isAuth } from "./middleware/authMiddleware";
import districtsRouter from "./routers/districtRouter";
import AlertRouter from "./routers/disasterRouter";

dotenv.config();

const app  = express();

app.use(cors())

app.use(express.json());

app.use("/api/auth",authRouter);
app.use("/api/schemes",schemeRouter)
app.use("/api/complaints",complaintRouter)
app.use("/api/ai",aichatRouter)
app.use("/api/location",isAuth,serviceLocatorRouter)
app.use("/api/districts",districtsRouter);
app.use("/api/alerts",AlertRouter);

export default app;
