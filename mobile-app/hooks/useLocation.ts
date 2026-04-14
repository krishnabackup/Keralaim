import { getLocation } from "@/services/gelLocationServices"
import { useQuery } from "@tanstack/react-query"

export const useLocation = (lat: number, lon: number , type : string) => {
    console.log("useLocation called with lat:", lat, "lon:", lon, "type:", type);
    return useQuery({
        
        queryKey : ["location",lat,lon,type],
        queryFn : () =>  getLocation(lat,lon,type),
        staleTime : 1000 * 60 * 5,
        retry : false
    })
}