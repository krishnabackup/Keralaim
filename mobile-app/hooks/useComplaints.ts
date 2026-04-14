import { getAllUserComplaints } from "@/services/complaintServices"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export const useComplaints = () => {
    const queryClient = useQueryClient();
     useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    }, [])
  );
    return useQuery({
        queryKey : ["complaints"],
        queryFn : () => getAllUserComplaints(),
        staleTime : 1000 * 60 * 5,
        retry : 1
    })
}