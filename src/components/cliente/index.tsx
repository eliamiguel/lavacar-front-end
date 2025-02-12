'use client'
import { useContext, useState } from 'react';
import { useCleintes, useCriarCliente, useExcluirCliente,useEditarCliente } from '../../../hooks/useClientes';
import ClienteForm from '../clienteForm';
import { ClienteIrteface } from '../../../interface';
import { UserContext } from '@/context/UserContext';

const Clientes = () => {
  const{user} = useContext(UserContext)
  const queryClientes = useCleintes();
  const mutateCriar = useCriarCliente();
  const mutateAdicionar = useEditarCliente();
  const excluirCliente = useExcluirCliente();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteEditado, setClienteEditado] = useState<ClienteIrteface | undefined>(undefined);

  const handleSalvarCliente = (cliente: ClienteIrteface) => {
    if (cliente.idCliente) {
      mutateAdicionar.mutate({cnpj:cliente.cnpj,
        email:cliente.email,
        endereco:cliente.endereco,
        idCliente:cliente.idCliente,
        nome:cliente.nome,
        telefone:cliente.telefone
      })
    } else {
      mutateCriar.mutate({
       idUsuario:Number(user?.idUsuario),
        cnpj:cliente.cnpj,
        email:cliente.email,
        endereco:cliente.endereco,
        nome:cliente.nome,
        telefone:cliente.telefone
      });
    }
  };

  const handleExcluirCliente = (idCliente: number) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      excluirCliente.mutate({idCliente});
    }
  };

  if (queryClientes.isLoading){
    return(
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    </div>
    )
  }

  
  if (queryClientes.isError) {
    console.error("Erro ao carregar os dados:", queryClientes.error);
    return <div className="text-red-500">Erro ao carregar os exibir os Clientes.</div>;
  }

  return (
    <div className="p-6 space-y-6 sm:ml-40">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-20">Clientes</h1>

      <button onClick={() => { setClienteEditado(undefined); setMostrarModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Adicionar Cliente
      </button>

      <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
      <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Orgão</th>
            <th className="px-4 py-2 border">CNPJ</th>
            <th className="px-4 py-2 border">Endereço</th>
            <th colSpan={4} className="px-4 py-2 border text-center">Responsável</th>
           
          </tr>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border"></th>
            <th className="px-4 py-2 border"></th>
            <th className="px-4 py-2 border"></th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Telefone</th>
            <th className="px-4 py-2 border">Data de Cadastro</th>
            <th className="px-4 py-2 border">Ações</th>
          </tr>
        </thead>

        <tbody>
            {queryClientes.data?.map((cliente: ClienteIrteface) => (
              <tr key={cliente.idCliente} className="border-t">
                <td className="px-4 py-2 text-center border">{cliente.nome}</td>
                <td className="px-4 py-2 text-center border">{cliente.cnpj}</td>
                <td className="px-4 py-2 text-center border">{cliente.endereco}</td>
                <td className="px-4 py-2 text-center border">{cliente.email}</td>
                <td className="px-4 py-2 text-center border">{cliente.telefone}</td>
                <td className="px-4 py-2 text-center border">
                  {cliente.dataCadastro ? new Date(cliente.dataCadastro).toLocaleDateString('pt-BR') : 'Data não disponível'}
                </td>
                <td className="px-4 py-2 text-center border flex gap-2">
                  <button
                    onClick={() => { setClienteEditado(cliente); setMostrarModal(true); }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluirCliente(cliente.idCliente!)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

      </table>

      {mostrarModal && <ClienteForm clienteEditado={clienteEditado} aoFechar={() => setMostrarModal(false)} aoSalvar={handleSalvarCliente} />}
    </div>
  );
};

export default Clientes;
