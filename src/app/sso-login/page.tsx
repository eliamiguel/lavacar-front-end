'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import { toast } from 'react-toastify';

const SSOLoginPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser } = useContext(UserContext);

  useEffect(() => {
    const processSSO = async () => {
      try {
        // Pega os parâmetros da URL
        const ssoToken = searchParams.get('sso_token');
        const email = searchParams.get('email');

        if (!ssoToken || !email) {
          setError('Parâmetros de SSO inválidos');
          setLoading(false);
          return;
        }

        console.log('Processando SSO login com:', { email, ssoToken: ssoToken.substring(0, 20) + '...' });

        // Faz a requisição para o endpoint de SSO usando fetch puro para evitar interceptors
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sso-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // NÃO incluir Authorization header para SSO
          },
          credentials: 'include',
          body: JSON.stringify({
            ssoToken,
            email
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const responseData = await response.json();

        // Processa a resposta igual ao login normal
        const { usuario, tokens } = responseData;
        
        if (!usuario || !tokens?.accessToken) {
          throw new Error('Dados de autenticação incompletos');
        }

        // Usa a função loginUser do contexto
        loginUser(usuario, tokens.accessToken, responseData);

        toast.success('Login automático realizado com sucesso!');
        
        // Redireciona para o dashboard
        router.push('/dashboard');

      } catch (error) {
        console.error('Erro no SSO:', error);
        
        let errorMessage = 'Erro no login automático';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
        
        // Em caso de erro, redireciona para login normal após 3 segundos
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    processSSO();
  }, [searchParams, loginUser, router]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Processando login automático...</h2>
          <p className="text-gray-500">Aguarde, você será redirecionado em instantes.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Erro no Login Automático</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-500 mb-4">Você será redirecionado para a página de login...</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default SSOLoginPage; 