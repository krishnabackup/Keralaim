// controllers/complaintController.ts
import cloudinary from "../config/cloudinary";
import { error, success } from "../helpers/responseFormat";
import Complaint from "../models/Compliant";
import { Request, Response } from "express";
import { improveComplaintText } from "../services/complaintAi/generateComplaintDescriptionAi";
export const createComplaint = async (req: any, res: any) => {
  try {
    let imageUrl = "";

    // ✅ upload to cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "complaints" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      imageUrl = (result as any).secure_url;
    }

    // ✅ save to DB
    const complaint = await Complaint.create({
      userId: req.user?.userId, // from auth middleware
      location: req.body.location,
      description: req.body.description.trim(),
      title: req.body.title.trim(),
      imageUrl,
    });

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating complaint" });
  }
};

export const getUserComplaints = async (req: any, res: any) => {
  try {
    console.log(req.user?.userId )
    const complaints = await Complaint.find({ userId: req.user?.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: complaints });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

export const getImprovedDescription = async(req : Request , res : Response) => {
   try {
    const description = req.body.description;
    console.log(req.body);
    if (!description) return res.status(400).json(error("Bad Request"))
    
    const aidescription = await improveComplaintText(description);
    console.log("Ai response :",aidescription)
    if(aidescription.error) return res.status(204).json(error("No Ai description generated . Please try later or continue with current description"))
    res.status(200).json(success("Successfully generated AI description",aidescription));
   }
  catch(err) {
    console.log("Error : ",err)
    res.status(500).json(error(`Server Error : ",${err}`))
  }
}