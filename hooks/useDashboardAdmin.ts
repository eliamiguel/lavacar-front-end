import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { DashboardData } from "../interface";

export const useDashboardTotaladmin = () => {
  const { data, isLoading, isError, error } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await makeRequest.get("/dashboard");
      return res.data as DashboardData; // Garante que o retorno é um objeto único
    },
  });

  return { data, isLoading, isError, error };
};
