import Groq from "groq-sdk";
import dotenv from "dotenv"
import { parseComplaintAI } from "../../helpers/CleanAiResponse";

const groq = new Groq({
    apiKey : process.env.GROQ_API_KEY
})

export const improveComplaintText =
async (text: string) => {
try{
  const systemPrompt = `
Improve this complaint professionally.

Complaint:
${text}

Return only improved complaint.
Return only text 

Note:
-Should not be email and letter type
-Just improve the sentance and paragraph 
-Don't change the context completly 
-Fix grammar , spelling etc

`;

const aiResponse = await groq.chat.completions.create({
    messages : [
     {
        role : "system",
        content : systemPrompt
     }
    ],
    model : "llama-3.1-8b-instant"
});

const result = aiResponse.choices[0]?.message.content;
console.log("Raw :",result);
if(!result) return { error : true}
return result;
}
catch(error){
    console.log("Error : ",error)
    return {error : true}
}
};