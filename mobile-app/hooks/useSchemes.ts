import { getAllSchemes , getSingleScheme,getRecommendedSchemes} from "@/services/schemes"
import { useQuery } from "@tanstack/react-query"

export const useSchemes = (page : number) => {
    return useQuery({
        queryKey : ["schemes",page],
        queryFn : () => getAllSchemes(page)
    })
}

export const useScheme = (slug: string) => {
  return useQuery({
    queryKey: ["scheme", slug],
    queryFn: () => getSingleScheme(slug),
    enabled: !!slug 
  })
}

export const useMySchemes = (page:number) => {
  return useQuery({
    queryKey : ['myschemes',page],
    queryFn : () => getRecommendedSchemes(page)
  })
}