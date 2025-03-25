"use client";

import { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Car,
  CreditCard,
  Users,
  Store,
  Download,
} from "lucide-react";
import { useDashboardTotaladmin } from "../../../hooks/useDashboardAdmin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DashboardData, TransacaoRecente } from "../../../interface";
import { formatValor } from "@/lib/utils";

export default function Dashboard() {
  const router = useRouter();
  const dashboard = useDashboardTotaladmin();
  const { data: dashboardData } = useDashboardTotaladmin() as {
    data: DashboardData;
    isLoading: boolean;
    isError: boolean;
  };

  const [search, setSearch] = useState("");

  if (dashboard.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (dashboard.isError || !dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-bold text-red-500">
          Erro ao carregar os dados.
        </p>
      </div>
    );
  }

  const corrigirData = (dataString: string) => {
    if (!dataString) return new Date("Invalid Date");
    const dataConvertida = new Date(dataString);
    return isNaN(dataConvertida.getTime())
      ? new Date("Invalid Date")
      : dataConvertida;
  };

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

  const transacoes = dashboardData.transacoesRecentes.map((t) => ({
    data: corrigirData(t.dataTransacao).toLocaleDateString("pt-BR"),
    valor: formatValor(t.valorDesconto),
  }));

  const transacoesFiltradas = dashboardData.transacoesRecentes.filter(
    (transacao) => {
      const dataConvertida = corrigirData(transacao.dataTransacao);
      const dataFormatada = isNaN(dataConvertida.getTime())
        ? "Data Inválida"
        : dataConvertida.toLocaleDateString();
      return dataFormatada.includes(search);
    }
  );

  const exportarCSV = () => {
    const csvContent = [
      "Data;Valor Desconto", // cabeçalho separado com ponto e vírgula
      ...dashboardData.transacoesRecentes.map((t) => {
        const dataFormatada = corrigirData(t.dataTransacao).toLocaleDateString(
          "pt-BR"
        );
        const valor = t.valorDesconto.toFixed(2).replace(".", ","); // valor formatado como real
        return `${dataFormatada};${valor}`;
      }),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transacoes.csv";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportarXLS = () => {
    const worksheet = XLSX.utils.json_to_sheet(transacoes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transacoes");
    const xlsBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([xlsBuffer], { type: "application/octet-stream" });
    saveAs(blob, "transacoes.xlsx");
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Data", "Valor Desconto"]],
      body: transacoes.map((t) => [t.data, t.valor]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    doc.save("transacoes.pdf");
  };

  return (
    <div className=" p-6 sm:ml-40 mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

      <div className="col-span-full w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Gráfico de Transações</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={dataChart}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip formatter={(value) => formatValor(Number(value))} />
            <Bar
              dataKey="valor"
              fill="#3b82f6"
              barSize={40}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-full w-full p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Últimas Transações</h2>
          <div className="flex gap-2">
            <button
              onClick={exportarCSV}
              className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
            >
              Export CSV
            </button>
            <button
              onClick={exportarXLS}
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
            >
              Export XLS
            </button>
            <button
              onClick={exportarPDF}
              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
            >
              Export PDF
            </button>
          </div>
        </div>

        <input
          type="date"
          className="border p-2 rounded-lg w-full mb-4"
          onChange={(e) => setSearch(e.target.value)}
        />

        <ul className="divide-y divide-gray-200">
          {transacoesFiltradas.map((transacao, index) => (
            <li key={index} className="py-3 flex justify-between">
              <span className="text-gray-600">
                {corrigirData(transacao.dataTransacao).toLocaleDateString()}
              </span>
              <span className="text-blue-600 font-bold">
                {formatValor(transacao.valorDesconto)}
              </span>
            </li>
          ))}
        </ul>

        <button
          className="mt-4 w-[100px] bg-black text-white py-2 rounded-lg hover:bg-gray-700 transition"
          onClick={() => router.push("/transacoes")}
        >
          Ver mais
        </button>
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
