"use client";

import { useContext, useState, useEffect } from "react";
import {
  useCartoes,
  useEditarCartao,
  useExcluirCartao,
  useDefinirLimiteMensal,
  useCriarCartao,
  useAdicionarSaldo,
} from "../../../hooks/useCartao";
import CartaoForm from "../cartaoForm";
import { CartaoInterface } from "../../../interface";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { UserContext } from "@/context/UserContext";
import TransacoesCartaoMes from "../transacoesCartaoMes";

const Cartoes = () => {
  const {user} = useContext(UserContext)
  const queryCartoes = useCartoes();
  const mutateEditar = useEditarCartao();
  const mutateCriar = useCriarCartao();
  const excluirCartao = useExcluirCartao();
  const definirLimiteMensal = useDefinirLimiteMensal();
  const adicionarSaldo = useAdicionarSaldo();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cartaoEditado, setCartaoEditado] = useState<
    CartaoInterface | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCartao, setSelectedCartao] = useState<CartaoInterface | null>(null);
  const [showLimiteModal, setShowLimiteModal] = useState(false);
  const [showSaldoModal, setShowSaldoModal] = useState(false);
  const [limitePersonalizado, setLimitePersonalizado] = useState(2);
  const [quantidadeAdicionar, setQuantidadeAdicionar] = useState(1);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [limitesMensais, setLimitesMensais] = useState<{[key: number]: number}>({});

  // Função para buscar limite mensal de um cartão
  const buscarLimiteMensal = async (idCartao: number) => {
    try {
      const mesAtual = new Date().getMonth() + 1;
      const anoAtual = new Date().getFullYear();
      
      const response = await fetch(`/api/cartao/${idCartao}/limite-mensal/${mesAtual}/${anoAtual}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('lavacar:token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.limite || 2;
      }
    } catch (error) {
      console.error('Erro ao buscar limite mensal:', error);
    }
    return 2; // Limite padrão
  };

  // Buscar limites mensais quando os cartões carregarem
  useEffect(() => {
    const cartoes = queryCartoes.data;
    if (cartoes && cartoes.length > 0) {
      const buscarTodosLimites = async () => {
        const limites: {[key: number]: number} = {};
        
        for (const cartao of cartoes) {
          if (cartao.idCartao) {
            limites[cartao.idCartao] = await buscarLimiteMensal(cartao.idCartao);
          }
        }
        
        setLimitesMensais(limites);
      };
      
      buscarTodosLimites();
    }
  }, [queryCartoes.data]);

  const filteredCartoes = queryCartoes.data?.filter(
    (cartao: CartaoInterface) => {
      return (
        cartao.numeroCartao
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        cartao.cliente?.nome
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        cartao.carro?.placa
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        cartao.tipoCartao
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
  );

  const handleEditarCartao = async (cartao: CartaoInterface) => {
    try {
      await mutateEditar.mutateAsync(cartao);
      toast.success("Cartão editado com sucesso!");
      setMostrarModal(false);
      setCartaoEditado(undefined);
      queryCartoes.refetch();
    } catch {
      toast.error("Erro ao editar cartão");
    }
  };

  const handleCriarCartao = async (cartao: CartaoInterface) => {
    try {
      await mutateCriar.mutateAsync({
        idCliente: cartao.idCliente,
        idCarro: cartao.idCarro,
        idLavacar: cartao.idLavacar,
        senha: cartao.senha,
        numeroCartao: cartao.numeroCartao,
        quantidadeServicosMensais: cartao.quantidadeServicosMensais,
        tipoCartao: cartao.tipoCartao
      });
      setMostrarModal(false);
      setCartaoEditado(undefined);
      queryCartoes.refetch();
    } catch {
      toast.error("Erro ao criar cartão");
    }
  };

  const handleExcluirCartao = async (idCartao: number) => {
    try {
      await excluirCartao.mutateAsync({ idCartao });
      toast.success("Cartão excluído com sucesso!");
      queryCartoes.refetch();
    } catch {
      toast.error("Erro ao excluir cartão");
    }
  };

  const handleRecarregar = () => {
    queryCartoes.refetch();
  };

  const handleDefinirLimite = async () => {
    if (!selectedCartao) return;
    
    try {
      await definirLimiteMensal.mutateAsync({
        idCartao: selectedCartao.idCartao,
        mes: mesSelecionado,
        ano: anoSelecionado,
        limitePersonalizado
      });

      toast.success("Limite mensal definido com sucesso!");
      setShowLimiteModal(false);
      queryCartoes.refetch();
    } catch {
      toast.error("Erro ao definir limite mensal");
    }
  };

  const handleAdicionarSaldo = async () => {
    if (!selectedCartao) return;
    
    try {
      await adicionarSaldo.mutateAsync({
        idCartao: selectedCartao.idCartao,
        quantidadeAdicionar
      });

      setShowSaldoModal(false);
      setQuantidadeAdicionar(1);
      queryCartoes.refetch();
    } catch {
      toast.error("Erro ao adicionar saldo");
    }
  };

  if (queryCartoes.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (queryCartoes.isError) {
    console.error("Erro ao carregar os dados:", queryCartoes.error);
    return <div className="text-red-500">Erro ao carregar os cartões.</div>;
  }

  return (
    <div className="p-6 space-y-6 md:ml-40 mt-20">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            setCartaoEditado(undefined);
            setMostrarModal(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-700"
        >
          <span className="mr-2">+</span> Novo Cartão
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Busca rápida pelo número do cartão, cliente, carro, tipo de cartão"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-full md:w-1/3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleRecarregar}
          className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center"
        >
          🔄 Recarregar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Número do Cartão</th>
              <th className="px-4 py-2 border">Saldo Disponível</th>
              <th className="px-4 py-2 border">Limite Mensal</th>
              <th className="px-4 py-2 border">Cliente</th>
              <th className="px-4 py-2 border">Carro</th>
              <th className="px-4 py-2 border">Placa</th>
              <th className="px-4 py-2 border">Tipo Cartão</th>
              <th className="px-4 py-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredCartoes && filteredCartoes.length > 0 ? filteredCartoes.map((cartao: CartaoInterface) => (
              <tr key={cartao.idCartao} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-center border">
                  {cartao.numeroCartao}
                </td>
                <td className="px-4 py-2 text-center border">
                  <span className={`font-semibold ${cartao.quantidadeServicosMensais === 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {cartao.quantidadeServicosMensais}
                  </span>
                </td>
                <td className="px-4 py-2 text-center border">
                  <span className="text-blue-600 font-medium">
                    {limitesMensais[cartao.idCartao!] || 2}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    {limitesMensais[cartao.idCartao!] && limitesMensais[cartao.idCartao!] !== 2 ? '(personalizado)' : '(padrão)'}
                  </span>
                </td>
                <td className="px-4 py-2 text-center border">
                  {cartao.cliente?.nome}
                </td>
                <td className="px-4 py-2 text-center border">
                  {cartao.carro?.modelo}
                </td>
                <td className="px-4 py-2 text-center border">
                  {cartao.carro?.placa}
                </td>
                <td className="px-4 py-2 text-center border">
                  {cartao.tipoCartao}
                </td>
                <td className="px-4 py-2 text-center border flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setCartaoEditado(cartao);
                      setMostrarModal(true);
                    }}
                    className="bg-gray-700 flex items-center text-white p-2 rounded-lg hover:bg-gray-600"
                  >
                    <FaEdit  />
                    
                  </button>
                  <button
                    onClick={() => handleExcluirCartao(cartao.idCartao!)}
                    className="bg-red-500 flex items-center text-white p-2 rounded-lg hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCartao(cartao);
                      setShowSaldoModal(true);
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    + Saldo
                  </button>
                  {user?.tipoUsuario === "admin" || user?.tipoUsuario === "super" && (
                  <button
                    onClick={() => {
                      setSelectedCartao(cartao);
                      setShowLimiteModal(true);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Definir Limite
                  </button>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={10} className="text-center">
                  Nenhum cartão encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <CartaoForm
          cartaoEditado={cartaoEditado}
          aoFechar={() => setMostrarModal(false)}
          aoSalvar={cartaoEditado ? handleEditarCartao : handleCriarCartao}
        />
      )}

      {showLimiteModal && selectedCartao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Definir Limite Mensal</h2>
            <p className="mb-4">
              Cartão: {selectedCartao.numeroCartao}
            </p>
            
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">Como funciona:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Limite Mensal:</strong> Máximo de transações por mês</li>
                <li>• <strong>Saldo:</strong> Lavagens disponíveis no cartão</li>
                <li>• Se o saldo for menor que o limite, será recarregado automaticamente</li>
                <li>• O cartão só pode ser usado até o menor valor entre limite e saldo</li>
              </ul>
            </div>

            {/* Informações das transações do mês */}
            <TransacoesCartaoMes 
              idCartao={selectedCartao.idCartao!} 
              mes={mesSelecionado} 
              ano={anoSelecionado} 
            />
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mês:</label>
                <select
                  value={mesSelecionado}
                  onChange={(e) => setMesSelecionado(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value={1}>Janeiro</option>
                  <option value={2}>Fevereiro</option>
                  <option value={3}>Março</option>
                  <option value={4}>Abril</option>
                  <option value={5}>Maio</option>
                  <option value={6}>Junho</option>
                  <option value={7}>Julho</option>
                  <option value={8}>Agosto</option>
                  <option value={9}>Setembro</option>
                  <option value={10}>Outubro</option>
                  <option value={11}>Novembro</option>
                  <option value={12}>Dezembro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ano:</label>
                <input
                  type="number"
                  value={anoSelecionado}
                  onChange={(e) => setAnoSelecionado(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                  min={2024}
                  max={2030}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Limite Personalizado:</label>
                <input
                  type="number"
                  value={limitePersonalizado}
                  onChange={(e) => setLimitePersonalizado(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                  min={1}
                  max={10}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Limite padrão é 2. No próximo mês voltará ao padrão automaticamente.
                </p>
                <p className="text-xs text-green-600 mt-1">
                  💡 Dica: Se o saldo atual ({selectedCartao.quantidadeServicosMensais}) for menor que o limite, 
                  o saldo será recarregado automaticamente na próxima transação.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowLimiteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleDefinirLimite}
                disabled={definirLimiteMensal.isPending}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {definirLimiteMensal.isPending ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaldoModal && selectedCartao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Adicionar Saldo</h2>
            <p className="mb-4">
              Cartão: {selectedCartao.numeroCartao}
            </p>
            
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <h3 className="font-semibold text-green-800 mb-2">Status Atual:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• <strong>Saldo atual:</strong> {selectedCartao.quantidadeServicosMensais}</li>
                <li>• <strong>Limite mensal:</strong> {limitesMensais[selectedCartao.idCartao!] || 2}</li>
                <li>• O saldo será adicionado respeitando o limite mensal</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Quantidade a Adicionar:</label>
                <input
                  type="number"
                  value={quantidadeAdicionar}
                  onChange={(e) => setQuantidadeAdicionar(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-300 rounded"
                  min={1}
                  max={10}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Digite a quantidade de lavagens que deseja adicionar ao cartão.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setShowSaldoModal(false);
                  setQuantidadeAdicionar(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdicionarSaldo}
                disabled={adicionarSaldo.isPending}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {adicionarSaldo.isPending ? "Adicionando..." : "Adicionar Saldo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cartoes;
