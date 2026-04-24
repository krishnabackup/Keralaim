import { connect } from "mongoose";
import { SchemeModel } from "../models/Schemas";
import { processBatch } from "./processBatch";
import dotev from "dotenv";

dotev.config();

const run = async () => {
    try{
     await connect(process.env.MONGO_URI || "");
     console.log("DB Connected for Eligibility Parser");
     const schemes = await SchemeModel.find({ "schemeDetails.eligibility.plainText": { $exists: true }, aiFailed : { $ne : false } });
     console.log("Total Schemes to Process:", schemes.length);
     await processBatch(schemes);
     console.log("Eligibility parsing completed for all schemes");
    }
    catch(error){
        console.error("Error running eligibility parser", error);
        process.exit(1);
    }

}

run();