'use client';
import React, { useState } from 'react';
import { makeRequest } from '../../../../axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import InputAuth from '@/components/inputAuth';
import { motion } from 'framer-motion';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Digite um e-mail válido!");
      return;
    }

    setLoading(true);
    try {
       await makeRequest.post('/forgot-password', { email });

      toast.success("Verifique seu e-mail para redefinir a senha!");
      setTimeout(() => router.push('/login'), 3000);
    } catch (error) {
      toast.error("Erro ao enviar e-mail. Tente novamente!");
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
        <h2 className="text-3xl font-semibold text-center text-gray-900">Recuperar Senha</h2>
        <p className="text-sm text-gray-600 text-center mt-2">Digite seu e-mail para receber um link de redefinição.</p>

        <form onSubmit={handleForgotPassword} className="mt-6">
          <InputAuth placeholder="Digite seu email" label="E-mail" newState={setEmail} value={email} />
          
          <button
            type="submit"
            className={`w-full py-3 mt-4 text-white rounded-lg transition-all ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-600"
            }`}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Link"}
          </button>
        </form>

        <p className="text-center text-sm font-bold text-gray-700 mt-4">
          Lembrou a senha? {" "}
          <a href="/login" className="text-black hover:underline">
            Faça login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
