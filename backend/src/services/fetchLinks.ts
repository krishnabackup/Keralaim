import fetch from "node-fetch";
import { SchemaCardDetails } from "../types/cardTitle,types";


type ApiResponse = {
  status: "Success" | "Failure";
  statusCode: number;
  errorDescription: string;
  error: string;
  data: {
    summary: {
      total: number;
      query: string;
      sortOptions: any[];
      appliedFilters: any[];
      disabledFilters: any[];
    };
    facets: any[];
    hits: {
      items: SchemaCardDetails[];
      page: {
        from: number;
        size: number;
        total: number;
      };
    };
    sortedBy: string;
  };
};
export const getSchemes = async (): Promise<SchemaCardDetails[]> => {
  let allItems: SchemaCardDetails[] = [];

  for (let from = 0; from < 1000; from += 100) {
    const url = `https://api.myscheme.gov.in/search/v6/schemes?lang=en&q=%5B%7B%22identifier%22%3A%22beneficiaryState%22%2C%22value%22%3A%22All%22%7D%2C%7B%22identifier%22%3A%22beneficiaryState%22%2C%22value%22%3A%22Kerala%22%7D%5D&keyword=&sort=multiple_sort&from=${from}&size=100`;

    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        origin: "https://www.myscheme.gov.in",
        referer: "https://www.myscheme.gov.in/",
        "user-agent": "Mozilla/5.0",
        "x-api-key": "tYTy5eEhlu9rFjyxuCr7ra7ACp4dv1RH8gWuHTDc",
      },
    });

    const data = (await res.json()) as ApiResponse;
    const items = data?.data?.hits?.items;

    if (!data || data.status !== "Success" || !Array.isArray(items)) {
      break;
    }

    // 🔥 NORMALIZE HERE
   const normalized = items.map((item: any) => {
  const f = item.fields || item;

  const get = (key: string) => {
    const val = f[key];
    if (Array.isArray(val)) return val[0];
    return val ?? null;
  };

  return {
    slug: get("slug"),
    title: get("title"),
    beneficiaryState: f["beneficiaryState"] || [],
    schemeShortTitle: get("schemeShortTitle"),
    level: get("level"),
    schemeFor: get("schemeFor"),
    schemeCategory: f["schemeCategory"] || [],
    schemeName: get("schemeName"),
    schemeCloseDate: get("schemeCloseDate"),
    priority: get("priority"),
    briefDescription: get("briefDescription"),
    tags: f["tags"] || [],
  };
});

    allItems.push(...normalized);
  }

  return allItems;
};
