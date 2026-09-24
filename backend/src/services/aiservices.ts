

import { openai } from "../config/openai";
import Groq from "groq-sdk";
import dotenv from "dotenv"
dotenv.config();

const qroq = new Groq({
    apiKey : process.env.GROQ_API_KEY 
});

export const generateReply = async (message: string) => {
  try {
    const response = await qroq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are an AI assistant for Kerala government services app (KeralaIM).

Your job:
- Suggest government schemes
- Explain application steps
- Give clear, structured answers
- Keep answers short and useful
- Prefer bullet points or steps

If user asks about:
- schemes → suggest relevant schemes
- complaint → explain how to file
- jobs → suggest government job sources
- general → give helpful info

Always be simple and helpful.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });
  console.log("AI Response:", response);
    return response.choices[0]?.message.content;
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, something went wrong.";
  }
};