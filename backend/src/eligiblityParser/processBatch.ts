import { SchemeDocument, SchemeModel } from "../models/Schemas";
import { aiEligibiltyParser } from "./aiParserEligibility";

const BATCH_SIZE = 3;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const processBatch = async (schemes: SchemeDocument[]) => {
  for (let i = 0; i < schemes.length; i += BATCH_SIZE) {
    const batch = schemes.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (scheme) => {
        const eligibilityText = scheme.schemeDetails?.eligibility?.plainText;

        if (!eligibilityText) {
          console.warn(`No eligibility text for scheme: ${scheme.slug}`);
          return;
        }

        const parsedEligibility = await aiEligibiltyParser(eligibilityText);
        console.log(
          `Parsed eligibility for scheme: ${scheme.slug}`,
          parsedEligibility
        );

        if (!parsedEligibility.error) {
          await SchemeModel.updateOne(
            { _id: scheme._id },
            {
              $set: {
                "schemeDetails.eligibility.parsed": parsedEligibility,
                aiFailed: false,
              },
            }
          );
        } else {
          await SchemeModel.updateOne(
            { _id: scheme._id },
            {
              $set: {
                aiFailed: true,
              },
            }
          );
        }
      })
    );

    console.log(
      `Processed: ${Math.min(i + BATCH_SIZE, schemes.length)} / ${schemes.length}`
    );
    await delay(2000);
  }
};