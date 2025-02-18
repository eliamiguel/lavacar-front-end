'use client';

import React, { useContext, useState, useEffect } from 'react';
import { AxiosError } from "axios";
import { makeRequest } from '../../../../axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import InputAuth from '@/components/inputAuth';
import { motion } from 'framer-motion';
import { Building } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const LoginEstabelecimento = () => {
  const [email, setEmail] = useState('');
  const [senhaHash, setSenhaHash] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("orcamento:rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senhaHash) {
      toast.error("Preencha todos os campos!");
      setError("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    
    try {
      const res = await makeRequest.post("/lavacar/login", { email, senhaHash });

      if (typeof window !== "undefined") {
        localStorage.setItem("orcamento:user", JSON.stringify(res.data.lavacar));
        localStorage.setItem("orcamento:token", res.data.token);

        if (rememberMe) {
          localStorage.setItem("orcamento:rememberEmail", email);
        } else {
          localStorage.removeItem("orcamento:rememberEmail");
        }
      }

      setUser(res.data.lavacar);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Erro ao fazer login");
        setError(error.response?.data?.message || "Erro ao fazer login");
      } else {
        setError("Erro inesperado ao fazer login");
        toast.error("Erro inesperado ao fazer login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white-100 bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl flex"
      >
        {/* Seção de boas-vindas */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-r from-gray-900 to-black p-8 text-white rounded-l-2xl">
          <h2 className="text-3xl font-bold">Bem vindo !</h2>
          <p className="mt-2 text-sm text-center">A BC Gestão de Serviços.</p>
          <div className="flex space-x-4 mt-4">
            <a href="https://api.whatsapp.com/send?phone=5541995310129&text=Ol%C3%A1!" className="text-white text-2xl hover:text-gray-300">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Seção do formulário */}
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-semibold text-center text-white">
            Login do Credenciado
          </h2>

          <div className="flex justify-center mt-4">
            <button className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-all">
              <Building size={24} />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <div>
              <InputAuth placeholder="Digite seu email" label="E-mail" newState={setEmail} value={email} />
            </div>
            <div>
              <InputAuth placeholder="Digite sua senha" label="Senha" newState={setSenhaHash} Ispassword />
            </div>

            {/* Opções de login */}
            <div className="flex justify-between items-center text-sm text-white mt-3">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                /> 
                Lembrar-me
              </label>
              <a href="/forgot-password" className="hover:underline">Esqueceu a senha?</a>
            </div>

            {error && <span className="text-red-500 my-3 text-sm text-center block">{error}</span>}

            <button
              onClick={(e) => handleSubmit(e)}
              className={`w-full py-3 mt-3 text-white rounded-lg transition-all ${
                loading ? "bg-black cursor-not-allowed" : "bg-black hover:bg-gray-700"
              }`}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </motion.div>

          
        </div>
      </motion.div>
    </div>
  );
};

export default LoginEstabelecimento;
