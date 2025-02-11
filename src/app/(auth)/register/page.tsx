"use client";

import React, { useState } from 'react';

import Link from 'next/link';
import { makeRequest } from '../../../../axios';
import InputAuth from '@/components/inputAuth';
import { AxiosError } from 'axios';
import {toast} from 'react-toastify';
const RegisterPage = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [suscess, setSuscess] = useState('');
  const [senhaHash, setSenhaHash] = useState('');
  const [confirmSenhaHash, setConfirmSenhaHash] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuscess('');

    if (senhaHash !== confirmSenhaHash) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      const res = await makeRequest.post('/auth/register', { nome, email, senhaHash, confirmSenhaHash });
      
      setSuscess(res?.data?.message || 'Conta criada com sucesso');
      setNome('');
      setEmail('');
      setSenhaHash('');
      setConfirmSenhaHash('');
      toast.success('Conta criada com sucesso');
      return true;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            setError(error.response?.data?.message || 'Ocorreu um erro inesperado');
            toast.error(error.response?.data?.message || 'Ocorreu um erro inesperado')
          } else {
            setError('Ocorreu um erro inesperado');
            toast.error('Ocorreu um erro inesperado')
            console.error('Erro na requisição:', error);
            return null;
          }
         
    }
  };

  return (
    <>
      <h2 className="text-3xl font-semibold text-center text-gray-700">Crie sua conta</h2>
      <div>
        <div>
          <InputAuth placeholder="Digite seu nome" label="Nome" newState={setNome} />
        </div>
        <div>
          <InputAuth placeholder="Digite seu e-mail" label="E-mail" newState={setEmail} />
        </div>
        <div>
          <InputAuth placeholder="Digite sua senha" label="Senha" newState={setSenhaHash} Ispassword />
        </div>
        <div>
          <InputAuth placeholder="Confirme sua senha" label="Confirme senha" newState={setConfirmSenhaHash} Ispassword />
        </div>

        {suscess && <span className="text-green-500 font-bold my-3">{suscess}</span>}
        {error && <span className="text-red-500 font-bold my-3">{error}</span>}
        <button
          type="button"
          onClick={(e) => handleSubmit(e)}
          className="w-full py-3 mt-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Criar Conta
        </button>
      </div>
      <p className="text-center text-sm font-bold text-gray-500">
        Já tem uma conta?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Fazer Login
        </Link>
      </p>
    </>
  );
};

export default RegisterPage;
