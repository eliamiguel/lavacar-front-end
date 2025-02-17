'use client'
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
    senhaHash: ""
  });

  
  useEffect(() => {
    if (estabelecimentoEditado) {
      setEstabelecimento(estabelecimentoEditado);
    }
  }, [estabelecimentoEditado]);

  
  const formatarCNPJ = (value: string) => {
    value = value.replace(/\D/g, ""); 
    if (value.length === 14) {
      return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    return value; 
  };

  
  const formatarTelefone = (value: string) => {
    value = value.replace(/\D/g, ""); 
    if (value.length === 11) { 
      return value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2$3-$4");
    } else if (value.length === 10) { 
      return value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return value; 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "telefone" || name === "cnpj") {
      setEstabelecimento((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") })); 
    } else {
      setEstabelecimento((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

   
    const cnpjFormatado = formatarCNPJ(estabelecimento.cnpj);
    const telefoneFormatado = formatarTelefone(estabelecimento.telefone);

    const estabelecimentoFormatado: EstabelecimentoInterface = {
      ...estabelecimento,
      telefone: telefoneFormatado, 
      cnpj: cnpjFormatado 
    };

    aoSalvar(estabelecimentoFormatado);
    aoFechar();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {estabelecimentoEditado ? "Editar Credenciado" : "Adicionar Credenciado"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nome"
            value={estabelecimento.nome}
            onChange={handleChange}
            placeholder="Nome"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="endereco"
            value={estabelecimento.endereco}
            onChange={handleChange}
            placeholder="Endereço"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="telefone"
            maxLength={11} 
            value={estabelecimento.telefone}
            onChange={handleChange}
            placeholder="Telefone"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={estabelecimento.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="cnpj"
            maxLength={14}
            value={estabelecimento.cnpj}
            onChange={handleChange}
            placeholder="CNPJ"
            className="w-full border p-2 rounded"
            required
          />
          {!estabelecimentoEditado && (
            <input
              type="password"
              name="senhaHash"
              value={estabelecimento.senhaHash}
              onChange={handleChange}
              placeholder="Senha para login"
              className="w-full border p-2 rounded"
              required
            />
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={aoFechar} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstabelecimentoForm;
