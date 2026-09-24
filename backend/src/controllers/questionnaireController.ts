import { Request , Response} from "express";
import { commanQuestionaireAiService } from "../services/questionnaireAIServices";
import { generatAiQuestion } from "../services/questions/generateAiQuestion";
import { getMissingFields } from "../services/getMissingFields";
import { SchemeModel } from "../models/Schemas";
import { success } from "../helpers/responseFormat";

export const generateCommonQuestions = async (req : Request, res: Response) => {
     const questions = await commanQuestionaireAiService();
     if(!questions) return res.status(500).json({message : "Error generating questions" , success : false})

     res.status(200).json({
        message : "Successfull",
        success : true,
        data : questions
     })
}

export const generateSmartQuestions = async(req : Request,res : Response) => {
  try {
     const user = req.user?.userId;
     const slug = req.params.slug;
     if (!slug)  return res.status(400).json({ message: "Invalid scheme slug", success: false });
     const scheme = await SchemeModel.findOne({ slug }).lean();
     const fields = getMissingFields(user, scheme);
     const questions = await generatAiQuestion(fields);
     if (questions?.error) {
       return res.status(500).json({ message: "AI question generation failed", success: false, error: questions.error });
     }
     return res.status(200).json(success(questions, "Successfully generated ai question"));
  }
  catch(error) {
   console.log("Error : ",error);
   return res.status(500).json({ message: "Internal server error", success: false });
  }
}