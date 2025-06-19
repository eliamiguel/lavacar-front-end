'use client';
import Link from 'next/link';
import React, { useContext, useState, useEffect } from 'react';
import { AxiosError } from "axios";
import { makeRequest } from '../../../../axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import InputAuth from '@/components/inputAuth';
import { motion } from 'framer-motion';
import { Building, User } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senhaHash, setSenhaHash] = useState('');
  const [error, setError] = useState('');
  const [isEstabelecimento, setIsEstabelecimento] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { loginUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("lavacar:rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Função para extrair token dos cookies
  const extractTokenFromCookies = (cookieName: string): string | null => {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${cookieName}=`)
    );
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senhaHash) {
      toast.error("Preencha todos os campos!");
      setError("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const endpoint = isEstabelecimento ? "/lavacar/login" : "/auth/login";
      const res = await makeRequest.post(endpoint, { email, senhaHash });

      // Extrai o token da resposta ou dos cookies
      let token = res.data.tokens?.accessToken || res.data.token;
      
      if (!token || token === 'undefined') {
        // Tenta extrair dos cookies se não vier na resposta
        token = extractTokenFromCookies('accessToken');
      }

      // Armazena tokens no localStorage apenas se existirem
      if (res.data.tokens?.accessToken) {
        localStorage.setItem("lavacar:tokenEstabelecimento", res.data.tokens.accessToken);
      }
      if (res.data.tokens?.refreshToken) {
        localStorage.setItem("lavacar:refreshTokenEstabelecimento", res.data.tokens.refreshToken);
      }

      // Prepara os dados do usuário
      const userData = res.data.usuario || res.data.lavacar;
      
      if (!userData) {
        throw new Error('Dados do usuário não recebidos');
      }

      // Usa a função loginUser do contexto para armazenar os dados corretamente
      loginUser(userData, token, res.data);

      // Gerencia o "lembrar-me"
      if (typeof window !== "undefined") {
        if (rememberMe) {
          localStorage.setItem("lavacar:rememberEmail", email);
        } else {
          localStorage.removeItem("lavacar:rememberEmail");
        }
      }

      toast.success("Login realizado com sucesso!");
      
      // Redireciona imediatamente sem delay
      router.push("/dashboard");

    } catch (error) {
      console.error('Erro no login:', error);
      
      let errorMessage = "Erro inesperado ao fazer login";
      
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || "Erro ao fazer login";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Função para alternar tipo de login e limpar erros
  const toggleLoginType = () => {
    setIsEstabelecimento(!isEstabelecimento);
    setError('');
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
          <h2 className="text-3xl font-bold">Bem vindo !</h2>
          <p className="mt-2 text-sm text-center">A BC Gestão de Serviços.</p>
          <div className="flex space-x-4 mt-4">
           <a 
             href="https://api.whatsapp.com/send?phone=5541995310129&text=Ol%C3%A1!" 
             className="text-white text-2xl hover:text-gray-300 transition-colors"
             target="_blank"
             rel="noopener noreferrer"
           >
             <FaWhatsapp />
           </a>
          </div>
        </div>

        
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-semibold text-center text-white">
            {isEstabelecimento ? "Login do Credenciado" : "Login do Usuário"}
          </h2>

          <div className="flex justify-center mt-4">
            <button
              onClick={toggleLoginType}
              className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-all"
              disabled={loading}
            >
              {isEstabelecimento ? <Building size={24} /> : <User size={24} />}
            </button>
          </div>

          <motion.form
            key={isEstabelecimento ? "estabelecimento" : "usuario"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
            onSubmit={handleSubmit}
          >
            <div>
              <InputAuth 
                placeholder="Digite seu email" 
                label="E-mail" 
                newState={setEmail} 
                value={email}
               
              />
            </div>
            <div>
              <InputAuth 
                placeholder="Digite sua senha" 
                label="Senha" 
                newState={setSenhaHash} 
                Ispassword
               
              />
            </div>

            <div className="flex justify-between items-center text-sm text-white mt-3">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                /> 
                Lembrar-me
              </label>
              <Link href="/forgot-password" className="hover:underline">
                Esqueceu a senha?
              </Link>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 my-3 text-sm text-center block bg-red-100 p-2 rounded"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className={`w-full py-3 mt-3 text-white rounded-lg transition-all ${
                loading ? "bg-gray-600 cursor-not-allowed" : "bg-black hover:bg-gray-700"
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </button>
          </motion.form>

          <p className="text-center text-sm font-bold text-white mt-4">
            Não tem uma conta? {" "}
            <Link href="/register" className="text-gray-500 hover:underline">
              Criar uma conta
            </Link>
          </p>

        
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;