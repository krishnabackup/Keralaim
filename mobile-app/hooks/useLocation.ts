import { getLocation } from "@/services/gelLocationServices"
import { useQuery } from "@tanstack/react-query"

export const useLocation = (lat: number, lon: number) => {
    return useQuery({
        queryKey : ["location",lat,lon],
        queryFn : () =>  getLocation(lat,lon),
        staleTime : 1000 * 60 * 5,
        retry : false
    })
}