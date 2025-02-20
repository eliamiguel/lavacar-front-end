"use client";

import { useContext, useState,  } from "react";
import { useCleintes, useCriarCliente, useExcluirCliente, useEditarCliente } from "../../../hooks/useClientes";
import ClienteForm from "../clienteForm";
import { ClienteIrteface } from "../../../interface";
import { UserContext } from "@/context/UserContext";

const Clientes = () => {
  const { user } = useContext(UserContext);
  const queryClientes = useCleintes();
  const mutateCriar = useCriarCliente();
  const mutateAdicionar = useEditarCliente();
  const excluirCliente = useExcluirCliente();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteEditado, setClienteEditado] = useState<ClienteIrteface | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtragem dos clientes com base na busca
  const filteredClientes = queryClientes.data?.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cnpj.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecarregar = () => {
    queryClientes.refetch(); // Recarrega os dados
  };

  const handleSalvarCliente = (cliente: ClienteIrteface) => {
    if (cliente.idCliente) {
      mutateAdicionar.mutate({
        cnpj: cliente.cnpj,
        email: cliente.email,
        endereco: cliente.endereco,
        idCliente: cliente.idCliente,
        nome: cliente.nome,
        telefone: cliente.telefone,
      });
    } else {
      mutateCriar.mutate({
        idUsuario: Number(user?.idUsuario),
        cnpj: cliente.cnpj,
        email: cliente.email,
        endereco: cliente.endereco,
        nome: cliente.nome,
        telefone: cliente.telefone,
      });
    }
  };

  const handleExcluirCliente = (idCliente: number) => {
    if (user?.tipoUsuario === "admin") {
      alert("Você não tem permissão para excluir este estabelecimento. Contate o super usuário.");
      return;
    }

    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      excluirCliente.mutate({ idCliente });
    }
  };

  if (queryClientes.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (queryClientes.isError) {
    console.error("Erro ao carregar os dados:", queryClientes.error);
    return <div className="text-red-500">Erro ao carregar os clientes.</div>;
  }

  return (
    <div className="p-6 space-y-6 sm:ml-40 mt-20">
      {/* Cabeçalho com Abas */}
      <div className="flex justify-between items-center mb-6">
       

        {/* Botão Adicionar Cliente */}
        <button
          onClick={() => { setClienteEditado(undefined); setMostrarModal(true); }}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-700"
        >
          <span className="mr-2">+</span> Novo Cliente
        </button>
      </div>

      {/* Barra de Busca e Botão de Recarregar */}
      <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
        {/* Campo de Busca */}
        <input
          type="text"
          placeholder="Busca rápida"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-1/3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        
        {/* Botão Recarregar */}
        <button
          onClick={handleRecarregar}
          className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center"
        >
          🔄 Recarregar
        </button>
      </div>

      {/* Tabela */}
      <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Órgão</th>
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
          {filteredClientes?.map((cliente: ClienteIrteface) => (
            <tr key={cliente.idCliente} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 text-center border">{cliente.nome}</td>
              <td className="px-4 py-2 text-center border">{cliente.cnpj}</td>
              <td className="px-4 py-2 text-center border">{cliente.endereco}</td>
              <td className="px-4 py-2 text-center border">{cliente.email}</td>
              <td className="px-4 py-2 text-center border">{cliente.telefone}</td>
              <td className="px-4 py-2 text-center border">
                {cliente.dataCadastro ? new Date(cliente.dataCadastro).toLocaleDateString("pt-BR") : "Data não disponível"}
              </td>
              <td className="px-4 py-2 text-center border flex justify-center gap-2">
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

      {/* Modal */}
      {mostrarModal && <ClienteForm clienteEditado={clienteEditado} aoFechar={() => setMostrarModal(false)} aoSalvar={handleSalvarCliente} />}
    </div>
  );
};

export default Clientes;
