import { useMutation } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import {toast} from 'react-toastify';
const useLogout = () => {
  const { setUser,logoutUser } = useContext(UserContext);
  const router = useRouter();

  const mutate = useMutation({
    mutationFn: async () => await makeRequest.post('/auth/logout').then((res) => res.data),
    onSuccess: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("orcamento:user");
        localStorage.removeItem("orcamento:token");
      }
      
      setUser(undefined);
      router.push('/login');
      logoutUser()
      
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Error ao sair")
    },
  });

  return mutate;
};

export default useLogout;





