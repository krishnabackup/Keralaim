import { getAllSchemes } from "@/services/schemes"
import { useQuery } from "@tanstack/react-query"

export const useSchemes = (page : number) => {
    return useQuery({
        queryKey : ["schemes",page],
        queryFn : () => getAllSchemes(page)
    })
}