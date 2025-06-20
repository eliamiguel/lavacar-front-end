import { useState } from "react";
import { useVincularEstabelecimentoCliente, useDesvincularEstabelecimentoCliente } from "../../../hooks/useEstabelecimentos";
import { ClienteIrteface } from "../../../interface";
import { toast } from "react-toastify";
import { useCleintes } from "../../../hooks/useClientes";


interface Props {
  idLavacar :number
  clientesVinculados?: { idCliente: number; nome: string }[]
}

const VincularEstabelecimentoCliente: React.FC<Props> = ({idLavacar, clientesVinculados = [] }) => {
  const { data: clienteQuery, isLoading, isError } = useCleintes();
  const { mutate: vincular, isPending: isVincularPending } = useVincularEstabelecimentoCliente();
  const { mutate: desvincular, isPending: isDesvincularPending } = useDesvincularEstabelecimentoCliente();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDesvincularModal, setShowDesvincularModal] = useState<boolean>(false);

  const handleVincularEstabelecimentoCliente= (idCliente: number) => {
    if (!idCliente) {
      toast.info("O Id do cliente é obrigatório");
      setShowModal(false);
      return;
    }
    
    vincular({ idCliente: Number(idCliente), idLavacar: Number(idLavacar) });
    setShowModal(false);
  };

  const handleDesvincularEstabelecimentoCliente = (idCliente: number) => {
    if (!idCliente) {
      toast.info("O Id do cliente é obrigatório");
      setShowDesvincularModal(false);
      return;
    }
    
    desvincular({ idCliente: Number(idCliente), idLavacar: Number(idLavacar) });
    setShowDesvincularModal(false);
  };

  const isPending = isVincularPending || isDesvincularPending;

  return (
    <div className="flex gap-2">
      {clientesVinculados.length === 0 && (
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-2 py-2 rounded-md hover:bg-blue-600 transition"
          disabled={isPending}
        >
          Vincular ao cliente
        </button>
      )}

      {clientesVinculados.length > 0 && (
        <button
          onClick={() => setShowDesvincularModal(true)}
          className="bg-red-500 text-white px-2 py-2 rounded-md hover:bg-red-600 transition"
          disabled={isPending}
        >
          Desvincular
        </button>
      )}

      {/* Modal para Vincular */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Escolha Cliente para Vincular</h2>

            {isLoading && <p>Carregando...</p>}
            {isError && <p className="text-red-500">Erro ao carregar cliente.</p>}
            {!isLoading && !isError && (clienteQuery ?? []).length === 0 && (
              <p className="text-gray-500">Nenhum cliente disponível.</p>
            )}

            {!isLoading && !isError && (clienteQuery ?? []).length > 0 && (
              <ul className="space-y-2">
                {(clienteQuery ?? []).map((cliente: ClienteIrteface) => (
                  <li
                    key={cliente.idCliente}
                    className="flex justify-between items-center p-2 border rounded-md"
                  >
                    <span>{cliente.nome}</span>
                    <button
                      onClick={() => handleVincularEstabelecimentoCliente(Number(cliente.idCliente))}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                      disabled={isPending}
                    >
                      {isPending ? "Vinculando..." : "Vincular"}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal para Desvincular */}
      {showDesvincularModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Escolha Cliente para Desvincular</h2>

            {clientesVinculados.length === 0 && (
              <p className="text-gray-500">Nenhum cliente vinculado.</p>
            )}

            {clientesVinculados.length > 0 && (
              <ul className="space-y-2">
                {clientesVinculados.map((cliente) => (
                  <li
                    key={cliente.idCliente}
                    className="flex justify-between items-center p-2 border rounded-md"
                  >
                    <span>{cliente.nome}</span>
                    <button
                      onClick={() => handleDesvincularEstabelecimentoCliente(cliente.idCliente)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                      disabled={isPending}
                    >
                      {isPending ? "Desvinculando..." : "Desvincular"}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setShowDesvincularModal(false)}
              className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VincularEstabelecimentoCliente;
