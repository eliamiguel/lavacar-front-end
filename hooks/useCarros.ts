import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { CarroInterface } from "../interface";



export const useCarros = () => {
    const { data, isLoading, isError, error } = useQuery<CarroInterface[]>({
        queryKey: ['carros'],
        queryFn: async () => await makeRequest.get('/carros')
        .then((res)=>{
          return res.data || [];
        })
      });
    
      return { data, isLoading, isError, error };
  };
  

  export const useCriarCarro = ()=>{
    const queryClient = useQueryClient();
    
    const mutate = useMutation({
        mutationFn: async (data: { 
          idCliente:number,
            modelo: string;
            placa: string;
            ano: number;
            cor: string;
         }) => {
            return await makeRequest.post(`/carro/criar-Carro`, data).then((res)=>{
                return res.data;
              } 
            )},
        onSuccess: () => {
         toast.success("Carro criado com sucesso.")
         queryClient.invalidateQueries({ queryKey: ['dashboard'] });
          queryClient.invalidateQueries({ queryKey: ['carros'] }); 
        },
        onError: (error: AxiosError<{ mensagem: string }>) => {
          const errorMessage = error.response?.data?.mensagem || "Erro ao criar carro.";
          console.log("Erro ao criar carro:", errorMessage);
          toast.error(errorMessage);
        }
          })
      return mutate
  }
 
  
  export const useEditarCarro  = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (data: {  
        idCarro: number;
        modelo: string;
        placa: string;
        ano: number;
        cor: string;
      }) => {
        return await makeRequest.put(`/carros/edit/`, data)
          .then((res) => res.data);
      },
      onSuccess: () => {
        toast.success("Carro atualizado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ["carros"] });
      },
      onError: (error: AxiosError<{ mensagem: string }>) => {
        const errorMessage = error.response?.data?.mensagem || "Erro ao editar carro.";
        console.log("Erro ao editar carro:", errorMessage);
        toast.error(errorMessage);
      }
    });
};

  

  export const  useExcluirCarro  = () => {
    const queryClient = useQueryClient();
    const mutate = useMutation({
      mutationFn: async (idCarro: { idCarro: number }) =>
        await makeRequest
          .delete(`/carro/delete?idCarro=${idCarro.idCarro}`)
          .then((res) => {
            return res.data;
          }),
      onSuccess: () => {
        toast.success("Excluido o carro com sucesso!")
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['carros'] });
      },onError: (error: AxiosError<{ mensagem: string }>)=>{
        const errorMessage = error.response?.data?.mensagem || "Erro ao excluir carro.";
        console.log("Erro ao excluir carro:", errorMessage);
        toast.error(errorMessage);
      }
    });
    return mutate
  }