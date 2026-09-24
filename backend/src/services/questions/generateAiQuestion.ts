import Groq from "groq-sdk";
import dotenv from "dotenv"
import { cleanAiResponse, parseAiQuestion } from "../../helpers/CleanAiResponse";
import { fallbackQuestions } from "../../helpers/fallbackQuestion";

dotenv.config();

const qroq = new Groq({
    apiKey : process.env.GROQ_API_KEY 
});


export const generatAiQuestion = async (filtered : string[]) => {
    try{
        const systemPrompt = `
        Generate a eligibity based question for following field
        
        Fields:
        ${filtered.join('')}

        Rule:
        -Should don't ask any sensitive question directly 
        -The questions should be user friendly
        -If the question is select type give the approprite values in value property
        -if question is yes or no , the type will be yes/no
        -The question should be directed to the user , it should include you or your in the question to make it more engaging and personalized. For example, instead of asking "Is the applicant above 18 years old?", ask "Are you above 18 years old?".
        -Only Return valid array of questions, do not include any explanations or additional text. If you are not sure about a question, do not include it in the response. Focus on generating questions that are clear, concise, and directly related to determining eligibility for government schemes.
        -Type should string , number , yes/no , select 
        Result Format:
        [
        {
        "field" : "",
        "question" : "",
        "type" : "string"
        }
        ]
        `

        const aiResponse = await qroq.chat.completions.create({
            messages : [
                {role : 'system' , content : systemPrompt}
            ],
            model : "llama-3.1-8b-instant"
        });

        const result = aiResponse.choices[0]?.message?.content;

        if(!result) return { error : true}
        const cleanAI = parseAiQuestion(result);
        return cleanAI;
    }
    catch(error){
        console.log("Error :" ,error)
        return {error : true}
    }
}

