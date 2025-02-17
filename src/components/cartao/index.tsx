'use client'
import { useState } from 'react';


import { CartaoInterface } from '../../../interface';
import CartaoForm from '../cartaoForm';
import { useCartoes, useCriarCartao, useEditarCartao, useExcluirCartao } from '../../../hooks/useCartao';


const Cartoes = () => {
  const queryCartoes = useCartoes();
  const mutateCriar = useCriarCartao();
  const mutateEditar = useEditarCartao();
  const excluirCartao = useExcluirCartao();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cartaoEditado, setCartaoEditado] = useState<CartaoInterface | undefined>(undefined);

  const handleSalvarCartao = (cartao: CartaoInterface) => {
    if (cartao.idCartao) {
      mutateEditar.mutate({
        idCartao: cartao.idCartao,
        idCliente: cartao.idCliente,
        idCarro: cartao.idCarro,
        numeroCartao: cartao.numeroCartao,
        saldo: cartao.saldo,
        tipoCartao:cartao.tipoCartao as "NORMAL" | "CORINGA",
      });
    } else {
  
      mutateCriar.mutate({
        idLavacar:cartao.idLavacar,
        idCliente: cartao.idCliente,
        idCarro: cartao.idCarro,
        numeroCartao: cartao.numeroCartao,
        saldo: cartao.saldo,
        senha:cartao.senha,
        tipoCartao:cartao.tipoCartao
      });
    }
  };

  const handleExcluirCartao = (idCartao: number) => {
    if (confirm('Tem certeza que deseja excluir este cartão?')) {
      excluirCartao.mutate({ idCartao });
    }
  };

  if (queryCartoes.isLoading){
    return(
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    </div>
    )
  }

  
  if (queryCartoes.isError) {
    console.error("Erro ao carregar os dados:", queryCartoes.error);
    return <div className="text-red-500">Erro ao carregar os exibir os Cartões.</div>;
  }

  return (
    <div className="p-6 space-y-6 sm:ml-40">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-20">Cartões</h1>

      <button onClick={() => { setCartaoEditado(undefined); setMostrarModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Adicionar Cartão
      </button>

      <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Número do Cartão</th>
            <th className="px-4 py-2 border">Saldo</th>
            <th className="px-4 py-2 border">Cliente</th>
            <th className="px-4 py-2 border">Carro</th>
            <th className="px-4 py-2 border">Tipo Cartão</th>
            <th className="px-4 py-2 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {queryCartoes.data?.map((cartao: CartaoInterface) => (
            <tr key={cartao.idCartao} className="border-t">
              <td className="px-4 py-2 text-center border">{cartao.numeroCartao}</td>
              <td className="px-4 py-2 text-center border">R$ {cartao.saldo.toFixed(2)}</td>
              <td className="px-4 py-2 text-center border">{cartao.idCliente}</td>
              <td className="px-4 py-2 text-center border">{cartao.idCarro}</td>
              <td className="px-4 py-2 text-center border">{cartao.tipoCartao}</td>
              <td className="px-4 py-2 text-center border flex gap-2">
                <button
                  onClick={() => { setCartaoEditado(cartao); setMostrarModal(true); }}
                  className="bg-yellow-500 text-white text-center px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleExcluirCartao(cartao.idCartao!)}
                  className="bg-red-500 text-white text-center px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Excluir
                </button>

                {/*<VincularCartaoLavacar idCartao={cartao.idCartao} idCliente={cartao.idCliente} />*/}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && <CartaoForm cartaoEditado={cartaoEditado} aoFechar={() => setMostrarModal(false)} aoSalvar={handleSalvarCartao} />}
    </div>
  );
};

export default Cartoes;
