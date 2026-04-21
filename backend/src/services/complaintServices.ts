export const classifyComplaint = (text: string) => {
  if (text.includes("road")) return "Infrastructure";
  if (text.includes("water")) return "Water";
  return "General";
};