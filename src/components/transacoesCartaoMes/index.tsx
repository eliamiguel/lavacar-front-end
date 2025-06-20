"use client";

import { useTransacoesCartaoMes } from "../../../hooks/useCartao";

interface TransacoesCartaoMesProps {
  idCartao: number;
  mes: number;
  ano: number;
}

const TransacoesCartaoMes: React.FC<TransacoesCartaoMesProps> = ({ idCartao, mes, ano }) => {
  const { data, isLoading, error } = useTransacoesCartaoMes(idCartao, mes, ano);

  if (isLoading) {
    return (
      <div className="bg-yellow-50 p-3 rounded-lg mb-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-yellow-600"></div>
          <span className="ml-2 text-sm text-yellow-700">Carregando transações...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-3 rounded-lg mb-4">
        <p className="text-sm text-red-700">
          Erro ao carregar transações: {error.message}
        </p>
      </div>
    );
  }

  const totalTransacoes = data?.total || 0;
  const transacoes = data?.transacoes || [];

  return (
    <div className="bg-yellow-50 p-3 rounded-lg mb-4">
      <h3 className="font-semibold text-yellow-800 mb-2">
        📊 Transações em {mes}/{ano}:
      </h3>
      
      <div className="text-sm text-yellow-700 space-y-1">
        <p className="font-medium">
          • <strong>Total de transações:</strong> {totalTransacoes}
        </p>
        
        {totalTransacoes > 0 && (
          <div className="mt-2">
            <p className="font-medium mb-1">• <strong>Detalhes das transações:</strong></p>
            <div className="max-h-32 overflow-y-auto bg-white bg-opacity-50 rounded p-2">
              {transacoes.map((transacao: {
                idTransacao: number;
                dataTransacao: string;
                valorDesconto: number;
                placaVeiculo?: string;
                lavacar?: { nome: string };
              }) => (
                <div key={transacao.idTransacao} className="text-xs border-b border-yellow-200 pb-1 mb-1 last:border-b-0">
                  <span className="font-medium">
                    {new Date(transacao.dataTransacao).toLocaleDateString('pt-BR')}
                  </span>
                  {" - "}
                  <span>{transacao.lavacar?.nome || 'Lavacar não informado'}</span>
                  {" - "}
                  <span className="text-green-600 font-medium">
                    R$ {transacao.valorDesconto.toFixed(2)}
                  </span>
                  {transacao.placaVeiculo && (
                    <span className="text-gray-600">
                      {" - Placa: "}{transacao.placaVeiculo}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {totalTransacoes === 0 && (
          <p className="text-gray-600 italic">
            Nenhuma transação encontrada para este mês.
          </p>
        )}
      </div>
    </div>
  );
};

export default TransacoesCartaoMes; 