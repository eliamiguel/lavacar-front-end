import { useState } from "react";
import { useVincularEstabelecimentoCliente } from "../../../hooks/useEstabelecimentos";
import { ClienteIrteface } from "../../../interface";
import { toast } from "react-toastify";
import { useCleintes } from "../../../hooks/useClientes";


interface Props {
  idLavacar :number
}

const VincularEstabelecimentoCliente: React.FC<Props> = ({idLavacar }) => {
  const { data: clienteQuery, isLoading, isError } = useCleintes();
  const { mutate, isPending } = useVincularEstabelecimentoCliente();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleVincularEstabelecimentoCliente= (idCliente: number) => {
    if (!idCliente) {
      toast.info("O Id do cliente é obrigatório");
      setShowModal(false);
      return;
    }
    
    mutate({ idCliente: Number(idCliente), idLavacar: Number(idLavacar) });
    setShowModal(false);
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Vincular credenciado a um cliente
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Escolha Cliente</h2>

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
    </div>
  );
};

export default VincularEstabelecimentoCliente;
