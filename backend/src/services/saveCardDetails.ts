import { SchemeModel } from "../models/Schemas";
import { SchemaCardDetails } from "../types/cardTitle,types";

export const saveCardDetails = async (data: SchemaCardDetails) => {
  const slug = data.slug;

  try {
    await SchemeModel.updateOne(
      { slug },
      {
        $set: {
          slug,
          url: `https://www.myscheme.gov.in/schemes/${slug}`,
          cardData: {
            title: data.title,
            beneficiaryState: data.beneficiaryState?.[0],
            schemeShortTitle: data.schemeShortTitle,
            level: data.level,
            schemeFor: data.schemeFor,
            schemeCategory: data.schemeCategory,
            schemeName: data.schemeName,
            schemeCloseDate: data.schemeCloseDate,
            priority: data.priority,
            briefDescription: data.briefDescription,
            tags: data.tags,
          },
          isScraped: false,
        },
      },
      { upsert: true }
    );

    console.log("Saved:", slug);
  } catch (error) {
    console.error("Error saving card details", error);
  }
};