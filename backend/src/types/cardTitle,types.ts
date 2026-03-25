export interface SchemaCardDetails {
    slug : string;
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

