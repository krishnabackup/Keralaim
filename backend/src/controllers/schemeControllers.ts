
import { SchemeModel } from "../models/Schemas";
import { SchemaCardDetails, SchemaDetails } from "../types/cardTitle,types";
import { Request, Response } from "express"
import { PaginatedResponse } from "../types/paginated";;
import { getRecomendedSchemes } from "../services/schemeRecomendation";

export const getAllSchemes = async (req: Request, res: Response<PaginatedResponse<SchemaCardDetails[]>>) => {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const schemes = await SchemeModel.find().skip(skip).limit(10).lean();
    if (!schemes) return res.status(400).json({ message: "Error fetching", success: false })

    const total = await SchemeModel.countDocuments();

    const formatted: SchemaCardDetails[] = schemes.map((scheme: any) => ({
        slug: scheme.slug,
        title: scheme.cardData?.title ?? "",
        beneficiaryState: scheme.cardData?.beneficiaryState ?? "",
        schemeShortTitle: scheme.cardData?.schemeShortTitle ?? "",
        level: scheme.cardData?.level ?? "",
        schemeFor: scheme.cardData?.schemeFor ?? "",
        schemeCategory: scheme.cardData?.schemeCategory ?? "",
        schemeName: scheme.cardData?.schemeName ?? "",
        schemeCloseDate: scheme.cardData?.schemeCloseDate ?? "",
        priority: scheme.cardData?.priority ?? 0,
        briefDescription: scheme.cardData?.briefDescription ?? "",
        tags: scheme.cardData?.tags ?? [],
    }));

    res.status(200).
        json({
            message: "Fetch Succesfull",
            success: true,
            data: formatted,
            total : total,
            page : page,
            totalPages : Math.ceil(total/limit)
        });
}

export const getSingleScheme = async(req : Request , res : Response) => {
    const {slug} = req.params
    if(!slug) return res.status(400).json({message : "Slug is required" , success : false})
    
    const scheme = await SchemeModel.findOne({slug : slug})
    
    if(!scheme) return res.status(404).json({message : "Not found Scheme" , success : false})

 const mapScheme = (scheme: any): SchemaDetails => ({
  slug: scheme.slug,
  beneficiaryState: scheme.beneficiaryState || "",
  schemeFor: scheme.schemeFor || "",
  title : scheme.cardData.schemeName || "",
  schemeCategory: scheme.schemeCategory || [],
  schemeDetails: scheme.schemeDetails || {}
})

const fillteredScheme = mapScheme(scheme)

    res.status(200).json({
        message : "Successfull",
        success : true,
        data : fillteredScheme
    })
}

export const getRecomenderSchemes = async(req:any , res : any) => {
    
    const userId = req.user?.userId;
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit
    const {recommendedSchemes,total} = await getRecomendedSchemes(userId);
    const paginatedRecommendedSchemes = recommendedSchemes ? recommendedSchemes.slice(skip, skip + limit) : []
    res.status(200).json({
        message : "Successfull",
        success : true,
        data : paginatedRecommendedSchemes,
        total : total,
        page : page,
        totalPages :total ?  Math.ceil(total/limit) : 0
    })
    

}