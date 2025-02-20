"use client";

import { useState, useEffect } from "react";
import { ClienteIrteface } from "../../../interface";

interface ClienteFormProps {
  clienteEditado?: ClienteIrteface;
  aoFechar: () => void;
  aoSalvar: (cliente: ClienteIrteface) => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ clienteEditado, aoFechar, aoSalvar }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clienteEditado) {
      setNome(clienteEditado.nome || "");
      setEmail(clienteEditado.email || "");
      setTelefone(clienteEditado.telefone || "");
      setEndereco(clienteEditado.endereco || "");
      setCnpj(clienteEditado.cnpj || "");
    } else {
      setNome("");
      setEmail("");
      setTelefone("");
      setEndereco("");
      setCnpj("");
    }
  }, [clienteEditado]);

 
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !telefone || !endereco || !cnpj) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    const novoCliente: ClienteIrteface = {
      ...(clienteEditado?.idCliente !== undefined && { idCliente: clienteEditado.idCliente }),
      nome,
      email,
      telefone: formatarTelefone(telefone), 
      endereco,
      cnpj: formatarCNPJ(cnpj), 
    };

    aoSalvar(novoCliente);
    aoFechar();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity">
      <div className="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-lg relative">
        
        <button
          onClick={aoFechar}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition duration-150"
        >
          ✕
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">{clienteEditado ? "Editar Cliente" : "Adicionar Cliente"}</h2>

          
          {error && <div className="bg-red-500 text-white p-2 rounded-lg mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o nome do cliente"
                required
              />
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o email do cliente"
                required
              />
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="text"
                value={telefone}
                maxLength={11}
                onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ""))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o telefone do cliente"
                required
              />
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
              <input
                type="text"
                value={cnpj}
                maxLength={14}
                onChange={(e) => setCnpj(e.target.value.replace(/\D/g, ""))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o CNPJ do cliente"
                required
              />
            </div>

            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <input
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o endereço do cliente"
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

export default ClienteForm;
