"use client";

import { useState, useEffect } from "react";
import { CarroInterface } from "../../../interface";
import { useCleintes } from "../../../hooks/useClientes";

interface CarroFormProps {
  carroEditado?: CarroInterface;
  aoFechar: () => void;
  aoSalvar: (carro: CarroInterface) => void;
}

const CarroForm: React.FC<CarroFormProps> = ({ carroEditado, aoFechar, aoSalvar }) => {
  const queryClientes = useCleintes();
  const [carro, setCarro] = useState<CarroInterface>(
    carroEditado || {
      idCarro: 0,
      idCliente: 0,
      marca: "",
      modelo: "",
      placa: "",
      chassis: "",
      renavam: "",
      lotacao: "",
      desembargador: "",
      ano: new Date().getFullYear(),
      cor: "",
    }
  );

  useEffect(() => {
    if (carroEditado) {
      setCarro(carroEditado);
    }
  }, [carroEditado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setCarro((prev: CarroInterface) => ({
      ...prev,
      [name]: ["idCliente", "ano"].includes(name) ? Number(value) || 0 : value,
    }));
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    aoSalvar(carro);
    aoFechar();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity">
      <div className="bg-white w-full max-w-4xl mx-4 rounded-lg shadow-lg relative">
        <button
          onClick={aoFechar}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition duration-150"
        >
          ✕
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">{carroEditado ? "Editar Carro" : "Adicionar Carro"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select
                name="idCliente"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={carro.idCliente}
                onChange={handleChange}
              >
                <option value={0}>Selecione o cliente</option>
                {queryClientes.data?.map((client) => (
                  <option key={client.idCliente} value={client.idCliente}>
                    {client.nome}
                  </option>
                ))}
              </select>
            </div>

           
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <input
                type="text"
                name="marca"
                value={carro.marca}
                onChange={handleChange}
                placeholder="Marca do Carro"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
              <input
                type="text"
                name="cor"
                value={carro.cor}
                onChange={handleChange}
                placeholder="Cor do carro"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input
                type="text"
                name="modelo"
                value={carro.modelo}
                onChange={handleChange}
                placeholder="Modelo do Carro"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
              <input
                type="text"
                name="placa"
                value={carro.placa}
                onChange={handleChange}
                placeholder="Placa do Carro"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chassis</label>
              <input
                type="text"
                name="chassis"
                value={carro.chassis}
                onChange={handleChange}
                placeholder="Número do Chassis"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Renavam</label>
              <input
                type="text"
                name="renavam"
                value={carro.renavam}
                onChange={handleChange}
                placeholder="Número do Renavam"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lotação</label>
              <input
                type="text"
                name="lotacao"
                value={carro.lotacao}
                onChange={handleChange}
                placeholder="Lotação"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desembargador</label>
              <input
                type="text"
                name="desembargador"
                value={carro.desembargador}
                onChange={handleChange}
                placeholder="Nome do Desembargador"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
              <input
                type="number"
                name="ano"
                value={carro.ano}
                onChange={handleChange}
                placeholder="Ano do Carro"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            
            <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={aoFechar}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarroForm;
