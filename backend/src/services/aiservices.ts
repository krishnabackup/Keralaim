// src/services/ai.service.ts

import { openai } from "../config/openai";

export const generateReply = async (message: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct-v0.1",
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