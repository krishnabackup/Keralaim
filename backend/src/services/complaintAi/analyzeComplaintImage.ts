import { parseComplaintAI } from "../../helpers/CleanAiResponse";

export const analyzeComplaintImage = async(imageUrl : string) => {

    const systemPrompt = `Analyze this complaint image.

Return ONLY valid JSON:

{
 "category":"",
 "description":"",
 "urgency":"low|medium|high"
}
`

const AiResponse = await fetch( "https://openrouter.ai/api/v1/chat/completions",
    {
        method : "POST",
        headers : {
            Autherization :
                `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
        },
        body : JSON.stringify({
            model : "google/gemini-2.0-flash",
            message : [
                {
                    role : "user",
                    coontent : [
                        {
                            type : "text",
                            text : systemPrompt
                        },
                        {
                            type : "image_url",
                            image_url : {
                            url : imageUrl
                            }
                        }
                    ]
                }
            ]
        })
    }
);

const data = await AiResponse.json();
const parsed = parseComplaintAI(data.choices[0].message.content )
return parsed

}