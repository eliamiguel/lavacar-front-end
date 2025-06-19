import { useMutation } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import {toast} from 'react-toastify';

const useLogout = () => {
  const { logoutUser } = useContext(UserContext);
  const router = useRouter();

  const mutate = useMutation({
    mutationFn: async () => {
      // Tenta fazer logout no servidor, mas não bloqueia se falhar
      try {
        return await makeRequest.post('/auth/logout').then((res) => res.data);
      } catch (error) {
        console.log('Erro na requisição de logout (não crítico):', error);
        return { success: true };
      }
    },
    onSuccess: () => {
      // Sempre faz logout local
      performLocalLogout();
    },
    onError: (error) => {
      console.error('Erro no logout:', error);
      // Mesmo com erro, faz logout local
      performLocalLogout();
    },
  });

  // Função para fazer logout local
  const performLocalLogout = () => {
    // Limpa localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem("orcamento:user");
      localStorage.removeItem("orcamento:token");
      localStorage.removeItem("lavacar:user");
      localStorage.removeItem("lavacar:token");
    }
    
    // Chama a função de logout do contexto
    logoutUser();
    
    // Pequeno delay para garantir que o logout seja processado
    setTimeout(() => {
      // Redireciona para login
      router.push('/login');
      toast.success("Logout realizado com sucesso!");
    }, 100);
  };

  return mutate;
};

export default useLogout;





