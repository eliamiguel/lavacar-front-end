"use client";
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import { AxiosError } from "axios";
import { makeRequest } from '../../../../axios';
import {toast} from 'react-toastify';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import InputAuth from '@/components/inputAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError ] = useState('');
  const [senhaHash, setSenhaHash] = useState('');
  const { setUser}= useContext(UserContext)
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await makeRequest.post("/auth/login", { email, senhaHash });
      if (typeof window !== "undefined") {
        localStorage.setItem("orcamento:user", JSON.stringify(res.data.usuario));
        localStorage.setItem("orcamento:token", res.data.token);
      }
      setUser(res.data.usuario);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Erro ao fazer login")
        setError(error.response?.data?.message || "Erro ao fazer login");
      } else {
        setError("Erro inesperado ao fazer login");
        toast.error("Erro inesperado ao fazer login")
      }
      console.log(error);
    }
  };

  return (
    <>
          <h2 className="text-3xl font-semibold text-center text-gray-700">Sistema Credenciados</h2>
            <div>
              <div>
                <InputAuth placeholder="Digite seu email" label={'E-mail'} newState={setEmail}/>
              </div>
              <div>
               <InputAuth  placeholder="Digite sua senha" label='Senha' newState={setSenhaHash}  Ispassword/>
              </div>
              {error && <span className="text-red-500 my-3">{error}</span>}
              <button
              onClick={(e)=>handleSubmit(e)}
                type="submit"
                className="w-full py-3 mt-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Entrar
              </button>

        </div>
          <p className="text-center text-sm font-bold text-gray-500">
            Já tem uma conta? 
            <Link href='/register' className="text-blue-600 hover:underline">
              Criar uma conta
            </Link>
          </p>
     
          </>
  );
};

export default LoginPage;

