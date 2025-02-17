import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { toast } from "react-toastify";
import  { AxiosError } from "axios";

import { CartaoInterface } from "../interface";

export interface CartaoInterfacei {
  clienteNome: string;
  carroModelo: string;
  carroPlaca: string;
  saldo: number;
}

export const useBuscarCartao = (numeroCartao: string, idLavacarLogado: number) => {
  const { data, isLoading, isError, error } = useQuery<CartaoInterface, Error>({
    queryKey: ["cartao", numeroCartao, idLavacarLogado],
    queryFn: async () => {
      if (!numeroCartao || numeroCartao.trim() === "" || numeroCartao === "0" || !idLavacarLogado) {
        return { sucesso: false, mensagem: "Número do cartão inválido." }; // Retorno seguro
      }

      const res = await makeRequest.get(`/cartao/verificar?numeroCartao=${numeroCartao}&idLavacarLogado=${idLavacarLogado}`);

      return res.data;
    },
    enabled: !!numeroCartao.trim() && !!idLavacarLogado, 
  });

  return { data, isLoading, isError, error };
};




export const usePagarCartao = () => {
  const queryClient = useQueryClient();
    const mutate = useMutation({
    mutationFn: async (data: { numeroCartao: string; senha: string, idLavacarLogado:number }) => {
      const res = await makeRequest.post("/cartao/pagar", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.sucesso) {
        toast.success(data.mensagem || "Pagamento realizado com sucesso!");
      } else {
        toast.error(data.mensagem || "Houve um problema no pagamento.");
      }
      queryClient.invalidateQueries({ queryKey: ['transacao'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['cartao'] });
      queryClient.invalidateQueries({ queryKey: ['seuEstabelecimento'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message || "Erro ao processar pagamento.";
      console.log("Erro ao processar pagamento:", errorMessage);
      toast.error(errorMessage);
    },
  });

  return mutate
};


export const useCartoes = () => {
    const { data, isLoading, isError, error } = useQuery<CartaoInterface[]>({
        queryKey: ['cartaos'],
        queryFn: async () => await makeRequest.get('/cartao')
        .then((res)=>{
          return res.data || [];
        })
      });
    
      return { data, isLoading, isError, error };
  };
  

  export const useCriarCartao = ()=>{
    const queryClient = useQueryClient();
    
    const mutate = useMutation({
        mutationFn: async (data: { 
            idCliente: number,
            idCarro:  number,
            idLavacar:number,
            senha: string,
            numeroCartao: string,
            saldo: number,
            tipoCartao:string
         }) => {
            return await makeRequest.post(`/cartao/criar-cartao`, data).then((res)=>{
                return res.data;
              } 
            )},
            onSuccess: (data) => {
              
              if (data.sucesso) {
                toast.success(data.mensagem || "Cartão criado com sucesso!");
              } else {
                toast.error(data.mensagem || "Erro ao criar cartão");
              }
              queryClient.invalidateQueries({ queryKey: ['cartaos'] }); 
              queryClient.invalidateQueries({ queryKey: ['dashboard'] });
              queryClient.invalidateQueries({ queryKey: ['seuEstabelecimento'] });
            },
        onError: (error: AxiosError<{ message: string }>) => {
          const errorMessage = error.response?.data?.message || 'Erro ao criar cartão. Tente novamente.';
          toast.error(errorMessage);  
        }
          })
      return mutate
  }
 
  export const useVincularCartao = () => {
    const queryClient = useQueryClient();
  
    const mutate = useMutation({
      mutationFn: async (data:{ idCartao:number, idLavacar:number, idCliente:number }) => {
        console.log("Enviando dados para API:", data); 
        return await makeRequest.post(`/cartao/vincular-cartao`, data)
          .then((res) => {
            console.log("Resposta da API ao vincular cartão:", res.data);
            return res.data;
          });
      },
      onSuccess: (data) => {
        console.log("Sucesso na vinculação:", data);
        queryClient.invalidateQueries({ queryKey: ["lavacarsPermitidos"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["seuEstabelecimento"] });
    
          toast.success(data.mensagem || "Cartão vinculado com sucesso!");
       
      },
      onError: (error: AxiosError<{ message: string }>) => {
        const errorMessage = error.response?.data?.message || "Erro ao vincular o cartão.";
        console.log("Erro ao vincular cartão:", errorMessage);
        toast.error(errorMessage);
      }
    });
    
  
    return mutate
  };
  export const useEditarCartao = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (data: {  
        idCartao: number,
        idCliente: number,
        idCarro: number,
        numeroCartao: string,
        saldo: number,
        tipoCartao:string
      }) => {
        return await makeRequest.put(`/cartoes/edit/`, data)
          .then((res) => res.data);
      },
      onSuccess: (data) => {
        if (data.sucesso) {
          toast.success(data.mensagem || "Cartão atualizado com sucesso!");
        } else {
          toast.error(data.mensagem || "Erro ao editar cartão.");
        }
        queryClient.invalidateQueries({ queryKey: ['cartaos'] }); 
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['seuEstabelecimento'] });
      },
      onError: (error: AxiosError<{ message: string }>) => {
        const errorMessage = error.response?.data?.message || 'Erro ao editar cliente. Tente novamente.';
        console.log('Erro ao editar cliente', errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  

  export const useExcluirCartao  = () => {
    const queryClient = useQueryClient();
    const mutate = useMutation({
      mutationFn: async (idCartao: { idCartao: number }) =>
        await makeRequest
          .delete(`/cartoes/delete?idCartao=${idCartao.idCartao}`)
          .then((res) => {
            return res.data;
          }),
      onSuccess: (data) => {
        if (data.sucesso) {
          toast.success(data.mensagem || "Cartão Excluido com sucesso!");
        } else {
          toast.error(data.mensagem || "Houve um problema ao excluir cartão.");
        }
        queryClient.invalidateQueries({ queryKey: ['cartaos'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      },onError: (error: AxiosError<{ message: string }>)=>{
        const errorMessage = error.response?.data?.message || 'Erro ao excluir cartão';
        console.log('erro ao excluir cartão', errorMessage);
        toast.error(errorMessage); 
      }
    });
    return mutate
  }