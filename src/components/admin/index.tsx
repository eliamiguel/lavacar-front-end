"use client";

import { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Car,
  CreditCard,
  Users,
  Store,
  FileText,
  Download,
  Filter,
  TrendingUp,
} from "lucide-react";
import { useDashboardTotaladmin } from "../../../hooks/useDashboardAdmin";
import { useGerarRelatorio, useClientesDisponiveis, useLavacarsDisponiveis } from "../../../hooks/UseRelatorios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { TransacaoRecente } from "../../../interface";
import { formatValor } from "@/lib/utils";
import { toast } from "react-toastify";

export default function Dashboard() {
  
  
  // Estados para o relatório
  const [relatorioDataInicio, setRelatorioDataInicio] = useState("");
  const [relatorioDataFim, setRelatorioDataFim] = useState("");
  const [formatoRelatorio, setFormatoRelatorio] = useState<'pdf' | 'csv' | 'xlsx'>('pdf');
  const [clienteSelecionado, setClienteSelecionado] = useState<number[]>([]);
  const [lavacarSelecionado, setLavacarSelecionado] = useState<number[]>([]);

  // Dashboard sem filtros automáticos - só mostra as últimas transações
  const { data: dashboardData, isLoading, isError } = useDashboardTotaladmin();
  const gerarRelatorio = useGerarRelatorio();
  const { data: clientes } = useClientesDisponiveis();
  const { data: lavacars } = useLavacarsDisponiveis();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-bold text-red-500">
          Erro ao carregar os dados.
        </p>
      </div>
    );
  }

  

  const dataChart = dashboardData.transacoesRecentes.map(
    (t: TransacaoRecente) => {
      const dataConvertida = new Date(t.dataTransacao);
      return {
        data: isNaN(dataConvertida.getTime())
          ? "Data Inválida"
          : dataConvertida.toLocaleDateString(),
        valor: t.valorDesconto,
      };
    }
  );




  
  const handleGerarRelatorio = () => {
    if (!relatorioDataInicio || !relatorioDataFim) {
      toast.info('Por favor, selecione o período inicial e final');
      return;
    }

    interface RelatorioParams {
      dataInicio: string;
      dataFim: string;
      formato: "pdf" | "csv" | "xlsx";
      clienteIds?: number[];
      lavacarIds?: number[];
    }

    const params: RelatorioParams = {
      dataInicio: new Date(`${relatorioDataInicio}T00:00:00`).toISOString(),
      dataFim: new Date(`${relatorioDataFim}T23:59:59`).toISOString(),
      formato: formatoRelatorio,
    };

    // Só adiciona filtros se houver seleção válida
    if (clienteSelecionado.length > 0 && clienteSelecionado.some(id => id > 0)) {
      params.clienteIds = clienteSelecionado.filter(id => id > 0);
    }

    if (lavacarSelecionado.length > 0 && lavacarSelecionado.some(id => id > 0)) {
      params.lavacarIds = lavacarSelecionado.filter(id => id > 0);
      console.log('Filtro por lavacar aplicado:', params.lavacarIds);
    }
    
    try {
      gerarRelatorio.mutate(params);
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório. Tente novamente.');
     
    }
  };

  return (
    <div className="p-6 sm:ml-40 mt-40 space-y-8">
      {/* Cards do Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          {
            title: "Cartões",
            icon: <CreditCard className="text-blue-500 w-6 h-6" />,
            total: dashboardData.totalCartoes,
            link: "/cartoes",
          },
          {
            title: "Clientes",
            icon: <Users className="text-green-500 w-6 h-6" />,
            total: dashboardData.totalCleinetes,
            link: "/clientes",
          },
          {
            title: "Carros",
            icon: <Car className="text-gray-500 w-6 h-6" />,
            total: dashboardData.totalCarros,
            link: "/carros",
          },
          {
            title: "Credenciados",
            icon: <Store className="text-purple-500 w-6 h-6" />,
            total: dashboardData.totalEstabelecimentos,
            link: "/credenciados",
          },
          {
            title: "Transações",
            icon: <Calendar className="text-red-500 w-6 h-6" />,
            total: dashboardData.totalTransacoes,
            link: "/transacoes",
          },
        ].map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
      

      {/* Seção de Relatórios */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <FileText className="text-green-600 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Gerador de Relatórios</h2>
              <p className="text-sm text-gray-600">Extraia relatórios personalizados de transações</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Dica informativa */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-800 font-medium">Dica para relatórios completos</p>
                <p className="text-sm text-blue-700 mt-1">
                  Para gerar relatório de todos os clientes e lavacars, deixe os filtros vazios. 
                  O sistema irá incluir todas as transações do período selecionado.
                </p>
              </div>
            </div>
          </div>
          
          {/* Configurações básicas */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span>Configurações Básicas</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                  <span>Data Início</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={relatorioDataInicio}
                  onChange={(e) => setRelatorioDataInicio(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                  <span>Data Fim</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={relatorioDataFim}
                  onChange={(e) => setRelatorioDataFim(e.target.value)}
                />
                <p className="text-xs text-red-600 flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Máximo 6 dias no futuro</span>
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Formato</label>
                <select
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formatoRelatorio}
                  onChange={(e) => setFormatoRelatorio(e.target.value as 'pdf' | 'csv' | 'xlsx')}
                >
                  <option value="pdf"> PDF</option>
                  <option value="csv"> CSV</option>
                  <option value="xlsx"> Excel</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Ação</label>
                <button
                  onClick={handleGerarRelatorio}
                  disabled={gerarRelatorio.isPending}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                >
                  {gerarRelatorio.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Gerando...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Gerar Relatório</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Filtros avançados */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span>Filtros Avançados (Opcional)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Filtrar por Cliente</label>
                <select
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px]"
                  multiple
                  value={clienteSelecionado.map(String)}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                    const validSelected = selected.filter(id => id > 0);
                    setClienteSelecionado(validSelected);
                  }}
                >
                  {clientes?.map((cliente: { idCliente: number; nome: string }) => (
                    <option key={cliente.idCliente} value={cliente.idCliente} className="py-1">
                      {cliente.nome}
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Ctrl + Click para múltiplas seleções
                  </p>
                  {clienteSelecionado.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {clienteSelecionado.length} selecionado(s)
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Filtrar por Lavacar</label>
                <select
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px]"
                  multiple
                  value={lavacarSelecionado.map(String)}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                    const validSelected = selected.filter(id => id > 0);
                    setLavacarSelecionado(validSelected);
                  }}
                >
                  {lavacars?.map((lavacar: { idLavacar: number; nome: string }) => (
                    <option key={lavacar.idLavacar} value={lavacar.idLavacar} className="py-1">
                      {lavacar.nome}
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Ctrl + Click para múltiplas seleções
                  </p>
                  {lavacarSelecionado.length > 0 && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {lavacarSelecionado.length} selecionado(s)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Análise de Transações</h2>
              <p className="text-sm text-gray-600">Visualização dos valores de desconto por período</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total de transações exibidas: {dataChart.slice(0, 10).length}</span>
              <span>Período: Últimas transações</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={450}>
            <BarChart
              data={dataChart.slice(0, 10)}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="data" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [formatValor(Number(value)), 'Valor']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar
                dataKey="valor"
                fill="url(#colorGradient)"
                barSize={30}
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const DashboardCard = ({
  title,
  icon,
  total,
  link,
}: {
  title: string;
  icon: JSX.Element;
  total: number;
  link: string;
}) => {
  const router = useRouter();
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center w-full h-36 justify-between">
      <div className="flex items-center space-x-2">
        {icon}
        <h2 className="text-gray-500 text-lg">{title}</h2>
      </div>
      <p className="text-2xl font-bold">{total}</p>
      <button
        className="bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition"
        onClick={() => router.push(link)}
      >
        Ver mais
      </button>
    </div>
  );
};