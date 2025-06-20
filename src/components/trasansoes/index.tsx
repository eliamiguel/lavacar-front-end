"use client";

import { useContext, useState } from "react";
import { useTransacaoPorCliente, useTransacao } from "../../../hooks/useTransacao";
import { TransacaoInterface } from "../../../interface";
import { UserContext } from "@/context/UserContext";


const Transacoes = () => {
    const {user } = useContext(UserContext);
    const idCliente = user?.cliente?.idCliente || 0;
    
    const transacoesSuper = useTransacao();
    const transacoesCliente = useTransacaoPorCliente({idCliente:idCliente});
  
    const transacoes = user?.tipoUsuario === "super" ? transacoesSuper : transacoesCliente;
    
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransacoes = transacoes.data?.filter((transacao) => {
    return (
      transacao.cartao?.cliente?.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transacao.lavacar?.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transacao.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transacao.cartao?.numeroCartao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transacao.cartao?.carro?.placa?.includes(searchTerm) ||
      transacao.cartao?.carro?.modelo?.includes(searchTerm) ||
      transacao.cartao?.carro?.marca?.includes(searchTerm) ||
      transacao.cartao?.carro?.chassis?.includes(searchTerm) ||
      transacao.cartao?.carro?.renavam?.includes(searchTerm) ||
      transacao.cartao?.carro?.lotacao?.includes(searchTerm) ||
      transacao.cartao?.carro?.desembargador?.includes(searchTerm)
    );
  });

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleRecarregar = () => {
    transacoes.refetch();
  };

  if (transacoes.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (transacoes.isError) {
    console.error("Erro ao carregar as transações:", transacoes.error);
    return <div className="text-red-500">Erro ao carregar as transações.</div>;
  }

  return (
    <div className="p-6 space-y-6 md:ml-40 mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
        <button
          onClick={handleRecarregar}
          className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center"
        >
          🔄 Recarregar
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Busca rápida pelo número do cartão, estabelecimento, placa do carro"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-full md:w-1/3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Cliente</th>
              <th className="px-4 py-2 border">Estabelecimento</th>
              <th className="px-4 py-2 border">Placa Carro</th>
              <th className="px-4 py-2 border">Valor</th>
              <th className="px-4 py-2 border">Numero Cartão</th>
              <th className="px-4 py-2 border">Data</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            { filteredTransacoes && filteredTransacoes.length > 0 ? filteredTransacoes.map((transacao: TransacaoInterface) => (
              <tr
                key={transacao.idTransacao}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-2 text-center border">
                  {transacao.idTransacao}
                </td>
                <td className="px-4 py-2 text-center border">
                  {transacao.cartao?.cliente?.nome || "Cliente Desconhecido"}
                </td>
                <td className="px-4 py-2 text-center border">
                  {transacao.lavacar?.nome || "Estabelecimento Desconhecido"}
                </td>
                <td className="px-4 py-2 text-center border">
                  {transacao.cartao?.carro?.placa || "Carro Desconhecido"}
                  
                  {transacao.cartao?.tipoCartao ==="CORINGA" && transacao.placaVeiculo && (
                    <>
                    <br />
                    <span className="text-xs text-gray-500">Cartão Coringa
                    placa informada no momento da transação:
                    </span>
                    <span className="text-xs text-gray-500">{transacao.placaVeiculo}</span>
                    </>
                  )}
                  
                  
                </td>
                <td className="px-4 py-2 text-center border">
                  {formatCurrency(transacao.valorDesconto)}
                </td>
                <td className="px-4 py-2 text-center border">
                  {transacao.cartao?.numeroCartao || "Cartão Desconhecido"}
                </td>
                <td className="px-4 py-2 text-center border">
                  {new Date(transacao.dataTransacao).toLocaleDateString(
                    "pt-BR"
                  )}
                </td>
                <td className="px-4 py-2 text-center border">
                  {transacao.status}
                </td>
              </tr>
            )) : (
              <tr className="border-t hover:bg-gray-50 ">
                <td colSpan={10} className="text-center w-full ">
                  Nenhuma transação encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transacoes;
