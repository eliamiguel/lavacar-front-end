"use client";

import { useEffect, useState } from "react";
import { EstabelecimentoInterface } from "../../../interface";

interface EstabelecimentoFormProps {
  estabelecimentoEditado?: EstabelecimentoInterface;
  aoFechar: () => void;
  aoSalvar: (estabelecimento: EstabelecimentoInterface) => void;
}

const EstabelecimentoForm: React.FC<EstabelecimentoFormProps> = ({ estabelecimentoEditado, aoFechar, aoSalvar }) => {
  const [estabelecimento, setEstabelecimento] = useState<EstabelecimentoInterface>({
    idLavacar: 0,
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
    cnpj: "",
    senhaHash: "",
    atividadePrincipal:"",
    cidade:"",
    razaoSocial:""
  });

    useEffect(() => {
      if (estabelecimentoEditado) {
        setEstabelecimento((prev) => ({
          ...prev,
          ...estabelecimentoEditado,
          telefone: estabelecimentoEditado.telefone || "", 
          cnpj: estabelecimentoEditado.cnpj || "",
          senhaHash: estabelecimentoEditado.senhaHash || "",
          cidade: estabelecimentoEditado.cidade || "",
          razaoSocial: estabelecimentoEditado.razaoSocial || "",
          atividadePrincipal: estabelecimentoEditado.atividadePrincipal || "",
        }));
      }
    }, [estabelecimentoEditado]);
 
  const formatarCNPJ = (value: string) => {
    value = value.replace(/\D/g, "");
    return value.length === 14
      ? value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
      : value;
  };

  const formatarTelefone = (value: string) => {
    value = value.replace(/\D/g, "");
    return value.length === 11
      ? value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2$3-$4")
      : value.length === 10
      ? value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
      : value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEstabelecimento((prev) => ({
      ...prev,
      [name]: name === "telefone" ? formatarTelefone(value) : name === "cnpj" ? formatarCNPJ(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const estabelecimentoFormatado: EstabelecimentoInterface = {
      ...estabelecimento,
      telefone: formatarTelefone(estabelecimento.telefone),
      cnpj: formatarCNPJ(estabelecimento.cnpj),
    };

    aoSalvar(estabelecimentoFormatado);
    aoFechar();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-4xl mx-4 rounded-lg shadow-lg relative">
    
        <button
          onClick={aoFechar}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition duration-150"
        >
          ✕
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {estabelecimentoEditado ? "Editar Credenciado" : "Adicionar Credenciado"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                name="nome"
                value={estabelecimento.nome}
                onChange={handleChange}
                placeholder="Nome do Credenciado"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                required
              />
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <input
                type="text"
                name="endereco"
                value={estabelecimento.endereco}
                onChange={handleChange}
                placeholder="Endereço"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                required
              />
            </div>

           
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="text"
                name="telefone"
                maxLength={15}
                value={estabelecimento.telefone}
                onChange={handleChange}
                placeholder="Telefone"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                required
              />
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={estabelecimento.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
              <input
                type="text"
                name="razaoSocial"
                value={estabelecimento.razaoSocial}
                onChange={handleChange}
                placeholder="Informe a razão social"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                required
              />
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Atividade Principal</label>
              <input
                type="text"
                name="atividadePrincipal"
                maxLength={14}
                value={estabelecimento.atividadePrincipal}
                onChange={handleChange}
                placeholder="Atividade principal"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
              <input
                type="text"
                name="cnpj"
                maxLength={14}
                value={estabelecimento.cnpj}
                onChange={handleChange}
                placeholder="CNPJ"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                type="text"
                name="cidade"
                value={estabelecimento.cidade}
                onChange={handleChange}
                placeholder="Digite a cidade"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                required
              />
            </div>

            
            {!estabelecimentoEditado && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  type="password"
                  name="senhaHash"
                  value={estabelecimento.senhaHash}
                  onChange={handleChange}
                  placeholder="Senha para login"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  required
                />
              </div>
            )}

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

export default EstabelecimentoForm;
