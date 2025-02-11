import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { ClienteIrteface} from "../interface";
import {toast} from 'react-toastify';
import { AxiosError } from "axios";

export const useCleintes = () => {
    const { data, isLoading, isError, error } = useQuery<ClienteIrteface[]>({
      queryKey: ['cliente'],
      queryFn: async () => await makeRequest.get('/clientes')
      .then((res)=>{
        return res.data || [];
      })
    });
  
    return { data, isLoading, isError, error };
  };

  export const useCriarCliente = ()=>{
    const queryClient = useQueryClient();
    
    const mutate = useMutation({
        mutationFn: async (data: { 
          nome: string;
          idUsuario:number
          email: string;
          telefone: string;
          endereco: string;
          cpf: string;
          dataNascimento: string;
         }) => {
            return await makeRequest.post(`/clientes/criar-cliente`, data).then((res)=>{
                return res.data;
              } 
            )},
        onSuccess: (data) => {
         toast.success(data.message ||"Cliente criado com sucesso.")
          queryClient.invalidateQueries({ queryKey: ['cliente'] }); 
        },
        onError: (error: AxiosError<{ message: string }>) => {
          const errorMessage = error.response?.data?.message || 'Erro ao criar cliente. Tente novamente.';
          console.log('Erro ao criar cliente', errorMessage);
          toast.error(errorMessage);
        }
          })
      return mutate
  }

  export const useExcluirCliente = () => {
    const queryClient = useQueryClient();
    const mutate = useMutation({
      mutationFn: async (idCliente: { idCliente: number }) =>
        await makeRequest
          .delete(`/cliente/delete?idCliente=${idCliente.idCliente}`)
          .then((res) => {
            return res.data;
          }),
      onSuccess: (data) => {
        toast.success(data.message || "Excluido cliente com sucesso!")
        queryClient.invalidateQueries({ queryKey: ['cliente'] });
      },onError: (error: AxiosError<{ message: string }>)=>{
        const errorMessage = error.response?.data?.message || 'erro ao excluir cliente.';
        console.log('erro ao excluir cliente', errorMessage);
        toast.error(errorMessage);
      }
    });
    return mutate
  }


export const useEditarCliente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {  
      idCliente: number;
      nome: string;
      email: string;
      telefone: string;
      endereco: string;
      cpf: string;
      dataNascimento: string;
    }) => {
      return await makeRequest.put(`/clientes/edit/`, data)
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      toast.success(data.message ||'Cliente atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['cliente'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Erro ao editar cliente. Tente novamente.', error); 
      toast.error(error.message || 'Erro ao editar cliente');
    }
  });
};
