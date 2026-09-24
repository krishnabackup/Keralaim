export const getMissingFields = (
    user : any,
    scheme : any
) => {
  const missingFields : string[] = [];

  const dynamicCriteria =
    scheme.schemeDetails.eligibility.parsed || {};

    Object.entries(dynamicCriteria).forEach(([key]) => {
         const exits = user.eligibilityFields?.[key]
         if(!exits) {
            missingFields.push(key)
         }
    })
    return missingFields;
}