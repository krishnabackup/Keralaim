import { getCommonQuestions } from "@/services/questionsServices"
import { useQuery } from "@tanstack/react-query"

export const useQuestions = () => {
    return useQuery({
        queryKey : ["questions"],
        queryFn :  () =>  getCommonQuestions(),
        staleTime : Infinity,
        retry : false
    })
}



