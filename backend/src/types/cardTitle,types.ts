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

interface StructuredItem {
  type: string;
  items: any[];
  rows: any[];
  links: any[];
}

interface SchemeSection {
  structured: StructuredItem[];
  plainText: string;
}

interface SchemeIndivudualDetails {
  [key: string]: SchemeSection;
}

export interface SchemaDetails {
  slug: string;
  title: string;
  beneficiaryState: string;
  schemeFor: string;
  schemeCategory: string[];
  schemeDetails: SchemeIndivudualDetails;
}
