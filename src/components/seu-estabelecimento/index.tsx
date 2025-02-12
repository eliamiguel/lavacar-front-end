"use client";

import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { IntefacePermitidos, IterfacetransacoesSeuEstabelecimento } from "../../../interface";
import { useLavacar } from "../../../hooks/useEstabelecimentos";

export default function SeuEstabelecimentoDashboard() {
  const { user } = useContext(UserContext);
  const [filtroPeriodo, setFiltroPeriodo] = useState("tudo");
  const { data: lavacar, isLoading } = useLavacar(user?.idLavacar || 0);

  if (isLoading) return <p className="text-center text-gray-600">Carregando...</p>;
  if (!lavacar) return <p className="text-center text-red-500">Nenhuma informação encontrada.</p>;


  return (
    <div className="min-h-screen mt-20 space-y-6 sm:ml-40 flex flex-col bg-white p-8">  
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Meu Lavacar</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
        <p className="text-xl"><strong>Nome:</strong> {lavacar.nome}</p>
        <p className="text-xl"><strong>Endereço:</strong> {lavacar.endereco}</p>
        <p className="text-xl"><strong>Telefone:</strong> {lavacar.telefone}</p>
        <p className="text-xl"><strong>Email:</strong> {lavacar.email}</p>
        <p className="text-xl"><strong>CNPJ:</strong> {lavacar.cnpj}</p>
      </div>
      
      {/* Cartões Permitidos */}
      <div className="mt-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Cartões Permitidos</h2>
        {lavacar.cartoesPermitidos.length === 0 ? (
          <p className="text-gray-500">Nenhum cartão permitido.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {lavacar.cartoesPermitidos.map((cartao: IntefacePermitidos) => (
              <div key={cartao.idCartao} className="p-6 bg-gray-100 rounded-lg shadow-md border-l-4 border-blue-500">
                <p className="text-lg text-gray-800 font-semibold">Cartão: {cartao.numeroCartao}</p>
                <p className="text-xl text-green-600 font-bold">Saldo: R$ {cartao.saldo.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Transações */}
      <div className="mt-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Transações Recentes</h2>
        <select className="p-2 border rounded-lg mb-4" value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)}>
          <option value="tudo">Todas</option>
          <option value="ultimos-30">Últimos 30 dias</option>
          <option value="ultimos-7">Últimos 7 dias</option>
        </select>
        {lavacar.transacoes.length === 0 ? (
          <p className="text-gray-500">Nenhuma transação registrada.</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md divide-y divide-gray-200">
            {lavacar.transacoes.map((transacao: IterfacetransacoesSeuEstabelecimento) => (
              <div key={transacao.idTransacao} className="py-4">
                <p className="text-xl"><strong>Valor:</strong> <span className="text-green-600 font-bold">R$ {transacao.valorDesconto.toFixed(2)}</span></p>
                <p className="text-lg"><strong>Status:</strong> <span className="text-gray-700">{transacao.status}</span></p>
                <p className="text-lg"><strong>Data:</strong> {new Date(transacao.dataTransacao).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      
    </div>
  );
}
