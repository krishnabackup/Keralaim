interface SchemeCardTypes {
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
}
    //Individual Card Details 
     
interface schemeDetails {   
    details : {
        structured : string[]
        plainText : string
    },
    benefits :  {
        structured : string[]
        plainText : string
    },
    eligibility :  {
        structured : string[]
        plainText : string
    },
    exclusions :  {
        structured : string[]
        plainText : string
    },
    applicationProcess :  {
        structured : string[]
        plainText : string
    },
    documentsRequired :  {
        structured : string[]
        plainText : string
    }
}