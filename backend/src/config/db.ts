import mongoose from "mongoose"

import dotenv from "dotenv"

dotenv.config();


export const connectDB = async (db : string | undefined) : Promise<void> => {
    try {
     if(!db){
       process.exit(1);
     }
      await mongoose.connect(db);
      console.log("✔️ Connected DB successfuly")
    }
    catch(error){
        console.error("Error connecting DB",error)
        process.exit(1);
    }
} 

