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


dotenv.config();

const app  = exprss();

app.use(cors())

app.use(exprss.json());

app.use("/api/auth",authRouter);
app.use("/api/schemes",schemeRouter)
app.use("/api/complaints",complaintRouter)
app.use("/api/ai",aichatRouter)
app.use("/api/location",isAuth,serviceLocatorRouter)

const PORT : string | number = process.env.BACKEND_PORT || 5000;

connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    })
})

