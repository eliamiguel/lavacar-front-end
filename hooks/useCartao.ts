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
      
      if (!numeroCartao || numeroCartao.trim() === "" || numeroCartao === "0" || !idLavacarLogado || idLavacarLogado === 0) {
        return { sucesso: false, mensagem: "Número do cartão inválido." }; 
      }

      const res = await makeRequest.get(`/cartao/verificar?numeroCartao=${numeroCartao}&idLavacarLogado=${idLavacarLogado}`);

      return res.data;
    },
    enabled: !!numeroCartao.trim() && !!idLavacarLogado && idLavacarLogado > 0, 
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, error };
};


export const usePagarCartao = () => {
  const queryClient = useQueryClient();
    const mutate = useMutation({
    mutationFn: async (data: { numeroCartao: string; senha: string, idLavacarLogado:number, placaPersonalizada?: string }) => {
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
    const { data, isLoading, isError, error, refetch } = useQuery<CartaoInterface[]>({
        queryKey: ['cartaos'],
        queryFn: async () => await makeRequest.get('/cartao')
        .then((res)=>{
          return res.data || [];
        })
      });
    
      return { data, isLoading, isError, error, refetch };
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
            quantidadeServicosMensais: number,
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
        return await makeRequest.post(`/cartao/vincular-cartao`, data)
          .then((res) => {
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
        quantidadeServicosMensais: number,
        tipoCartao:string
      }) => {
        return await makeRequest.put(`/cartoes/edit`, data)
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
          console.log(data.mensagem);
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

// Funções para limites mensais
export const useDefinirLimiteMensal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ idCartao, mes, ano, limitePersonalizado }: {
      idCartao: number;
      mes: number;
      ano: number;
      limitePersonalizado: number;
    }) => {
      const response = await makeRequest.post('/cartao/limite-mensal', {
        idCartao,
        mes,
        ano,
        limitePersonalizado
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartoes'] });
      queryClient.invalidateQueries({ queryKey: ['limites-mensais'] });
    }
  });
};

export const useObterLimiteMensal = (idCartao: number, mes: number, ano: number) => {
  return useQuery({
    queryKey: ['limite-mensal', idCartao, mes, ano],
    queryFn: async () => {
      const response = await makeRequest.get(`/cartao/${idCartao}/limite-mensal/${mes}/${ano}`);
      return response.data;
    },
    enabled: false
  });
};

export const useListarLimitesMensais = (idCartao: number) => {
  return useQuery({
    queryKey: ['limites-mensais', idCartao],
    queryFn: async () => {
      const response = await makeRequest.get(`/cartao/${idCartao}/limites-mensais`);
      return response.data;
    },
    enabled: false
  });
};

// Funções para gerenciar saldo
export const useAdicionarSaldo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ idCartao, quantidadeAdicionar }: {
      idCartao: number;
      quantidadeAdicionar: number;
    }) => {
      const response = await makeRequest.post('/cartao/adicionar-saldo', {
        idCartao,
        quantidadeAdicionar
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.sucesso) {
        toast.success(data.mensagem || "Saldo adicionado com sucesso!");
      } else {
        toast.error(data.mensagem || "Erro ao adicionar saldo.");
      }
      queryClient.invalidateQueries({ queryKey: ['cartoes'] });
      queryClient.invalidateQueries({ queryKey: ['status-saldo'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message || 'Erro ao adicionar saldo. Tente novamente.';
      toast.error(errorMessage);
    }
  });
};

export const useObterStatusSaldo = (idCartao: number) => {
  return useQuery({
    queryKey: ['status-saldo', idCartao],
    queryFn: async () => {
      const response = await makeRequest.get(`/cartao/${idCartao}/status-saldo`);
      return response.data;
    },
    enabled: !!idCartao
  });
};

export const useTransacoesCartaoMes = (idCartao: number, mes: number, ano: number) => {
  return useQuery({
    queryKey: ['transacoes-cartao-mes', idCartao, mes, ano],
    queryFn: async () => {
      const response = await makeRequest.get(`/transacao/cartao/${idCartao}/mes/${mes}/${ano}`);
      return response.data;
    },
    enabled: !!idCartao && !!mes && !!ano
  });
};

export const useTentativasPagamento = () => {
  return useQuery({
    queryKey: ['tentativas-pagamento'],
    queryFn: async () => {
      const res = await makeRequest.get("/tentativas-pagamento");
      return res.data;
    },
  });
};

export const useTentativasPagamentoPorCliente = (idCliente: number) => {
  return useQuery({
    queryKey: ['tentativas-pagamento-cliente', idCliente],
    queryFn: async () => {
      const res = await makeRequest.get(`/tentativas-pagamento/cliente/${idCliente}`);
      return res.data;
    },
    enabled: !!idCliente,
  });
};