import exprss, { json } from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config();

const app = exprss();

app.use(cors())

app.use(json)


const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT,() => {
   console.log(`✔️ Server connected on ${PORT}`);
})