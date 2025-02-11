import { useQuery} from "@tanstack/react-query";
import { makeRequest } from "../axios";

import { TransacaoInterface } from "../interface";

export const useTransacao= () => {
    const { data, isLoading, isError, error } = useQuery<TransacaoInterface[]>({
        queryKey: ['transacao'],
        queryFn: async () => await makeRequest.get('/transacao')
        .then((res)=>{
          return res.data || [];
        })
      });
    
      return { data, isLoading, isError, error };
  };