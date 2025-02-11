'use client'
import { useState, useEffect } from 'react';
import { ClienteIrteface } from '../../../interface';


interface ClienteFormProps {
    clienteEditado?: ClienteIrteface; // Pode ser undefined (opcional)
    aoFechar: () => void;
    aoSalvar: (cliente: ClienteIrteface) => void;
  }
  

const ClienteForm = ({ clienteEditado, aoFechar, aoSalvar }: ClienteFormProps) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [error, setError] = useState<string | null>(null);
   
  useEffect(() => {
    if (clienteEditado) {
      setNome(clienteEditado.nome || '');
      setEmail(clienteEditado.email || '');
      setTelefone(clienteEditado.telefone || '');
      setEndereco(clienteEditado.endereco || '');
      setCpf(clienteEditado.cpf || '');
  
      
      const dataFormatada = clienteEditado.dataNascimento
        ? clienteEditado.dataNascimento.split("T")[0]  
        : "";
      
      setDataNascimento(dataFormatada);
    } else {
      setNome('');
      setEmail('');
      setTelefone('');
      setEndereco('');
      setCpf('');
      setDataNascimento('');
    }
  }, [clienteEditado]);
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!nome || !email || !telefone || !endereco || !cpf || !dataNascimento) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
  
    const novoCliente: ClienteIrteface = {
      ...(clienteEditado?.idCliente !== undefined && { idCliente: clienteEditado.idCliente }),
      nome,
      email,
      telefone,
      endereco,
      cpf,
      dataNascimento: new Date(dataNascimento).toISOString() 
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
            onChange={(e) => setTelefone(e.target.value)}
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
          <label className="block text-sm font-semibold text-gray-700">CPF</label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Digite o CPF do cliente"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Data de Nascimento</label>
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
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
