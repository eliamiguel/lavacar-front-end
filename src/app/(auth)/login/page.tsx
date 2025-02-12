'use client';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import { AxiosError } from "axios";
import { makeRequest } from '../../../../axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import InputAuth from '@/components/inputAuth';
import { motion } from 'framer-motion';
import { Building, User } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [senhaHash, setSenhaHash] = useState('');
  const [isEstabelecimento, setIsEstabelecimento] = useState(false);
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isEstabelecimento ? "/lavacar/login" : "/auth/login";
      const res = await makeRequest.post(endpoint, { email, senhaHash });

      if (typeof window !== "undefined") {
        localStorage.setItem("orcamento:user", JSON.stringify(res.data.usuario || res.data.lavacar));
        localStorage.setItem("orcamento:token", res.data.token);
      }

      setUser(res.data.usuario || res.data.lavacar);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Erro ao fazer login");
        setError(error.response?.data?.message || "Erro ao fazer login");
      } else {
        setError("Erro inesperado ao fazer login");
        toast.error("Erro inesperado ao fazer login");
      }
      console.log(error);
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
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-r from-purple-900 to-red-600 p-8 text-white rounded-l-2xl">
          <h2 className="text-3xl font-bold">Bem vindo !</h2>
          <p className="mt-2 text-sm text-center">Ao Lavacar Sistem.</p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-white text-2xl hover:text-gray-300"><FaFacebook /></a>
            <a href="#" className="text-white text-2xl hover:text-gray-300"><FaInstagram /></a>
            <a href="#" className="text-white text-2xl hover:text-gray-300"><FaTwitter /></a>
          </div>
        </div>

        {/* Seção do formulário */}
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-semibold text-center text-white">
            {isEstabelecimento ? "Login do Estabelecimento" : "Login do Usuário"}
          </h2>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsEstabelecimento(!isEstabelecimento)}
              className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-all"
            >
              {isEstabelecimento ? <Building size={24} /> : <User size={24} />}
            </button>
          </div>

          <motion.div
            key={isEstabelecimento ? "estabelecimento" : "usuario"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <div>
              <InputAuth placeholder="Digite seu email" label="E-mail" newState={setEmail} />
            </div>
            <div>
              <InputAuth placeholder="Digite sua senha" label="Senha" newState={setSenhaHash} Ispassword />
            </div>
            <div className="flex justify-between items-center text-sm text-white mt-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Lembrar-me
              </label>
              <a href="#" className="hover:underline">Esqueceu a senha?</a>
            </div>
            {error && <span className="text-red-500 my-3 text-sm text-center block">{error}</span>}
            <button
              onClick={(e) => handleSubmit(e)}
              className="w-full py-3 mt-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              Entrar
            </button>
          </motion.div>

          <p className="text-center text-sm font-bold text-white mt-4">
            Não tem uma conta? {" "}
            <Link href="/register" className="text-red-600 hover:underline">
              Criar uma conta
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
