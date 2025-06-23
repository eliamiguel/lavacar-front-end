"use client";

import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { IntefacePermitidos, IterfacetransacoesSeuEstabelecimento } from "../../../interface";
import { useLavacar } from "../../../hooks/useEstabelecimentos";

export default function SeuEstabelecimentoDashboard() {
  const { user } = useContext(UserContext);
  const [filtroPeriodo, setFiltroPeriodo] = useState("tudo");
  
  console.log('SeuEstabelecimentoDashboard - user:', user);
  console.log('SeuEstabelecimentoDashboard - user?.idLavacar:', user?.idLavacar);
  
  // Validação adicional para garantir que idLavacar é válido
  const idLavacar = user?.idLavacar && user.idLavacar > 0 ? user.idLavacar : 0;
  console.log('SeuEstabelecimentoDashboard - idLavacar final:', idLavacar);
  
  const { data: lavacar, isLoading, isError } = useLavacar(idLavacar);
 
  console.log('SeuEstabelecimentoDashboard - estado:', { isLoading, isError, hasData: !!lavacar });
 
  if (isLoading) return <p className="text-center text-gray-600 mt-10 text-lg">Carregando informações...</p>;
  if (isError) return <p className="text-center text-red-500 mt-10 text-lg">Erro ao carregar informações do estabelecimento.</p>;
  if (!lavacar) return <p className="text-center text-red-500 mt-10 text-lg">Nenhuma informação encontrada.</p>;
   
  return (
    <div className="min-h-screen mt-20 sm:ml-40 bg-gray-100 p-8">
      
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">{lavacar.nome}</h1>

      
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="text-lg text-gray-800 space-y-2">
          <p><strong className="text-gray-700">Atividade Principal:</strong> {lavacar.atividadePrincipal}</p>
          <p><strong className="text-gray-700">Ramo de Atuação:</strong> {lavacar.ramoAtuacao}</p>
          <p><strong className="text-gray-700">Razão Social:</strong> {lavacar.razaoSocial}</p>
          <p><strong className="text-gray-700">Endereço:</strong> {lavacar.endereco}</p>
          <p><strong className="text-gray-700">Cidade:</strong> {lavacar.cidade}</p>
          <p><strong className="text-gray-700">Telefone:</strong> {lavacar.telefone}</p>
          <p><strong className="text-gray-700">E-mail:</strong> {lavacar.email}</p>
          <p><strong className="text-gray-700">CNPJ:</strong> {lavacar.cnpj}</p>
        </div>
      </div>

   
      <div className="mt-10">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Cartões Permitidos</h2>
        {!lavacar.cartoesPermitidos || lavacar.cartoesPermitidos.length === 0 ? (
          <p className="text-gray-500 text-lg">Nenhum cartão permitido.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {lavacar.cartoesPermitidos.map((cartao: IntefacePermitidos) => (
              <div key={cartao.idCartao} className="p-6 bg-blue-100 rounded-lg shadow-md border-l-4 border-blue-500">
                <p className="text-md text-gray-900 font-semibold">Cartão: ****{cartao.numeroCartao?.slice(-4) || '****'}</p>
              
                <p className="text-md text-green-700 font-bold">Serviços Restantes:{cartao.quantidadeServicosMensais || 0}</p>
                <p className="text-md text-gray-700"><strong>Tipo:</strong> {cartao.tipoCartao || 'NORMAL'}</p>
                <p className="text-md text-gray-700">
                  <strong>Placa:</strong> <span className={` text-md text-gray-800`}>
                    {cartao.placa || 'Não informada'}
                  </span>
                </p>
                <p className="text-md text-gray-700">
                  <strong>Modelo:</strong> <span className={` text-gray-800 text-md`}>
                    {cartao.modelo || 'Não informado'}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <div className="mt-10">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Transações Recentes</h2>
        
        <div className="flex flex-wrap items-center justify-between mb-4">
          <p className="text-lg text-gray-700">Selecione o período:</p>
          <select
            className="p-2 border rounded-lg"
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
          >
            <option value="tudo">Todas</option>
            <option value="ultimos-30">Últimos 30 dias</option>
            <option value="ultimos-7">Últimos 7 dias</option>
          </select>
        </div>

        {!lavacar.transacoes || lavacar.transacoes.length === 0 ? (
          <p className="text-gray-500 text-lg">Nenhuma transação registrada.</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            {lavacar.transacoes.map((transacao: IterfacetransacoesSeuEstabelecimento) => (
              <div key={transacao.idTransacao} className="py-4 border-b border-gray-300">
                <p className="text-xl font-semibold text-gray-900">
                  Lavagem: <span className="text-red-600 font-bold">{transacao.valorDesconto}</span>
                </p>
                <p className="text-lg text-gray-700">
                  <strong>Status:</strong> <span className={`font-bold ${transacao.status === "Concluído" ? "text-green-600" : "text-red-500"}`}>
                    {transacao.status}
                  </span>
                </p>
                {transacao.cartao?.carro && (
                  <p className="text-lg text-gray-700">
                    <strong>Placa:</strong> <span className="font-semibold text-blue-600">{transacao.cartao.carro.placa}</span>
                  </p>
                )}
                {transacao.cartao?.carro && (
                  <p className="text-lg text-gray-700">
                    <strong>Modelo:</strong> <span className="font-semibold text-gray-800">{transacao.cartao.carro.modelo}</span>
                  </p>
                )}
                {transacao.cartao && (
                  <p className="text-lg text-gray-700">
                    <strong>Cartão:</strong> <span className="font-semibold text-gray-800">****{transacao.cartao.numeroCartao?.slice(-4) || '****'}</span>
                  </p>
                )}
                <p className="text-lg text-gray-700">
                  <strong>Data:</strong> {new Date(transacao.dataTransacao).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
