"use client";

import { useContext, useState } from "react";
import { useTentativasPagamento, useTentativasPagamentoPorCliente } from "../../../hooks/useCartao";
import { TentativaPagamentoInterface } from "../../../interface";
import { UserContext } from "@/context/UserContext";

const TentativasPagamento = () => {
    const { user } = useContext(UserContext);
    const idCliente = user?.cliente?.idCliente || 0;
    
    const tentativasSuper = useTentativasPagamento();
    const tentativasCliente = useTentativasPagamentoPorCliente(idCliente);
  
    const tentativas = user?.tipoUsuario === "super" ? tentativasSuper : tentativasCliente;
    
    const [searchTerm, setSearchTerm] = useState("");

    const filteredTentativas = tentativas.data?.tentativas?.filter((tentativa: TentativaPagamentoInterface) => {
        return (
            tentativa.cartao?.cliente?.nome
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            tentativa.lavacar?.nome
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            tentativa.motivoFalha.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tentativa.numeroCartao.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tentativa.cartao?.carro?.placa?.includes(searchTerm) ||
            tentativa.cartao?.carro?.modelo?.includes(searchTerm) ||
            tentativa.cartao?.carro?.marca?.includes(searchTerm) ||
            tentativa.cartao?.carro?.lotacao?.includes(searchTerm) ||
            tentativa.placaVeiculo?.includes(searchTerm)
        );
    });

    const getMotivoFalhaColor = (motivo: string) => {
        switch (motivo) {
            case "SENHA_INCORRETA":
                return "text-red-600 bg-red-100";
            case "CARTAO_NAO_ENCONTRADO":
                return "text-orange-600 bg-orange-100";
            case "SALDO_INSUFICIENTE":
                return "text-yellow-600 bg-yellow-100";
            case "LIMITE_TRANSACOES":
                return "text-purple-600 bg-purple-100";
            case "CARTAO_NAO_PERTENCE_CLIENTE":
                return "text-blue-600 bg-blue-100";
            case "PLACA_OBRIGATORIA_CORINGA":
                return "text-indigo-600 bg-indigo-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const getMotivoFalhaLabel = (motivo: string) => {
        switch (motivo) {
            case "SENHA_INCORRETA":
                return "Senha Incorreta";
            case "CARTAO_NAO_ENCONTRADO":
                return "Cartão Não Encontrado";
            case "SALDO_INSUFICIENTE":
                return "Saldo Insuficiente";
            case "LIMITE_TRANSACOES":
                return "Limite de Transações";
            case "CARTAO_NAO_PERTENCE_CLIENTE":
                return "Cartão Não Pertence ao Cliente";
            case "PLACA_OBRIGATORIA_CORINGA":
                return "Placa Obrigatória (Coringa)";
            case "LAVACAR_NAO_ENCONTRADO":
                return "Estabelecimento Não Encontrado";
            case "CLIENTE_NAO_VINCULADO":
                return "Cliente Não Vinculado";
            case "ERRO_GENERICO":
                return "Erro Genérico";
            default:
                return motivo;
        }
    };

    const handleRecarregar = () => {
        tentativas.refetch();
    };

    if (tentativas.isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (tentativas.isError) {
        console.error("Erro ao carregar as tentativas:", tentativas.error);
        return <div className="text-red-500">Erro ao carregar as tentativas de pagamento.</div>;
    }

    return (
        <div className="p-6 space-y-6 md:ml-40 mt-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tentativas de Pagamento Falhadas</h1>
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
                    placeholder="Busca rápida por cliente, estabelecimento, motivo da falha, número do cartão"
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
                            <th className="px-4 py-2 border">Número do Cartão</th>
                            <th className="px-4 py-2 border">Placa Veículo</th>
                            <th className="px-4 py-2 border">Motivo da Falha</th>
                            <th className="px-4 py-2 border">Descrição</th>
                            <th className="px-4 py-2 border">Data/Hora</th>
                            <th className="px-4 py-2 border">IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTentativas && filteredTentativas.length > 0 ? filteredTentativas.map((tentativa: TentativaPagamentoInterface) => (
                            <tr
                                key={tentativa.idTentativa}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-4 py-2 text-center border">
                                    {tentativa.idTentativa}
                                </td>
                                <td className="px-4 py-2 text-center border">
                                    {tentativa.cartao?.cliente?.nome || "Cliente Desconhecido"}
                                </td>
                                <td className="px-4 py-2 text-center border">
                                    {tentativa.lavacar?.nome || "Estabelecimento Desconhecido"}
                                </td>
                                <td className="px-4 py-2 text-center border">
                                    {tentativa.numeroCartao}
                                </td>
                                <td className="px-4 py-2 text-center border">
                                    {tentativa.placaVeiculo || tentativa.cartao?.carro?.placa || "N/A"}
                                </td>
                                <td className="px-4 py-2 text-center border">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMotivoFalhaColor(tentativa.motivoFalha)}`}>
                                        {getMotivoFalhaLabel(tentativa.motivoFalha)}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-center border">
                                    <div className="max-w-xs truncate" title={tentativa.descricaoFalha}>
                                        {tentativa.descricaoFalha}
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-center border">
                                    {new Date(tentativa.dataTentativa).toLocaleString("pt-BR")}
                                </td>
                                <td className="px-4 py-2 text-center border">
                                    {tentativa.ipTentativa || "N/A"}
                                </td>
                            </tr>
                        )) : (
                            <tr className="border-t hover:bg-gray-50">
                                <td colSpan={9} className="text-center w-full">
                                    Nenhuma tentativa de pagamento falhada encontrada
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TentativasPagamento; 