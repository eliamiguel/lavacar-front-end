import { useQuery, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { toast } from "react-toastify";

interface RelatorioParams {
  dataInicio: string;
  dataFim: string;
  formato: 'pdf' | 'csv' | 'xlsx';
  clienteIds?: number[];
  lavacarIds?: number[];
}

export const useRelatorio = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['relatorio'],
    queryFn: async () => await makeRequest.post('/relatorio/gerar', {
      dataInicio: new Date().toISOString(),
      dataFim: new Date().toISOString(),
      clienteIds: [],
      lavacarIds: [],
      formato: 'pdf'
    })
    .then((res) => {
      return res.data || [];
    })
  });

  return { data, isLoading, isError, error, refetch };
};

export const useGerarRelatorio = () => {
  return useMutation({
    mutationFn: async (params: RelatorioParams) => {
    
      const response = await makeRequest.post('/relatorio/gerar', params, {
        responseType: 'blob'
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Criar blob e fazer download
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_lavagens_${Date.now()}.${variables.formato}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Relatório gerado e baixado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório. Verifique os dados e tente novamente.');
    }
  });
};

export const useClientesDisponiveis = () => {
  return useQuery({
    queryKey: ['clientes-relatorio'],
    queryFn: async () => {
      const response = await makeRequest.get('/relatorio/clientes');
      return response.data.clientes || [];
    }
  });
};

export const useLavacarsDisponiveis = () => {
  return useQuery({
    queryKey: ['lavacars-relatorio'],
    queryFn: async () => {
      const response = await makeRequest.get('/relatorio/lavacars');
      return response.data.lavacars || [];
    }
  });
};