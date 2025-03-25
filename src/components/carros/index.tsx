"use client";

import { useContext, useState } from "react";
import {
  useCarros,
  useCriarCarro,
  useEditarCarro,
  useExcluirCarro,
} from "../../../hooks/useCarros";
import CarroForm from "../carroForm";
import { CarroInterface } from "../../../interface";
import { UserContext } from "@/context/UserContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import { formatInfoCarro } from "@/lib/utils";

const Carros = () => {
  const queryCarros = useCarros();
  const mutateCriar = useCriarCarro();
  const mutateEditar = useEditarCarro();
  const excluirCarro = useExcluirCarro();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [carroEditando, setCarroEditando] = useState<
    CarroInterface | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(UserContext);

  const filteredCarros = queryCarros.data?.filter(
    (carro) =>
      carro.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carro.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carro.cor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecarregar = () => {
    queryCarros.refetch();
  };

  const handleSalvarCarro = (carro: CarroInterface) => {
    if (carro.idCarro) {
      mutateEditar.mutate({
        idCliente: carro.idCliente,
        ano: carro.ano,
        cor: carro.cor,
        idCarro: carro.idCarro,
        modelo: carro.modelo,
        placa: carro.placa,
        chassis: carro.chassis,
        desembargador: carro.desembargador,
        lotacao: carro.lotacao,
        marca: carro.marca,
        renavam: carro.renavam,
      });
    } else {
      mutateCriar.mutate({ ...carro });
    }
  };

  const handleExcluirCarro = (idCarro: number) => {
    if (user?.tipoUsuario === "admin") {
      alert(
        "Você não tem permissão para excluir este carro. Contate o super usuário."
      );
      return;
    }

    if (confirm("Tem certeza que deseja excluir este carro?")) {
      excluirCarro.mutate({ idCarro });
    }
  };

  if (queryCarros.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (queryCarros.isError) {
    console.error("Erro ao carregar os dados:", queryCarros.error);
    return <div className="text-red-500">Erro ao carregar os carros.</div>;
  }

  return (
    <div className="p-6 space-y-6 md:ml-40 mt-20">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            setCarroEditando(undefined);
            setMostrarFormulario(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-700"
        >
          <span className="mr-2">+</span> Novo Carro
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Busca rápida"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-full md:w-1/3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleRecarregar}
          className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center"
        >
          🔄 Recarregar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Marca</th>
              <th className="px-4 py-2 border">Modelo</th>
              <th className="px-4 py-2 border">Placa</th>
              <th className="px-4 py-2 border">Chassis</th>
              <th className="px-4 py-2 border">Renavam</th>
              <th className="px-4 py-2 border">Cor</th>
              <th className="px-4 py-2 border">Lotação</th>
              <th className="px-4 py-2 border">Desembargador</th>
              <th className="px-4 py-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredCarros?.map((carro: CarroInterface) => (
              <tr key={carro.idCarro} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-center border">{carro.marca}</td>
                <td className="px-4 py-2 text-center border">{carro.modelo}</td>
                <td className="px-4 py-2 text-center border">
                  {formatInfoCarro("placa", carro.placa)}
                </td>
                <td className="px-4 py-2 text-center border">
                  {formatInfoCarro("chassi", carro.chassis)}
                </td>
                <td className="px-4 py-2 text-center border">
                  {formatInfoCarro("renavam", carro.renavam)}
                </td>
                <td className="px-4 py-2 text-center border">{carro.cor}</td>
                <td className="px-4 py-2 text-center border">
                  {carro.lotacao}
                </td>
                <td className="px-4 py-2 text-center border">
                  {carro.desembargador}
                </td>
                <td className="px-4 py-2 text-center border flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setCarroEditando(carro);
                      setMostrarFormulario(true);
                    }}
                    className="bg-gray-700 flex items-center text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    <FaEdit className="mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluirCarro(carro.idCarro!)}
                    className="bg-red-500 flex items-center text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    <FaTrash className="mr-2" />
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mostrarFormulario && (
        <CarroForm
          carroEditado={carroEditando}
          aoFechar={() => setMostrarFormulario(false)}
          aoSalvar={handleSalvarCarro}
        />
      )}
    </div>
  );
};

export default Carros;
