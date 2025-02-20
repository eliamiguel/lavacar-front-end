"use client";

import { useState } from "react";
import { useCartoes, useCriarCartao, useEditarCartao, useExcluirCartao } from "../../../hooks/useCartao";
import CartaoForm from "../cartaoForm";
import { CartaoInterface } from "../../../interface";

const Cartoes = () => {
  const queryCartoes = useCartoes();
  const mutateCriar = useCriarCartao();
  const mutateEditar = useEditarCartao();
  const excluirCartao = useExcluirCartao();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cartaoEditado, setCartaoEditado] = useState<CartaoInterface | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCartoes = queryCartoes.data?.filter(cartao =>
    cartao.numeroCartao.includes(searchTerm) || 
    cartao.idCliente.toString().includes(searchTerm) ||
    cartao.tipoCartao.toLowerCase().includes(searchTerm.toLowerCase())
  );

 
  const handleRecarregar = () => {
    queryCartoes.refetch();
  };

  const handleSalvarCartao = (cartao: CartaoInterface) => {
    if (cartao.idCartao) {
      mutateEditar.mutate({
        idCartao: cartao.idCartao,
        idCliente: cartao.idCliente,
        idCarro: cartao.idCarro,
        numeroCartao: cartao.numeroCartao,
        saldo: cartao.saldo,
        tipoCartao: cartao.tipoCartao as "NORMAL" | "CORINGA",
      });
    } else {
      mutateCriar.mutate({
        idLavacar: cartao.idLavacar,
        idCliente: cartao.idCliente,
        idCarro: cartao.idCarro,
        numeroCartao: cartao.numeroCartao,
        saldo: cartao.saldo,
        senha: cartao.senha,
        tipoCartao: cartao.tipoCartao,
      });
    }
  };

  const handleExcluirCartao = (idCartao: number) => {
    if (confirm("Tem certeza que deseja excluir este cartão?")) {
      excluirCartao.mutate({ idCartao });
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
    <div className="p-6 space-y-6 sm:ml-40 mt-20">
     
      <div className="flex justify-between items-center mb-6">
       
        <button
          onClick={() => { setCartaoEditado(undefined); setMostrarModal(true); }}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-700"
        >
          <span className="mr-2">+</span> Novo Cartão
        </button>
      </div>

      
      <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
        
        <input
          type="text"
          placeholder="Busca rápida"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-1/3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        {/* Botão Recarregar */}
        <button
          onClick={handleRecarregar}
          className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center"
        >
          🔄 Recarregar
        </button>
      </div>

      {/* Tabela */}
      <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Número do Cartão</th>
            <th className="px-4 py-2 border">Saldo</th>
            <th className="px-4 py-2 border">Cliente</th>
            <th className="px-4 py-2 border">Carro</th>
            <th className="px-4 py-2 border">Tipo Cartão</th>
            <th className="px-4 py-2 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredCartoes?.map((cartao: CartaoInterface) => (
            <tr key={cartao.idCartao} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 text-center border">{cartao.numeroCartao}</td>
              <td className="px-4 py-2 text-center border">R$ {cartao.saldo.toFixed(2)}</td>
              <td className="px-4 py-2 text-center border">{cartao.idCliente}</td>
              <td className="px-4 py-2 text-center border">{cartao.idCarro}</td>
              <td className="px-4 py-2 text-center border">{cartao.tipoCartao}</td>
              <td className="px-4 py-2 text-center border flex justify-center gap-2">
                <button
                  onClick={() => { setCartaoEditado(cartao); setMostrarModal(true); }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleExcluirCartao(cartao.idCartao!)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {mostrarModal && <CartaoForm cartaoEditado={cartaoEditado} aoFechar={() => setMostrarModal(false)} aoSalvar={handleSalvarCartao} />}
    </div>
  );
};

export default Cartoes;
