import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { DashboardData } from "../interface";

interface DashboardFilters {
  clienteIds?: number[];
  lavacarIds?: number[];
  dataInicio?: string;
  dataFim?: string;
}

export const useDashboardTotaladmin = (filtros?: DashboardFilters) => {
  const { data, isLoading, isError, error, refetch } = useQuery<DashboardData>({
    queryKey: ["dashboard", filtros],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filtros?.clienteIds && filtros.clienteIds.length > 0) {
        filtros.clienteIds.forEach(id => params.append('clienteIds', id.toString()));
      }
      
      if (filtros?.lavacarIds && filtros.lavacarIds.length > 0) {
        filtros.lavacarIds.forEach(id => params.append('lavacarIds', id.toString()));
      }
      
      if (filtros?.dataInicio) {
        params.append('dataInicio', filtros.dataInicio);
      }
      
      if (filtros?.dataFim) {
        params.append('dataFim', filtros.dataFim);
      }
      
      const url = params.toString() ? `/dashboard?${params.toString()}` : '/dashboard';
      const res = await makeRequest.get(url);
      return res.data as DashboardData; 
    },
  });

  return { data, isLoading, isError, error, refetch };
};
