"use client";

import { useState, useEffect, useContext } from "react";
import { useBuscarCartao, usePagarCartao } from "../../../hooks/useCartao";
import { CreditCard, Lock, CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { UserContext } from "@/context/UserContext";
import { XCircle } from "lucide-react";

function Dashboard() {
  const [cardNumber, setCardNumber] = useState<string>("");
  const [isLoadings, setIsLoadings] = useState(false);
  const [searchValue, setSearchValue] = useState<string>(""); 
  const [senha, setSenha] = useState("");
  const [placaPersonalizada, setPlacaPersonalizada] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isLavacar, user } = useContext(UserContext); 
  

  useEffect(() => {
    setSidebarOpen(true);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchValue(cardNumber.trim()); 
    }, 800);

    return () => clearTimeout(timeout); 
  }, [cardNumber]);

  const { data: cardData, isLoading } = useBuscarCartao(
    searchValue || "",
    user?.idLavacar ? Number(user.idLavacar) : 0
  );

  const erroMensagem = cardData && !cardData.sucesso ? cardData.mensagem : "";
  const exibirDadosCartao = cardData?.sucesso === true;
  const isCartaoCoringa = cardData?.tipoCartao === "CORINGA";

  const pagarCartao = usePagarCartao();

  const handlePayment = async () => {
    setIsLoadings(true);
    pagarCartao.mutate(
      { 
        numeroCartao: cardNumber, 
        senha, 
        idLavacarLogado: Number(user?.idLavacar),
        placaPersonalizada: isCartaoCoringa ? placaPersonalizada : undefined
      },
      {
        onSuccess: (data) => {
          setMensagem(data.mensagem || "Pagamento realizado com sucesso");
          setSenha("");
          setPlacaPersonalizada("");
          setIsLoadings(false);
          setTimeout(() => {
            setMensagem("");
          }, 10000);
        },
        onError: (error) => {
          setMensagem(error.response?.data.message || "Erro ao pagar cartão");
          setSenha("");
          setPlacaPersonalizada("");
          setIsLoadings(false);          
          // Limpar mensagem após 10 segundos
          setTimeout(() => {
            setMensagem("");
          }, 3000);
        },
      }
    );
  };

  return (
    <div className={`relative p-6 transition-all duration-300 mt-20 sm:${sidebarOpen ? "ml-40" : "ml-16"}`}>
      <h1 className="flex items-center whitespace-nowrap text-xl sm:text-2xl md:text-3xl mt-4 font-bold mb-6 relative z-10">
        <span className="text-black">Painel Credenciado</span>
        {isLavacar && (
           <span className="text-gray-800 ml-3">{user?.nome}</span>
        )}
      </h1>



  <div className="p-6 mb-6 bg-white shadow-md rounded-lg border border-gray-200 relative z-10">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Verificar Cartão</h2>
      <button className="bg-black text-white p-2 h-8 gap-2 rounded-md mb-2 flex items-center"
      onClick={()=>setCardNumber("")}
      >
        <XCircle size={15}/>
          Limpar
      </button>
    </div>
    
    <div className="relative">
      <CreditCard className="absolute left-3 top-3 text-gray-400" size={20} />
      <input
        type={showCardNumber ? "text" : "password"} 
        className="w-full pl-10 pr-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-black outline-none bg-white"
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
  <div
    className="absolute  inset-x-0 h-[50vh] bg-no-repeat border-spacing-x-64 opacity-20 pointer-events-none"
    style={{ backgroundImage: "url('/images/passar-cartao.jpg')", backgroundPosition: "center 70%", zIndex: "-10" }}
  ></div>

  {erroMensagem && <p className="text-red-500 font-bold text-lg relative z-10">{erroMensagem}</p>}

  {isLoading && (
    <div className="flex justify-center items-center relative z-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bg-black"></div>
    </div>
  )}
  
  {exibirDadosCartao && (
    <div className="p-6 mb-6 bg-white shadow-md rounded-lg border border-gray-200 relative z-10">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Dados do Cartão</h2>
      <p className="text-gray-700"><strong>Cliente:</strong> {cardData.clienteNome}</p>
      <p className="text-gray-700"><strong>Carro:</strong> {cardData.carroModelo}</p>
      <p className="text-gray-700"><strong>Placa:</strong> {cardData.carroPlaca}</p>
      <p className="text-gray-700"><strong>Lotaçao:</strong> {cardData.carroLotacao}</p>
      <p className="text-gray-700"><strong>Lavagem:</strong> {cardData.quantidadeServicosMensais ?? "0.00"}</p>
      <p className="text-gray-700"><strong>Tipo:</strong> {cardData.tipoCartao}</p>

      {isCartaoCoringa && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Placa do Veículo *
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-black outline-none bg-white"
            placeholder="Digite a placa do veículo..."
            value={placaPersonalizada}
            onChange={(e) => setPlacaPersonalizada(e.target.value.toUpperCase())}
            maxLength={8}
          />
          <p className="text-sm text-gray-500 mt-1">
            Para cartões CORINGA, é necessário informar a placa do veículo
          </p>
        </div>
      )}

      <div className="relative mt-4">
        <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type={showPassword ? "text" : "password"}
          className="w-full pl-10 pr-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bg-black outline-none bg-white"
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
        className="mt-4 w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
        onClick={handlePayment}
        disabled={isLoadings === true || (isCartaoCoringa && !placaPersonalizada.trim())}
      >
        {isLoadings ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
        {isLoadings ? "Processando..." : "Pagar"}
      </button>
    </div>
  )}

  {mensagem && <p className="mt-3 font-bold text-lg text-green-500 relative z-10">{mensagem}</p>}

 
</div>

  );
}

export default Dashboard;
