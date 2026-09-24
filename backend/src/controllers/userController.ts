import { Request , Response} from "express";
import { Users } from "../models/Users";
import { error, success } from "../helpers/responseFormat";

export const updateProfile = async (req : any,res : any) => {
    try{
    const userId = req.user?.userId;
    const profileData = req.body;
    const user = await Users.findById(userId)
    const EF = user?.eligibilityFields
    console.log(EF)
    const updateProfile = await Users.findByIdAndUpdate(userId,{$set: {eligibilityFields : profileData}},{
    returnDocument: "after",
    runValidators: true
  });
    if(!updateProfile) return res.status(500).json({message : "Error updating profile" , success : false})
    res.status(200).json({
        message : "Profile updated successfully",
        success : true,
        data : updateProfile
    })
}
catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile update failed"
    });
  }
}
 
export const saveAnswers =
async (req : Request, res : Response) => {
  try{
  const user =
    await Users.findById(req.user?.userId);
  
  if(!user) return res.status(404).json(error("User not found"))
  const answers = req.body;

  Object.keys(answers).forEach(key => {

    if (user.eligibilityFields) {
          (user.eligibilityFields as Record<string, any>)[key] = answers[key];
  }

    if (
      !user.askedFields?.includes(key)
    ) {
      user.askedFields?.push(key);
    }
  });

  await user.save();

  res.json(success("Added askedFields successfully"));
}
catch(err){
  console.log("Error : ",err)
  res.status(500).json(error("Server Error"))
}
};