import { getMissingFields } from "../getMissingFields"
import { generatAiQuestion } from "./generateAiQuestion";

export const getSmartQuestion = async (user : any , scheme : any) => {
  const missing = getMissingFields(user,scheme);

  const filtered = missing.filter(field => !user.askedFields.includes(field));

  if(filtered.length == 0) return [];

  try {
    const result = await generatAiQuestion(filtered);
    
  }
  catch(error){
    console.log("Error : ",error)
      }
}