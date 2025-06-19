"use client";

import { useContext, useState } from "react";
import { FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa"; // Ícone de "check"
import EstabelecimentoForm from "../estabelecimentoForm";
import { EstabelecimentoInterface } from "../../../interface";
import {
  useCriarEstabelecimento,
  useEditarEstabelecimento,
  useEstabelecimentos,
  useExcluirEstabelecimento,
} from "../../../hooks/useEstabelecimentos";
import VincularEstabelecimentoCliente from "../vincularEstabelecimentoAocliente";
import { UserContext } from "@/context/UserContext";

const Estabelecimentos = () => {
  const queryEstabelecimentos = useEstabelecimentos();
  const mutateCriar = useCriarEstabelecimento();
  const mutateEditar = useEditarEstabelecimento();
  const excluirEstabelecimento = useExcluirEstabelecimento();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [estabelecimentoEditando, setEstabelecimentoEditando] = useState<EstabelecimentoInterface | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(UserContext);

  const filteredEstabelecimentos = queryEstabelecimentos.data?.filter(
    (estabelecimento) =>
      estabelecimento.nome.includes(searchTerm) ||
      estabelecimento.cnpj.includes(searchTerm) ||
      estabelecimento.email.includes(searchTerm) ||
      estabelecimento.razaoSocial?.includes(searchTerm) ||
      estabelecimento.atividadePrincipal?.includes(searchTerm) ||
      estabelecimento.cidade?.includes(searchTerm) ||
      estabelecimento.endereco?.includes(searchTerm) ||
      estabelecimento.telefone?.includes(searchTerm)
  );

  const vinculados = queryEstabelecimentos.data?.filter(
    (e) => (e.clientesVinculados ?? []).length > 0
  ).length || 0;
  const naoVinculados = queryEstabelecimentos.data?.filter(
    (e) => (e.clientesVinculados ?? []).length === 0
  ).length || 0;

  const handleRecarregar = () => {
    queryEstabelecimentos.refetch();
  };

  const handleSalvarEstabelecimento = (estabelecimento: EstabelecimentoInterface) => {
    if (estabelecimento.idLavacar) {
      mutateEditar.mutate({ ...estabelecimento });
    } else {
      mutateCriar.mutate({ ...estabelecimento });
    }
  };

  const handleExcluirEstabelecimento = (idLavacar: number) => {
    if (user?.tipoUsuario === "admin") {
      alert("Você não tem permissão para excluir este estabelecimento. Contate o super usuário.");
      return;
    }

    if (confirm("Tem certeza que deseja excluir este estabelecimento?")) {
      excluirEstabelecimento.mutate({ idLavacar });
    }
  };

  if (queryEstabelecimentos.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (queryEstabelecimentos.isError) {
    console.error("Erro ao carregar os dados:", queryEstabelecimentos.error);
    return <div className="text-red-500">Erro ao carregar os estabelecimentos.</div>;
  }

  return (
    <div className="p-6 space-y-6 md:ml-40 mt-20">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-gray-800 font-semibold">
          <span className="border-b-4 border-black pb-2">
            Todos{" "}
            <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
              {queryEstabelecimentos.data?.length || 0}
            </span>
          </span>
          <span>
            Vinculados{" "}
            <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
              {vinculados}
            </span>
          </span>
          <span>
            Não Vinculados{" "}
            <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
              {naoVinculados}
            </span>
          </span>
        </div>

        <button
          onClick={() => {
            setEstabelecimentoEditando(undefined);
            setMostrarFormulario(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-700 mt-4 md:mt-0"
        >
          <span className="mr-2">+</span> Novo Credenciado
        </button>
      </div>

     
      <div className="bg-gray-100 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Busca rápida pelo nome, cnpj, email, razao social, atividade principal, cidade, endereço, telefone"
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
              <th className="px-4 py-2 border">Nome</th>
              <th className="px-4 py-2 border">Endereço</th>
              <th className="px-4 py-2 border">Telefone</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">CNPJ</th>
              <th className="px-4 py-2 border">Razão Social</th>
              <th className="px-4 py-2 border">Atividade Principal</th>
              <th className="px-4 py-2 border">Cidade</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredEstabelecimentos?.map((estabelecimento) => {
              const jaVinculado = (estabelecimento.clientesVinculados ?? []).length > 0;
              return (
                <tr key={estabelecimento.idLavacar} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border">{estabelecimento.nome}</td>
                  <td className="px-4 py-2 border">{estabelecimento.endereco}</td>
                  <td className="px-4 py-2 border">{estabelecimento.telefone}</td>
                  <td className="px-4 py-2 border">{estabelecimento.email}</td>
                  <td className="px-4 py-2 border">{estabelecimento.cnpj}</td>
                  <td className="px-4 py-2 border">{estabelecimento.razaoSocial}</td>
                  <td className="px-4 py-2 border">{estabelecimento.atividadePrincipal}</td>
                  <td className="px-4 py-2 border">{estabelecimento.cidade}</td>
                  
                  <td className="px-4 py-2 border text-center">
                    {jaVinculado ? (
                      <div className="flex items-center justify-center text-green-600">
                        <FaCheckCircle className="mr-2" /> Já Vinculado
                      </div>
                    ) : (
                      <VincularEstabelecimentoCliente idLavacar={estabelecimento.idLavacar} />
                    )}
                  </td>
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEstabelecimentoEditando(estabelecimento);
                        setMostrarFormulario(true);
                      }}
                      className="bg-gray-700 flex items-center text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      <FaEdit className="mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluirEstabelecimento(estabelecimento.idLavacar)}
                      className="bg-red-500 flex items-center text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      <FaTrash className="mr-2" />
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {mostrarFormulario && (
        <EstabelecimentoForm
          estabelecimentoEditado={estabelecimentoEditando}
          aoFechar={() => setMostrarFormulario(false)}
          aoSalvar={handleSalvarEstabelecimento}
        />
      )}
    </div>
  );
};

export default Estabelecimentos;
