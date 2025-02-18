'use client';
import React, { useState, useEffect } from 'react';
import { makeRequest } from '../../../../axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import InputAuth from '@/components/inputAuth';
import { motion } from 'framer-motion';

const ResetPasswordPage = () => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null | undefined>(undefined); 
  const router = useRouter();

  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');

      setToken(tokenFromUrl || null);
    }
  }, []);

  
  if (token === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-semibold text-center text-gray-900">Redefinir Senha</h2>
          <p className="text-sm text-gray-600 text-center mt-2">Carregando informações...</p>
        </motion.div>
      </div>
    );
  }

 
  if (token === null) {
    toast.error("Token inválido! Solicite uma nova recuperação.");
    router.push('/forgot-password');
    return null;
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!novaSenha || novaSenha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await makeRequest.post('/auth/reset-password', { token, novaSenha });

      toast.success("Senha redefinida com sucesso! Faça login.");
      setTimeout(() => router.push('/login'), 3000);
    } catch (error) {
      toast.error("Erro ao redefinir a senha.");
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
        className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-900">Redefinir Senha</h2>
        <p className="text-sm text-gray-600 text-center mt-2">Escolha sua nova senha.</p>

        <form onSubmit={handleResetPassword} className="mt-6">
          <InputAuth placeholder="Nova senha" label="Nova Senha" newState={setNovaSenha} Ispassword />
          <InputAuth placeholder="Confirme a senha" label="Confirmar Senha" newState={setConfirmarSenha} Ispassword />

          <button
            type="submit"
            className={`w-full py-3 mt-4 text-white rounded-lg transition-all ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-500"
            }`}
            disabled={loading}
          >
            {loading ? "Alterando..." : "Redefinir Senha"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
