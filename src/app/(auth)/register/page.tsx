'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { makeRequest } from '../../../../axios';
import InputAuth from '@/components/inputAuth';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const RegisterPage = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [senhaHash, setSenhaHash] = useState('');
  const [confirmSenhaHash, setConfirmSenhaHash] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (senhaHash !== confirmSenhaHash) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      const res = await makeRequest.post('/auth/register', { nome, email, senhaHash, confirmSenhaHash });
      setSuccess(res?.data?.message || 'Conta criada com sucesso');
      setNome('');
      setEmail('');
      setSenhaHash('');
      setConfirmSenhaHash('');
      toast.success('Conta criada com sucesso');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'Ocorreu um erro inesperado');
        toast.error(error.response?.data?.message || 'Ocorreu um erro inesperado');
      } else {
        setError('Ocorreu um erro inesperado');
        toast.error('Ocorreu um erro inesperado');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-transparent p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl flex"
      >
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-r from-purple-900 to-red-600 p-6 text-white rounded-l-2xl">
          <h2 className="text-2xl font-bold">Junte-se a nós!</h2>
          <p className="mt-2 text-sm text-center">Crie a sua conta e faça o login.</p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-white text-xl hover:text-gray-300"><FaFacebook /></a>
            <a href="#" className="text-white text-xl hover:text-gray-300"><FaInstagram /></a>
            <a href="#" className="text-white text-xl hover:text-gray-300"><FaTwitter /></a>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-center text-white">Crie sua conta</h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-4"
          >
            <InputAuth placeholder="Digite seu nome" label="Nome" newState={setNome} />
            <InputAuth placeholder="Digite seu e-mail" label="E-mail" newState={setEmail} />
            <InputAuth placeholder="Digite sua senha" label="Senha" newState={setSenhaHash} Ispassword />
            <InputAuth placeholder="Confirme sua senha" label="Confirme senha" newState={setConfirmSenhaHash} Ispassword />
            {success && <span className="text-green-500 my-2 text-sm text-center block">{success}</span>}
            {error && <span className="text-red-500 my-2 text-sm text-center block">{error}</span>}
            <button
              onClick={(e) => handleSubmit(e)}
              className="w-full py-2 mt-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              Criar Conta
            </button>
          </motion.div>

          <p className="text-center text-sm font-bold text-white mt-4">
            Já tem uma conta? {" "}
            <Link href="/login" className="text-red-600 hover:underline">
              Fazer Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
