import { Types } from "mongoose";
import { Scheme, SchemeModel } from "../models/Schemas"
import { Users } from "../models/Users";
import { EligibityField } from "../types/scheme.types";


const computeScore = (eligibityField: EligibityField, scheme: Scheme, age: number | null): number => {

    let score = 0;
    const p = eligibityField

    const annualIncome = parseInt(p.income || "0");
    const disability = p.disability === "yes" ? true : false;
    const parsed = scheme.schemeDetails?.eligibility?.parsed
    // Hard matching 
    if (parsed?.incomeLimit && annualIncome > parsed.incomeLimit) return 0;
    if (parsed?.disability && disability === false && parsed?.disability === true) return 0;
    if (parsed?.minAge && age !== null && age < parsed.minAge) return 0;
    if (parsed?.maxAge && age !== null && age > parsed.maxAge) return 0;
     if (parsed?.gender && p.gender) {
        const genderList = parsed.gender
            .filter((g: any) => g != null)          
            .map((g: string) => g.toLowerCase());
        if (!genderList.includes(p.gender.toLowerCase())) score += 25;
    }

    // Soft Matching
    if (parsed?.caste && p.category) {
        const casteList = parsed.caste
            .filter((c: any) => c != null)          
            .map((c: string) => c.toLowerCase());
        if (casteList.includes(p.category.toLowerCase())) score += 25;
    }

    if (parsed?.occupation && p.occupation) {
        const occupationList = parsed.occupation
            .filter((o: any) => o != null)         
            .map((o: string) => o.toLowerCase());
        if (occupationList.includes(p.occupation.toLowerCase())) score += 35;
    }

    if (parsed?.incomeLimit) {
        const ratio = 1 - (annualIncome / parsed.incomeLimit);
        score += Math.round(ratio * 10);
    }
    console.log(`${scheme.slug} : ${score}` )
    return Math.min(100, score);
}


export const getRecomendedSchemes = async (userId: string) => {
    const user = await Users.findById({_id : userId});
    if (!user) return { message: "User not found", success: false }
    const eligibilityFields = user.eligibilityFields;
    if(!eligibilityFields) return {message : "Create a profile first" , success : false}
    const schemes = await SchemeModel.find().lean();
    if (!schemes.length) return { message: "Error fetching", success: false }

    const recommendedSchemes = schemes.map(
        s => ({ scheme: s, score: computeScore(eligibilityFields as EligibityField, s, user.age) }))
        .filter(r => r.score > 25)
        .sort((a, b) => b.score - a.score)
        const total = recommendedSchemes.length;
    await Users.findByIdAndUpdate(userId, {
        eligibilityCached: recommendedSchemes.map(recom => ({
            schemeId: recom.scheme._id,
            score: recom.score,
            computedAt: new Date(),
        }))
    })
    return {total,recommendedSchemes}
}