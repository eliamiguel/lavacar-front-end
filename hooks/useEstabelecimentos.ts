import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { EstabelecimentoInterface, LavacarInterface } from "../interface";




export const useEstabelecimentos = () => {
    const { data, isLoading, isError, error,refetch } = useQuery<EstabelecimentoInterface[]>({
      queryKey: ['estabelecimento'],
        queryFn: async () => await makeRequest.get('/estabelecimento')
        .then((res)=>{
          return res.data || [];
        })
      });
    
      return { data, isLoading, isError, error,refetch };
};


  export const useCriarEstabelecimento = ()=>{
    const queryClient = useQueryClient();
    
    const mutate = useMutation({
        mutationFn: async (data: { 
          idLavacar: number;
            nome: string;
            endereco: string;
            telefone: string;
            email: string;
            cnpj: string;
            senhaHash:string;
            razaoSocial?:string;
            cidade?:string;
            atividadePrincipal?:string;
         }) => {
            return await makeRequest.post(`/estabelecimento/criar`, data).then((res)=>{
                return res.data;
              } 
            )},
        onSuccess: (data) => {
         toast.success(data.message||"Cartão criado com sucesso.")
          queryClient.invalidateQueries({ queryKey: ['estabelecimento'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard'] }); 
        },
        onError: (error: AxiosError<{ message: string }>) => {
          const errorMessage = error.response?.data?.message || 'Erro ao criar cartão. Tente novamente.';
          console.log('Erro ao criar cartão', errorMessage);
          toast.error(errorMessage);
        }
          })
      return mutate
  }
 
  
  export const useEditarEstabelecimento  = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (data: {  
        idLavacar: number;
        nome: string;
        endereco: string;
        telefone: string;
        email: string;
        cnpj: string;
        razaoSocial?:string;
        cidade?:string;
        atividadePrincipal?:string;
      }) => {
        return await makeRequest.put(`/estabelecimento/edit/`, data)
          .then((res) => res.data);
      },
      onSuccess: (data) => {
        toast.success(data.message || 'Cliente atualizado com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['estabelecimento'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
       
      },
      onError: (error: AxiosError<{ message: string }>) => {
        const errorMessage = error.response?.data?.message || 'Erro ao editar credenciado. Tente novamente.';
          console.log('Erro ao editar credenciado', errorMessage);
          toast.error(errorMessage);
      }
    });
  };

  

  export const  useExcluirEstabelecimento  = () => {
    const queryClient = useQueryClient();
    const mutate = useMutation({
      mutationFn: async (idLavacar: { idLavacar: number }) =>
        await makeRequest
          .delete(`/estabelecimento/excluir?idLavacar=${idLavacar.idLavacar}`, )
          .then((res) => {
            return res.data;
          }),
      onSuccess: (data) => {
        toast.success(data.message || "Excluido o credenciado com sucesso!")
        queryClient.invalidateQueries({ queryKey: ['estabelecimento'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        
      },onError: (error: AxiosError<{ message: string }>)=>{
        const errorMessage = error.response?.data?.message || 'erro ao excluir o carro.';
          toast.error(errorMessage);
      }
    });
    return mutate
  }

  export const useLavacar = (idLavacar: number) => {
    console.log('useLavacar chamado com idLavacar:', idLavacar);
    
    const { data, isLoading, isError, error,refetch } = useQuery<LavacarInterface>({
      queryKey: ["seuEstabelecimento", idLavacar],
      queryFn: async () => {
        console.log('Executando queryFn para idLavacar:', idLavacar);
        
        // Validação adicional para garantir que idLavacar é válido
        if (!idLavacar || idLavacar <= 0 || isNaN(idLavacar)) {
          console.error('ID do estabelecimento inválido:', idLavacar);
          throw new Error("ID do estabelecimento inválido");
        }
        
        const url = `/seuestabelecimento?idLavacar=${idLavacar}`;
        console.log('Fazendo requisição para:', url);
        
        try {
          const response = await makeRequest.get(url);
          console.log('Resposta recebida:', response.data);
          return response.data;
        } catch (error) {
          console.error('Erro na requisição:', error);
          throw error;
        }
      },
      enabled: !!idLavacar && idLavacar > 0 && !isNaN(idLavacar), 
    });

    console.log('Estado do hook:', { isLoading, isError, hasData: !!data });

    return { data, isLoading, isError, error,refetch };
  };

  export const useVincularEstabelecimentoCliente = () => {
    const queryClient = useQueryClient();
  
    const mutate = useMutation({
      mutationFn: async (data: { idCliente: number; idLavacar: number }) => {
        return await makeRequest
          .post(`/estabelecimento/vincular-estabelecimento`, data)
          .then((res) => res.data);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["clientesVinculados"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["lavacars"] });
        queryClient.invalidateQueries({ queryKey: ["estabelecimento"] });
        
          toast.success(data.mensagem || "credenciado vinculado ao cliente com sucesso!");
      },
      onError: (error: AxiosError<{ message: string }>) => {
        const errorMessage = error.response?.data?.message || "Erro ao vincular o cliente ao credenciado.";
        
        toast.error(`Erro: ${errorMessage}`);
      },
    });
  
    return mutate;
  };

  export const useDesvincularEstabelecimentoCliente = () => {
    const queryClient = useQueryClient();
  
    const mutate = useMutation({
      mutationFn: async (data: { idCliente: number; idLavacar: number }) => {
        return await makeRequest
          .post(`/estabelecimento/desvincular-estabelecimento`, data)
          .then((res) => res.data);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["clientesVinculados"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["lavacars"] });
        queryClient.invalidateQueries({ queryKey: ["estabelecimento"] });
        
        toast.success(data.mensagem || "Credenciado desvinculado do cliente com sucesso!");
      },
      onError: (error: AxiosError<{ message: string }>) => {
        const errorMessage = error.response?.data?.message || "Erro ao desvincular o cliente do credenciado.";
        
        toast.error(`Erro: ${errorMessage}`);
      },
    });
  
    return mutate;
  };
  
  