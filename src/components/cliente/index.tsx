"use client";

import { useContext, useState } from "react";
import {
  useCleintes,
  useCriarCliente,
  useExcluirCliente,
  useEditarCliente,
} from "../../../hooks/useClientes";
import ClienteForm from "../clienteForm";
import { ClienteIrteface } from "../../../interface";
import { UserContext } from "@/context/UserContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import { formatCNPJ } from "@/lib/utils";

const Clientes = () => {
  const { user } = useContext(UserContext);
  const queryClientes = useCleintes();
  const mutateCriar = useCriarCliente();
  const mutateAdicionar = useEditarCliente();
  const excluirCliente = useExcluirCliente();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteEditado, setClienteEditado] = useState<
    ClienteIrteface | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClientes = queryClientes.data?.filter(
    (cliente) =>
      cliente.nome.includes(searchTerm) ||
      cliente.cnpj.includes(searchTerm) ||
      cliente.email.includes(searchTerm) ||
      cliente.endereco.includes(searchTerm) ||
      cliente.telefone.includes(searchTerm) ||
      cliente.dataCadastro?.toString().includes(searchTerm)
  );

  const handleRecarregar = () => {
    queryClientes.refetch();
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
      alert(
        "Você não tem permissão para excluir este estabelecimento. Contate o super usuário."
      );
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
    <div className="p-6 space-y-6 md:ml-40 mt-20">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            setClienteEditado(undefined);
            setMostrarModal(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-700"
        >
          <span className="mr-2">+</span> Novo Cliente
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Busca rápida pelo cnpj, nome, email, endereço, telefone"
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
        <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4 flex flex-col">
          <thead className="flex flex-col w-full">
            <tr className="bg-gray-100 flex w-full">
              <th className="w-1/2 border">Dataos Cliente</th>
              <th className="w-1/2 border">Dados Responsável</th>
            </tr>
            <tr className="bg-gray-200 flex items-center justify-center w-full h-full">
              <th className="w-2/12">Nome</th>
              <th className="w-2/12 border">CNPJ</th>
              <th className="w-2/12">Endereço</th>
              <th className="w-2/12">Email</th>
              <th className="w-1/12">Telefone</th>
              <th className="w-1/12">Data de Cadastro</th>
              <th className="w-2/12">Ações</th>
            </tr>
          </thead>

          <tbody className="flex flex-col w-full">
            {filteredClientes && filteredClientes.length > 0 ? filteredClientes.map((cliente: ClienteIrteface) => (
              <tr
                key={cliente.idCliente}
                className="border-t hover:bg-gray-50 flex  items-stretch w-full"
              >
                <td className="w-2/12 text-center border flex items-center justify-center">
                  {cliente.nome}
                </td>
                <td className="w-2/12 text-center border flex items-center justify-center">
                  {formatCNPJ(cliente.cnpj)}
                </td>
                <td className="w-2/12 text-center border flex items-center justify-center">
                  {cliente.endereco}
                </td>
                <td className="w-2/12 text-center border flex items-center justify-center">
                  {cliente.email}
                </td>
                <td className="w-1/12 text-center border flex items-center justify-center">
                  {cliente.telefone}
                </td>
                <td className="w-1/12 text-center border flex items-center justify-center">
                  {cliente.dataCadastro
                    ? new Date(cliente.dataCadastro).toLocaleDateString("pt-BR")
                    : "Data não disponível"}
                </td>
                <td className="w-2/12 text-center border flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setClienteEditado(cliente);
                      setMostrarModal(true);
                    }}
                    className="bg-gray-700 text-white px-4 py-2 flex items-center rounded-lg hover:bg-gray-600"
                  >
                    <FaEdit className="mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluirCliente(cliente.idCliente!)}
                    className="bg-red-500 text-white flex items-center px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    <FaTrash className="mr-2" />
                    Excluir
                  </button>
                </td>
              </tr>
            )) : (
              <tr className="border-t hover:bg-gray-50 flex  items-stretch w-full">
                <td colSpan={10} className="text-center">
                  Nenhum cliente encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <ClienteForm
          clienteEditado={clienteEditado}
          aoFechar={() => setMostrarModal(false)}
          aoSalvar={handleSalvarCliente}
        />
      )}
    </div>
  );
};

export default Clientes;
