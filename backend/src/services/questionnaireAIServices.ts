import Groq from "groq-sdk";
import dotenv from "dotenv";
import { cleanAiResponse, fallbackQuestions } from "../helpers/CleanAiResponse";
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});


export const questionnaireAIServices = (user,schemes) => {

}




export const commanQuestionaireAiService = async () => {
  try {
    const SystemPrompt = `
    You are an assistant and great questionaier for generating basic , important eligibility criteria questions for government schemes in Kerala and India.
    
    Note: 
    Only generate questions that are relevant to eligibility criteria and can be answered with yes or no or a specific value. Do not generate questions that are not relevant to eligibility criteria.
    Only Return valid array of questions, do not include any explanations or additional text. If you are not sure about a question, do not include it in the response. Focus on generating questions that are clear, concise, and directly related to determining eligibility for government schemes.
    The question should be directed to the user , it should include you or your in the question to make it more engaging and personalized. For example, instead of asking "Is the applicant above 18 years old?", ask "Are you above 18 years old?".
    Should geneate as single array of questions without categorizing them into different sections.
    Should not include any other text in the response except the array of questions.
    Can also include number type questions
    if it is gender related question, it should include as values so it can be renderd in UI include all genders like transgender too.
    No need myfriend or dear user in the question, just use you or your to make it more engaging and personalized.
    Only generated 6 strong and relevant questions that can help in determining eligibility for government schemes. Do not generate more than 6 questions.
    Result Format :
    [
    {
    "field": string (the field in the eligibility criteria that this question is trying to determine, e.g., age, income, occupation, etc.)
     "question": string,
     "type": string (the type of answer expected, e.g., yes/no, number, string, etc.)
     "values": string[] (if the type is string and there are specific expected values, list them here, otherwise can be empty)
    }
    ]
    `
    const chatCompletion = await groq.chat.completions.create({
        messages : [
            {role : "system", content : SystemPrompt}
        ],
        model : "llama-3.1-8b-instant"
    })

    const result = chatCompletion.choices[0]?.message?.content;
    console.log("Raw AI Response for questionnaire service", result);
    if(!result) return { error : true}
    const cleanAI = cleanAiResponse(result);
    if(cleanAI.error) return fallbackQuestions();
    return cleanAI;
  } catch(error){
    console.error("Error in common questionnaire AI service", error);
    return { error : true}
  }
}
