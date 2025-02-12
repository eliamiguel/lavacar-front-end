"use client";

import { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Car, CreditCard, Users, Store, Download } from "lucide-react";
import { useDashboardTotaladmin } from "../../../hooks/useDashboardAdmin";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { saveAs } from "file-saver";
import { DashboardData, TransacaoRecente } from "../../../interface";

export default function Dashboard() {
  const router = useRouter();
  const dastbord = useDashboardTotaladmin()
  const { data: dashboardData } = useDashboardTotaladmin() as {
    data: DashboardData;
  };
  
  
  const [search, setSearch] = useState("");

  if (dastbord.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-bold text-gray-700">Carregando...</p>
      </div>
    );
  }

  if (dastbord.isError || !dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-bold text-red-500">Erro ao carregar os dados.</p>
      </div>
    );
  }

  // Função para corrigir a conversão da data
  const corrigirData = (dataString: string) => {
    if (!dataString) return new Date("Invalid Date");

    const dataConvertida = new Date(dataString);
    return isNaN(dataConvertida.getTime()) ? new Date("Invalid Date") : dataConvertida;
  };

  // Formatar transações para o gráfico
  const dataChart = dashboardData.transacoesRecentes.map((t: TransacaoRecente) => {
    const dataConvertida = new Date(t.dataTransacao);
    return {
      data: isNaN(dataConvertida.getTime()) ? "Data Inválida" : dataConvertida.toLocaleDateString(),
      valor: t.valorDesconto,
    };
  });
  

  // Filtro de pesquisa nas transações
  const transacoesFiltradas = dashboardData.transacoesRecentes.filter((transacao) => {
    const dataConvertida = corrigirData(transacao.dataTransacao);
    const dataFormatada = isNaN(dataConvertida.getTime()) ? "Data Inválida" : dataConvertida.toLocaleDateString();
    return dataFormatada.includes(search);
  });

  console.log("Transações Recentes:", dashboardData.transacoesRecentes);
  console.log("Transações Filtradas:", transacoesFiltradas);

  // Função para exportar CSV
  const exportarCSV = () => {
    const csvContent = [
      "Data,Valor Desconto",
      ...dashboardData.transacoesRecentes.map((t) => {
        const dataFormatada = corrigirData(t.dataTransacao).toISOString().split("T")[0]; // Formata para YYYY-MM-DD
        return `${dataFormatada}, ${t.valorDesconto}`;
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "transacoes.csv");
  };

  return (
    <div className="space-y-6 p-6 sm:ml-40 mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      
      <DashboardCard
        title="Cartões"
        icon={<CreditCard className="text-blue-500 w-5 h-5" />}
        total={dashboardData.totalCartoes}
        link="/cartoes"
      />

      <DashboardCard
        title="Clientes"
        icon={<Users className="text-green-500 w-5 h-5" />}
        total={dashboardData.totalCleinetes}
        link="/clientes"
      />

      <DashboardCard
        title="Carros"
        icon={<Car className="text-gray-500 w-5 h-5" />}
        total={dashboardData.totalCarros}
        link="/carros"
      />

      <DashboardCard
        title="Estabelecimentos"
        icon={<Store className="text-purple-500 w-5 h-5" />}
        total={dashboardData.totalEstabelecimentos}
        link="/estabelecimentos"
      />
      <DashboardCard
  title="Transações"
  icon={<Calendar className="text-red-500 w-5 h-5" />}
  total={dashboardData.totalTransacoes}  // 🔹 Corrigido para funcionar corretamente
  link="/transacoes"
/>


<div className="col-span-full w-full p-6 bg-white shadow-md rounded-lg">
  <h2 className="text-2xl font-bold mb-4">Gráfico de Transações</h2>
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={dataChart}>
      <XAxis dataKey="data" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="valor" fill="#3b82f6" />
    </BarChart>
  </ResponsiveContainer>
</div>

{/* Últimas Transações */}
<div className="col-span-full w-full p-6 bg-white shadow-md rounded-lg">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold">Últimas Transações</h2>
    <button
      className="flex items-center bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
      onClick={exportarCSV}
    >
      <Download size={18} className="mr-2" /> Exportar CSV
    </button>
  </div>

  {/* Campo de Pesquisa */}
  <input type="date" className="border p-2 rounded-lg w-full mb-4" onChange={(e) => setSearch(e.target.value)} />

  <ul className="divide-y divide-gray-200">
    {transacoesFiltradas.map((transacao, index) => {
      const dataConvertida = corrigirData(transacao.dataTransacao);
      const dataFormatada = isNaN(dataConvertida.getTime()) ? "Data Inválida" : dataConvertida.toLocaleDateString();

      return (
        <li key={index} className="py-3 flex justify-between">
          <span className="text-gray-600">{dataFormatada}</span>
          <span className="text-blue-600 font-bold">R$ {transacao.valorDesconto.toFixed(2)}</span>
        </li>
      );
    })}
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
const DashboardCard = ({ title, icon, total, link }: { title: string; icon: JSX.Element; total: number; link: string }) => {
  const router = useRouter();
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
      <h2 className="text-gray-500 text-lg">{title}</h2>
      {icon}
      <p className="text-2xl font-bold">Total: {total}</p>
      <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition" onClick={() => router.push(link)}>
        Ver mais
      </button>
    </div>
  );
};
