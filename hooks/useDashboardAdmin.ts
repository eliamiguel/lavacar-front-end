import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { DashboardData } from "../interface";

export const useDashboardTotaladmin = () => {
  const { data, isLoading, isError, error,refetch } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await makeRequest.get("/dashboard");
      return res.data as DashboardData; 
    },
  });

  return { data, isLoading, isError, error,refetch };
};
