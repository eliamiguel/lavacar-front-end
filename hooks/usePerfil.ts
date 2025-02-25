import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { PerfilLavacar, PerfilUsuario } from "../interface";


export const useEditarPerfilUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PerfilUsuario) => {
      return await makeRequest.put(`/usuarios/perfil/editar`, data).then((res) => res.data);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Perfil atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["perfilUsuario", data.idUsuario] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar perfil");
    },
  });
};

export const useEditarPerfilcredenciado = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (data: PerfilLavacar) => {
        return await makeRequest.put(`/credenciado/perfil/editar`, data).then((res) => res.data);
      },
      onSuccess: (data) => {
        toast.success(data.message || "Perfil do Credenciado atualizado!");
        queryClient.invalidateQueries({ queryKey: ["perfilLavacar", data.idLavacar] });
      },
      onError: (error: AxiosError<{ message: string }>) => {
        toast.error(error.response?.data?.message || "Erro ao atualizar perfil do Credenciado");
      },
    });
  };

