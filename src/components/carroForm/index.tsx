'use client'
import { useState } from 'react';
import { CarroInterface } from '../../../interface';
import { useCleintes } from '../../../hooks/useClientes';


interface CarroFormProps {
  carroEditado?: CarroInterface;
  aoFechar: () => void;
  aoSalvar: (carro: CarroInterface) => void;
}

const CarroForm: React.FC<CarroFormProps> = ({ carroEditado, aoFechar, aoSalvar }) => {
  const queryClientes = useCleintes();
  const [carro, setCarro] = useState<CarroInterface>(
    carroEditado || { idCarro: 0, idCliente: 0, modelo: '', placa: '', ano: new Date().getFullYear(), cor: '' }
  );
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCarro((prev: CarroInterface) => ({
      ...prev,
      [name]: name === 'ano' || name === 'idCliente' ? Number(value) : value,
    }));
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    aoSalvar(carro);
    aoFechar();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">{carroEditado ? 'Editar Carro' : 'Adicionar Carro'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Cliente</label>
            <select
              name="idCliente"
              required
              className="w-full p-2 border border-gray-300 rounded"
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
          <input type="text" name="modelo" value={carro.modelo} onChange={handleChange} placeholder="Modelo" className="w-full border p-2 rounded" required />
          <input type="text" name="placa" value={carro.placa} onChange={handleChange} placeholder="Placa" className="w-full border p-2 rounded" required />
          <input type="number" name="ano" value={carro.ano} onChange={handleChange} placeholder="Ano" className="w-full border p-2 rounded" required />
          <input type="text" name="cor" value={carro.cor} onChange={handleChange} placeholder="Cor" className="w-full border p-2 rounded" required />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={aoFechar} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarroForm;
