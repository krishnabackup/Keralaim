export interface SchemeTypes {
  slug: string;

    // Card Details 
    title: string;
    beneficiaryState: string;
    schemeShortTitle: string;
    level: string,
    schemeFor: string,
    schemeCategory: string[],
    schemeName: string,
    schemeCloseDate: Date | null,
    priority: number,
    briefDescription: string,
    tags: string[],

    //Individual Card Details 
     
    details : string,
    benefits : string,
    eligibility : string,
    exclusions : string,
    applicationProcess : string,
    documentsRequired : string
}

export interface EligibityField  {
    category: string | null;
    region: string | null;
    gender: string | null;
    occupation: string | null;
    income: string | null;
    disability: string | null;
    religion: string | null;
}


