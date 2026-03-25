import { connectDB } from "../config/db";
import { getSchemes } from "../services/fetchLinks";
import dotenv from "dotenv"
import { runWorker } from "./worker";
import { seedSchemes } from "../services/seedSchemes";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});


const startScrapping = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) throw new Error("Mogo URI not defined in .env");

        await connectDB(process.env.MONGO_URI);
        console.log("DB Connected");

        const shouldSeed = process.env.SEED === "true";
        if (shouldSeed) {
            console.log("Seeding schemes...");
            await seedSchemes();
            console.log("Seeding complete");
        }
        console.log("Starting worker...");
        await runWorker();
    }
    catch (error) {
        console.error("Error scrapping", error)
        process.exit(1);
    }

}

startScrapping();