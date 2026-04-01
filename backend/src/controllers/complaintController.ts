// controllers/complaintController.ts
import cloudinary from "../config/cloudinary";
import Complaint from "../models/Compliant";

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
      userId: req.user?.id, // from auth middleware
      location: req.body.location,
      description: req.body.description.trim(),
      imageUrl,
    });

    res.json({
      success: true,
      data: complaint,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating complaint" });
  }
};