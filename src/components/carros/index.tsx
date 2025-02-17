'use client'
import { useContext, useState } from 'react';

import { CarroInterface } from '../../../interface';
import CarroForm from '../carroForm';
import { useCarros, useCriarCarro, useEditarCarro, useExcluirCarro } from '../../../hooks/useCarros';
import { UserContext } from '@/context/UserContext';


const Carros = () => {
  const queryCarros = useCarros();
  const mutateCriar = useCriarCarro();
  const mutateEditar = useEditarCarro();
  const excluirCarro = useExcluirCarro();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [carroEditando, setCarroEditando] = useState<CarroInterface | undefined>(undefined);
  const { user } = useContext(UserContext); 
  
  const handleSalvarCarro = (carro: CarroInterface) => {

    
    if (carro.idCarro ) {
      mutateEditar.mutate({ ...carro });
    } else {
      mutateCriar.mutate({ ...carro });
    }
  };

  const handleExcluirCarro = (idCarro : number) => {
    if (user?.tipoUsuario === "admin") {
      alert("Você não tem permissão para excluir este estabelecimento. Contate o super usuário.");
      return; 
    }

    if (confirm('Tem certeza que deseja excluir este carro?')) {
      excluirCarro.mutate({ idCarro });
    }
  };

 
  if (queryCarros.isLoading){
    return(
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    </div>
    )
  }

  
  if (queryCarros.isError) {
    console.error("Erro ao carregar os dados:", queryCarros.error);
    return <div className="text-red-500">Erro ao carregar os exibir os Carros.</div>;
  }

  return (
    <div className="p-6 space-y-6 sm:ml-40">
      <h1 className="text-2xl font-bold text-gray-800 mt-20 mb-4">Carros</h1>

      <button onClick={() => { setCarroEditando(undefined); setMostrarFormulario(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Adicionar Carro
      </button>

      <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Modelo</th>
            <th className="px-4 py-2 border">Placa</th>
            <th className="px-4 py-2 border">Ano</th>
            <th className="px-4 py-2 border">Cor</th>
            <th className="px-4 py-2 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {queryCarros.data?.map((carro: CarroInterface) => (
            <tr key={carro.idCarro } className="border-t">
              <td className="px-4 py-2 text-center border">{carro.modelo}</td>
              <td className="px-4 py-2 text-center border">{carro.placa}</td>
              <td className="px-4 py-2 text-center border">{carro.ano}</td>
              <td className="px-4 py-2 text-center border">{carro.cor}</td>
              <td className="px-4 py-2 text-center border flex gap-2">
                <button
                  onClick={() => { setCarroEditando(carro); setMostrarFormulario(true); }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleExcluirCarro(carro.idCarro )}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarFormulario && <CarroForm carroEditado={carroEditando} aoFechar={() => setMostrarFormulario(false)} aoSalvar={handleSalvarCarro} />}
    </div>
  );
};

export default Carros;
