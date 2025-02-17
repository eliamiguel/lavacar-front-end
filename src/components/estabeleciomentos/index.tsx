'use client'
import { useContext, useState } from 'react';


import EstabelecimentoForm from '../estabelecimentoForm';
import { EstabelecimentoInterface } from '../../../interface';
import { useCriarEstabelecimento, useEditarEstabelecimento, useEstabelecimentos, useExcluirEstabelecimento} from '../../../hooks/useEstabelecimentos';
import VincularEstabelecimentoCliente from '../vincularEstabelecimentoAocliente';
import { UserContext } from '@/context/UserContext';

const Estabelecimentos = () => {
  const queryEstabelecimentos = useEstabelecimentos();
  const mutateCriar = useCriarEstabelecimento();
  const mutateEditar = useEditarEstabelecimento();
  const excluirEstabelecimento = useExcluirEstabelecimento();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [estabelecimentoEditando, setEstabelecimentoEditando] = useState<EstabelecimentoInterface | undefined>(undefined);
  const { user } = useContext(UserContext); 
  
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
      return; // Impede a exclusão
    }


    if (confirm('Tem certeza que deseja excluir este estabelecimento?')) {
      excluirEstabelecimento.mutate({idLavacar});
    }
  };

  if (queryEstabelecimentos.isLoading){
    return(
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    </div>
    )
  }

  
  if (queryEstabelecimentos.isError) {
    console.error("Erro ao carregar os dados:", queryEstabelecimentos.error);
    return <div className="text-red-500">Erro ao carregar os exibir os Estabelecimentos.</div>;
  }
    

  return (
    <div className="p-6 space-y-6 sm:ml-40">
      <h1 className="text-2xl font-bold text-gray-800 mt-20 mb-4">Credenciados</h1>

      <button onClick={() => { setEstabelecimentoEditando(undefined); setMostrarFormulario(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Adicionar Credenciado
      </button>

      <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Nome</th>
            <th className="px-4 py-2 border">Endereço</th>
            <th className="px-4 py-2 border">Telefone</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">CNPJ</th>
            <th className="px-4 py-2 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {queryEstabelecimentos.data?.map((estabelecimento: EstabelecimentoInterface) =>{
            return(
                
                    <tr key={estabelecimento.idLavacar} className="border-t">
                      <td className="px-4 py-2 border">{estabelecimento.nome}</td>
                      <td className="px-4 py-2 border">{estabelecimento.endereco}</td>
                      <td className="px-4 py-2 border">{estabelecimento.telefone}</td>
                      <td className="px-4 py-2 border">{estabelecimento.email}</td>
                      <td className="px-4 py-2 border">{estabelecimento.cnpj}</td>
                      <td className="px-4 py-2 border flex gap-2">
                        <button
                          onClick={() => { setEstabelecimentoEditando(estabelecimento); setMostrarFormulario(true); }}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                        >
                          Editar
                        </button>
                      
                        <button
                          onClick={() => handleExcluirEstabelecimento(estabelecimento.idLavacar)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg desable hover:bg-red-600"
                           >
                          Excluir
                        </button>
                        <VincularEstabelecimentoCliente  idLavacar={estabelecimento.idLavacar} />
                      </td>
                    </tr>
            )
          })}
        </tbody>
      </table>

      {mostrarFormulario && <EstabelecimentoForm estabelecimentoEditado={estabelecimentoEditando} aoFechar={() => setMostrarFormulario(false)} aoSalvar={handleSalvarEstabelecimento} />}
    </div>
  );
};

export default Estabelecimentos;
