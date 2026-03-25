import { getSchemes } from "./fetchLinks";
import { saveCardDetails } from "./saveCardDetails";

export const seedSchemes = async () => {
  const schemes = await getSchemes();

  for (const scheme of schemes) {
    await saveCardDetails(scheme);
  }

  console.log("All card data saved");
};

