import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { EstabelecimentoInterface } from "../interface";




export const useEstabelecimentos = () => {
    const { data, isLoading, isError, error } = useQuery<EstabelecimentoInterface[]>({
        queryKey: ['estabelecimento'],
        queryFn: async () => await makeRequest.get('/estabelecimento')
        .then((res)=>{
          return res.data || [];
        })
      });
    
      return { data, isLoading, isError, error };
  };
  
  // Hook para criar um novo cartão


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
         }) => {
            return await makeRequest.post(`/estabelecimento/criar`, data).then((res)=>{
                return res.data;
              } 
            )},
        onSuccess: (data) => {
         toast.success(data.message||"Cartão criado com sucesso.")
          queryClient.invalidateQueries({ queryKey: ['estabelecimento'] }); 
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
      }) => {
        return await makeRequest.put(`/estabelecimento/edit/`, data)
          .then((res) => res.data);
      },
      onSuccess: (data) => {
        toast.success(data.message || 'Cliente atualizado com sucesso!');
        queryClient.invalidateQueries({ queryKey: ['estabelecimento'] }); 
      },
      onError: (error: AxiosError<{ message: string }>) => {
        const errorMessage = error.response?.data?.message || 'Erro ao editar Estabelecimentos. Tente novamente.';
          console.log('Erro ao editar Estabelecimentos', errorMessage);
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
        toast.success(data.message || "Excluido o Estabelecimentos com sucesso!")
        queryClient.invalidateQueries({ queryKey: ['estabelecimento'] });
      },onError: (error: AxiosError<{ message: string }>)=>{
        const errorMessage = error.response?.data?.message || 'erro ao excluir o carro.';
          console.log('erro ao excluir o carro', errorMessage);
          toast.error(errorMessage);
      }
    });
    return mutate
  }
