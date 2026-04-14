// models/Complaint.ts
import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  imageUrl: String,
  location: String,
  description : String,
  coordinates : {
    lat : Number,
    lng : Number
  },
  status: {
    type: [String],
    default: ["Submitted"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Complaint", complaintSchema);