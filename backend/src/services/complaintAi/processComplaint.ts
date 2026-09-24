import { analyzeComplaintImage } from "./analyzeComplaintImage";
import { getDepartment } from "./getDepartment";

export const processComplaint =
async (
  imageUrl: string,
  description: string
) => {

  // IMAGE ANALYSIS
  const aiResult =
    await analyzeComplaintImage(imageUrl);

  // FALLBACK
  if (aiResult.error) {
    return {
      category: "General",
      urgency: "medium",
      department: "General"
    };
  }

  // ROUTING
  const department =
    getDepartment(aiResult.category);

  return {

    aiGeneratedDescription:
      aiResult.description,

    category:
      aiResult.category,

    urgency:
      aiResult.urgency,
    department
  };
};