import exprss, { json } from  "express"
import cors from "cors"
import dotenv from "dotenv"
import {connectDB} from "./config/db"
import authRouter from "./routers/authRouter";
import schemeRouter from "./routers/schemesRouter";
import complaintRouter from "./routers/complaintRouter";
import aichatRouter from "./routers/aichatRouter";
import serviceLocatorRouter from "./routers/servicelocatorRouter.";
import { isAuth } from "./middleware/authMiddleware";
import userRouter from "./routers/userRouter";
import disasterRouter from "./routers/disasterRouter";
import Alertrouter from "./routers/disasterRouter";
import districtsRouter from "./routers/districtRouter";
import { runAlertFetcher } from "./services/alerts/AlertServices";
import cron from "node-cron";

dotenv.config();

const app  = exprss();

app.use(cors())

app.use(exprss.json());

app.use("/api/auth",authRouter);
app.use("/api/schemes",schemeRouter)
app.use("/api/complaints",complaintRouter)
app.use("/api/ai",aichatRouter)
app.use("/api/location",isAuth,serviceLocatorRouter)
app.use("/api/user",isAuth,userRouter)
app.use("/api/districts",districtsRouter);
app.use("/api/alerts",Alertrouter);

const PORT : string | number = process.env.BACKEND_PORT || 5000;

connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    })
    runAlertFetcher();

    cron.schedule('*/30 * * * *', () => {
      console.log('⏱ Cron: running alert fetcher...');
      runAlertFetcher();
    });
})

