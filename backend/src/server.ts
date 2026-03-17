import exprss, { json } from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config();

const app : Express = exprss();

app.use(cors())

app.use(json)


const PORT : string | number = process.env.BACKEND_PORT || 5000;

app.listen(PORT,() => {
   console.log(`✔️ Server connected on ${PORT}`);
})