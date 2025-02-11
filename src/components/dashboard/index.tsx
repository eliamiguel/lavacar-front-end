"use client";

import { useState, useEffect } from "react";
import { useBuscarCartao, usePagarCartao } from "../../../hooks/useCartao";
import { Loader2, CreditCard, Lock, CheckCircle, Eye, EyeOff, Menu } from "lucide-react";

function Dashboard() {
  const [cardNumber, setCardNumber] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>(""); 
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setSidebarOpen(true);
  }, []);

  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchValue(cardNumber.trim()); 
    }, 800);

    return () => clearTimeout(timeout); 
  }, [cardNumber]);

  
  const { data: cardData, isError, error, isLoading } = useBuscarCartao(searchValue || "");

  const pagarCartao = usePagarCartao();

  const handlePayment = async () => {
    pagarCartao.mutate(
      { numeroCartao: cardNumber, senha },
      {
        onSuccess: (data) => {
          setMensagem(data.mensagem);
        },
      }
    );
  };

  return (
    <div className={`p-6 transition-all duration-300 sm:${sidebarOpen ? "ml-40" : "ml-16"}`}>
      
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        <Menu size={18} />
        {sidebarOpen ? "Recolher Sidebar" : "Expandir Sidebar"}
      </button>

      
      <h1 className="text-2xl mt-4 font-bold text-gray-800 mb-6">Painel do Estabelecimento</h1>

      
      <div className="p-6 mb-6 bg-white shadow-md rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Verificar Cartão</h2>
        <div className="relative">
          <CreditCard className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type={showCardNumber ? "text" : "password"} 
            className="w-full pl-10 pr-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Passe o cartão aqui..."
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            onClick={() => setShowCardNumber((prev) => !prev)}
          >
            {showCardNumber ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      
      {isError && <p className="text-red-500 font-bold text-lg">{"Cartão não encontrado."}</p>}

     
      {isLoading && (
        
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
      
      )}

      
      {cardData && (
        <div className="p-6 mb-6 bg-white shadow-md rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Dados do Cartão</h2>
          <p className="text-gray-700"><strong>Cliente:</strong> {cardData.clienteNome}</p>
          <p className="text-gray-700"><strong>Carro:</strong> {cardData.carroModelo} - {cardData.carroPlaca}</p>
          <p className="text-gray-700"><strong>Saldo:</strong> R$ {cardData.saldo?.toFixed(2) ?? "0.00"}</p>

          
          <div className="relative mt-4">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-10 pr-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Digite a senha do cartão"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          
          <button
            className="mt-4 w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 transition"
            onClick={handlePayment}
          >
            <CheckCircle size={18} />
            Enter
          </button>

          
          {mensagem && <p className="mt-3  font-bold text-lg text-green-500">{mensagem}</p>}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
