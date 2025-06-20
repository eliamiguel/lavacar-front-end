import { useQuery} from "@tanstack/react-query";
import { makeRequest } from "../axios";

import { TransacaoInterface } from "../interface";

export const useTransacao= () => {
    const { data, isLoading, isError, error, refetch } = useQuery<TransacaoInterface[]>({
        queryKey: ['transacao'],
        queryFn: async () => await makeRequest.get('/transacao')
        .then((res)=>{
          return res.data || [];
        })
      });
      
      return { data, isLoading, isError, error,refetch };
};
export const useTransacaoPorCliente = (idCliente:{idCliente:number}) => {
  return useQuery<TransacaoInterface[]>({
    queryKey: ["transacoes", idCliente],                        
    queryFn: async () => {
      const { data } = await makeRequest.get(`/transacoes/cliente/${idCliente.idCliente}`);
      return data || [];
    },
  });
};



