"use client";

import { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Car, CreditCard, Users, Store, Download } from "lucide-react";
import { useDashboardTotaladmin } from "../../../hooks/useDashboardAdmin";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { saveAs } from "file-saver";

export default function Dashboard() {
  const router = useRouter();
  const { data: dashboardData, isLoading, isError } = useDashboardTotaladmin();
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-bold text-gray-700">Carregando...</p>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-bold text-red-500">Erro ao carregar os dados.</p>
      </div>
    );
  }

  // Formatar transações para o gráfico
  const dataChart = dashboardData.transacoesRecentes.map((t) => ({
    data: new Date(t.data).toLocaleDateString(),
    valor: t.valorDesconto,
  }));

  // Filtro de pesquisa nas transações
  const transacoesFiltradas = dashboardData?.transacoesRecentes
  ? dashboardData.transacoesRecentes.filter((transacao) => {
      const dataFormatada = new Date(transacao.data).toLocaleDateString(); // Converte para formato legível
      return dataFormatada.includes(search); // Verifica se a data contém o valor pesquisado
    })
  : [];



  // Função para exportar CSV
  const exportarCSV = () => {
    const csvContent = [
      "Data,Valor Desconto",
      ...dashboardData.transacoesRecentes.map((t) => `${t.data}, ${t.valorDesconto}`),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "transacoes.csv");
  };

  return (
    <div className="space-y-6 p-6 sm:ml-40 mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      
      {/* Indicadores Principais */}
      <DashboardCard
        title="Cartões"
        icon={<CreditCard className="text-blue-500 w-5 h-5" />}
        total={dashboardData.totalCartoes}
        link="/cartoes"
        bgColor="bg-blue-500"
      />

      <DashboardCard
        title="Clientes"
        icon={<Users className="text-green-500 w-5 h-5" />}
        total={dashboardData.totalCleinetes}
        link="/clientes"
        bgColor="bg-green-500"
      />

      <DashboardCard
        title="Carros"
        icon={<Car className="text-gray-500 w-5 h-5" />}
        total={dashboardData.totalCarros}
        link="/carros"
        bgColor="bg-gray-500"
      />

      <DashboardCard
        title="Estabelecimentos"
        icon={<Store className="text-purple-500 w-5 h-5" />}
        total={dashboardData.totalEstabelecimentos}
        link="/estabelecimentos"
        bgColor="bg-purple-500"
      />

      <DashboardCard
        title="Transações"
        icon={<Calendar className="text-red-500 w-5 h-5" />}
        total={dashboardData.totalTransacoes}
        link="/transacoes"
        bgColor="bg-red-500"
      />

      {/* Gráfico de Transações */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Gráfico de Transações</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataChart}>
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="valor" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Últimas Transações */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4 p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Últimas Transações</h2>
          <button
            className="flex items-center bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
            onClick={exportarCSV}
          >
            <Download size={18} className="mr-2" />
            Exportar CSV
          </button>
        </div>

        {/* Campo de Pesquisa */}
        <input
          type="date"
          placeholder="Buscar por data..."
          className="border p-2 rounded-lg w-full mb-4"
          onChange={(e) => setSearch(e.target.value)}
        />

        <ul className="divide-y divide-gray-200">
          {transacoesFiltradas.map((transacao, index) => (
            <li key={index} className="py-3 flex justify-between">
              <span className="text-gray-600">{new Date(transacao.data).toLocaleDateString()}</span>
              <span className="text-blue-600 font-bold">R$ {transacao.valorDesconto.toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <button
          className="mt-4 w-[100px] bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={() => router.push("/transacoes")}
        >
          Ver mais
        </button>
      </div>
    </div>
  );
}

// Componente Reutilizável para Cards
const DashboardCard = ({ title, icon, total, link, bgColor }: { title: string; icon: JSX.Element; total: number; link: string; bgColor: string }) => {
  const router = useRouter();

  return (
    <div className="bg-white shadow-md rounded-lg p-2 flex flex-col">
      <div className="flex justify-center items-center gap-2">
        <h2 className="text-gray-500 text-lg">{title}</h2>
        {icon}
      </div>
      <div className="flex justify-center items-center gap-2">
        <p className="text-2xl font-bold">Total: {total}</p>
      </div>
      <p
        className={`mt-4 cursor-pointer w-20 m-auto flex justify-center items-center ${bgColor} text-white p-1 rounded-lg hover:brightness-90 transition`}
        onClick={() => router.push(link)}
      >
        Ver mais
      </p>
    </div>
  );
};
