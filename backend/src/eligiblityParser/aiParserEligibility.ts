import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});



export const aiEligibiltyParser = async (text:string) => {
  try {
  const prompt = `
  You are an assistant for parsing eligibility criteria for government schemes in Kerala and India.
  Convert eligibility text into structured JSON.

Return format:
{
  "minAge": number | null,
  "maxAge": number | null,
  "incomeLimit": number | null,
  "occupation": string[],
  "caste": string[],
  "gender": string[],
  "disability": boolean,
  "disablityPercentage": number | null,
  "isBPL": boolean,
  "confidence": number (0 to 1)
}

Rules:
- Confidence should reflect how certain extraction is
- Return ONLY JSON, no explanations or additional text.
-Should be able to handle complex eligibility criteria and extract relevant information accurately.
-SHould also include criteria not mentioned in the  return format if they are relevant to eligibility. 
-If criteria have disabilty and disability percentage both mentioned, include both in the response.
-Should handle income limits mentioned in various formats (e.g., annual, monthly) and convert them to a standard format (e.g., annual income limit).
  Text : ${text}
  `
const chatCompletion = await groq.chat.completions.create({
  messages: [{ role: "user", content: prompt }],
  model: "llama-3.1-8b-instant",
});
const result = chatCompletion.choices[0]?.message?.content;
if(!result) return {error : true}
const parsed = JSON.parse(result);
return parsed;
}
catch(error){
  console.error("Error in aiEligibilityParser", error);
  return { error : true}
}
}