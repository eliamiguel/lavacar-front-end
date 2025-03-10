import { useMutation } from "@tanstack/react-query";
import { makeRequest } from "../axios"; 
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { CredenciadoPerfilPayload, UsuarioPerfilPayload } from "../interface";


export const useUploadImagemPerfil = () => {
  const { user, setUser } = useContext(UserContext);

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await makeRequest.post("/upload", formData);
      return response.data;
    },
    onSuccess: async (data) => {
      if (user) {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://lavacar.gestaobc.net.br/api";
        const imageUrl = `${backendUrl}/upload/${data.imageUrl}`;

        
        let payload: UsuarioPerfilPayload | CredenciadoPerfilPayload;
        let endpoint = "";

        
        if (user.tipoUsuario === "credenciado") {
          endpoint = "/credenciado/perfil/editar";
          payload = {
            idLavacar: user.idLavacar!,  
            nome: user?.nome,
            email: user?.email,
            telefone: user?.telefone,    
            endereco: user?.endereco,    
            cnpj: user.cnpj! ,            
            urlImagemPerfil: imageUrl,
          };
        } else {
          endpoint = "/usuarios/perfil/editar";
          payload = {
            idUsuario: user.idUsuario!, 
            nome: user?.nome,
            email: user?.email,
            urlImagemPerfil: imageUrl,
          };
        }

        try {
          const updateResponse = await makeRequest.put(endpoint, payload);
          if (updateResponse.data.sucesso) {
            
            setUser({ ...user, urlImagemPerfil: imageUrl });
            sessionStorage.setItem("perfil:user", JSON.stringify({ ...user, urlImagemPerfil: imageUrl }));
            toast.success("Imagem de perfil atualizada com sucesso!");
          } else {
            toast.error(updateResponse.data.mensagem || "Erro ao atualizar imagem de perfil.");
          }
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.mensagem || "Erro ao atualizar imagem de perfil.";
            toast.error(errorMessage);
          } else {
            toast.error("Erro desconhecido ao atualizar imagem de perfil.");
          }
        }
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message || "Erro ao atualizar imagem.";
      toast.error(errorMessage);
    },
  });
};
