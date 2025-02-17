'use client'
import { useState, useEffect } from 'react';
import { ClienteIrteface } from '../../../interface';

interface ClienteFormProps {
  clienteEditado?: ClienteIrteface;
  aoFechar: () => void;
  aoSalvar: (cliente: ClienteIrteface) => void;
}

const ClienteForm = ({ clienteEditado, aoFechar, aoSalvar }: ClienteFormProps) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clienteEditado) {
      setNome(clienteEditado.nome || '');
      setEmail(clienteEditado.email || '');
      setTelefone(clienteEditado.telefone || '');
      setEndereco(clienteEditado.endereco || '');
      setCnpj(clienteEditado.cnpj || '');
    } else {
      setNome('');
      setEmail('');
      setTelefone('');
      setEndereco('');
      setCnpj('');
    }
  }, [clienteEditado]);

  // 🔥 Formata o CNPJ antes de salvar
  const formatarCNPJ = (value: string) => {
    value = value.replace(/\D/g, ""); // Remove tudo que não for número

    if (value.length === 14) {
      return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }

    return value; // Se não tiver 14 dígitos, retorna sem formatação
  };

  // 🔥 Formata o telefone antes de salvar
  const formatarTelefone = (value: string) => {
    value = value.replace(/\D/g, ""); // Remove tudo que não for número

    if (value.length === 11) { // Celular (11 dígitos)
      return value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2$3-$4");
    } else if (value.length === 10) { // Fixo (10 dígitos)
      return value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    return value; // Se não tiver 10 ou 11 dígitos, retorna sem formatação
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !telefone || !endereco || !cnpj) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    // 🔥 Formata os dados antes de salvar
    const cnpjFormatado = formatarCNPJ(cnpj);
    const telefoneFormatado = formatarTelefone(telefone);

    const novoCliente: ClienteIrteface = {
      ...(clienteEditado?.idCliente !== undefined && { idCliente: clienteEditado.idCliente }),
      nome,
      email,
      telefone: telefoneFormatado, // Salva o telefone formatado
      endereco,
      cnpj: cnpjFormatado, // Salva o CNPJ formatado
    };

    aoSalvar(novoCliente);
    aoFechar();
  };

  return (
    <div className="p-6 mx-auto fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-md md:w-[40vw] mx-auto">
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {clienteEditado ? 'Editar Cliente' : 'Adicionar Cliente'}
          </h1>
          <button className="bg-red-500 text-white p-2 rounded-lg" onClick={aoFechar}>
            X
          </button>
        </div>
        {error && <div className="bg-red-500 text-white p-2 rounded-lg mb-4">{error}</div>}

        <div>
          <label className="block text-sm font-semibold text-gray-700">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Digite o nome do cliente"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Digite o email do cliente"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Telefone</label>
          <input
            type="text"
            value={telefone}
            maxLength={11} // Limita a 11 dígitos
            onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ""))} // Permite apenas números
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Digite o telefone do cliente"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Endereço</label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Digite o endereço do cliente"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">CNPJ</label>
          <input
            type="text"
            value={cnpj}
            maxLength={14} // Permite apenas 14 números
            onChange={(e) => setCnpj(e.target.value.replace(/\D/g, ""))} // Apenas números enquanto digita
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Digite o CNPJ do cliente"
          />
        </div>

        <div>
          <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            {clienteEditado ? 'Salvar Alterações' : 'Adicionar Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;
