import Groq from "groq-sdk";
import dotenv from "dotenv";
import { cleanAiResponse } from "../helpers/CleanAiResponse";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const aiEligibiltyParser = async (text: string) => {
  try {
    const prompt = `
You are an assistant for parsing eligibility criteria for government schemes in Kerala and India.
Convert the eligibility text into structured JSON.

Return ONLY a valid JSON object in exactly this format, with no explanation, no markdown, no backticks:

{
  "minAge": number | null,
  "maxAge": number | null,
  "incomeLimit": number | null,
  "occupation": string[],
  "caste": string[],
  "gender": string[],
  "religion": string[],
  "disability": boolean,
  "disabilityPercentage": number | null,
  "isBPL": boolean,
  "requiredQualifiers": string[],
  "confidence": number
}

Rules:
- Return ONLY the JSON object. No extra text, no markdown, no backticks.
- confidence should be a number between 0 and 1 reflecting extraction certainty.
- incomeLimit should always be the annual figure (convert monthly if needed).
- religion: only include if explicitly mentioned. Recognised values: Hindus, Muslims, Christians, Jains, Buddhists, Sikhs, Parsis. Return [] if not mentioned.
- requiredQualifiers: short keywords describing extra criteria not covered by other fields (e.g. "widow", "farmer", "differently-abled").
- If disability and disabilityPercentage are both mentioned, include both.
- Add any extra eligibility fields not listed above if they are clearly relevant.

Eligibility Text:
${text}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    const result = chatCompletion.choices[0]?.message?.content;
    if (!result) return { error: true };

    const parsed = cleanAiResponse(result);
    return parsed;
  } catch (error) {
    console.error("Error in aiEligibilityParser", error);
    return { error: true };
  }
};