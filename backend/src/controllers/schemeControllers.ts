
import { SchemeModel } from "../models/Schemas";
import { ApiResponse } from "../types/auth.types";
import { SchemaCardDetails } from "../types/cardTitle,types";
import { Request, Response } from "express"
import { PaginatedResponse } from "../types/paginated";

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

export const getRecomenderSchemes = () => {
    
}