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
import { FaWhatsapp } from 'react-icons/fa';

const RegisterPage = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senhaHash, setSenhaHash] = useState('');
  const [confirmSenhaHash, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

   
    if (user?.tipoUsuario !== 'super') {
     toast.error("Você não tem permissão para criar novos usuários.");
     return;
    }
    setLoading(true);
    if (!nome || !email || !senhaHash || !confirmSenhaHash) {
      toast.error("Preencha todos os campos!");
      return;
    }

    if (senhaHash.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senhaHash !== confirmSenhaHash) {
      toast.error("As senhas não coincidem.");
      return;
    }

    
    try {
      await makeRequest.post('/auth/register', { nome, email, senhaHash});

      toast.success("Usuário criado com sucesso!");
      setTimeout(() => router.push('/login'), 3000);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Erro ao registrar usuário");
      } else {
        toast.error("Erro inesperado ao registrar usuário");
      }
      console.error(error);
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
        
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-r from-gray-900 to-black p-8 text-white rounded-l-2xl">
          <h2 className="text-3xl font-bold">Crie uma Conta</h2>
          <p className="mt-2 text-sm text-center">Bem-vindo à BC Gestão de Serviços.</p>
          <div className="flex space-x-4 mt-4">
           <a href="https://api.whatsapp.com/send?phone=5541995310129&text=Ol%C3%A1!" className="text-white text-2xl hover:text-gray-300"><FaWhatsapp /></a>
          </div>
        </div>

        
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-semibold text-center text-white">Cadastro de Usuário</h2>

          
          {user?.tipoUsuario !== 'super' && (
            <p className="text-center text-red-500 font-bold my-2">
              Você não tem permissão para criar usuários.
            </p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <InputAuth placeholder="Digite seu nome" label="Nome" newState={setNome} />
            <InputAuth placeholder="Digite seu email" label="E-mail" newState={setEmail} />
            <InputAuth placeholder="Digite sua senha" label="Senha" newState={setSenhaHash} Ispassword />
            <InputAuth placeholder="Confirme sua senha" label="Confirmar Senha" newState={setConfirmarSenha} Ispassword />

            <button
              onClick={(e) => handleRegister(e)}
              className={`w-full py-3 mt-3 text-white rounded-lg transition-all ${
                user?.tipoUsuario !== "super"
                  ? "bg-gray-500 cursor-not-allowed"
                  : loading
                  ? "bg-black cursor-not-allowed"
                  : "bg-black hover:bg-gray-700"
              }`}
              disabled={user?.tipoUsuario !== "super" || loading}
            >
              {loading ? "Criando Conta..." : "Criar Conta"}
            </button>
          </motion.div>

          <p className="text-center text-sm font-bold text-white mt-4">
            Já tem uma conta? {" "}
            <Link href="/login" className="text-gray-500 hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
