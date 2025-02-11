
import { useTransacao } from '../../../hooks/useTransacao';
import { TransacaoInterface } from '../../../interface';
const Transacoes = () => {
  const transacoes = useTransacao()


  return (
    <div className="p-6 space-y-6 sm:ml-40">
      <h1 className="text-2xl font-bold text-gray-800 mt-20 mb-4">Transações</h1>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Cliente</th>
            <th className="px-4 py-2">Estabelecimento</th>
            <th className="px-4 py-2">Valor Desconto</th>
            <th className="px-4 py-2">Data</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
  {transacoes.data?.map((transacao: TransacaoInterface) => (
    <tr key={transacao.idTransacao} className="border-t">
      <td className="px-4 py-2 text-center">{transacao.idTransacao}</td>
      <td className="px-4 py-2 text-center ">
        {transacao.cartao?.cliente?.nome || "Cliente Desconhecido"}
      </td>
      <td className="px-4 py-2 text-center">
        {transacao.lavacar?.nome || "Estabelecimento Desconhecido"}
      </td>
      <td className="px-4 py-2 text-center">{transacao.valorDesconto}</td>
      <td className="px-4 py-2 text-center">
        {new Date(transacao.dataTransacao).toLocaleDateString()}
      </td>
      <td className="px-4 py-2 text-center">{transacao.status}</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default Transacoes;
