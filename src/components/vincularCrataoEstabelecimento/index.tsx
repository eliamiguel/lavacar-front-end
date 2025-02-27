import { useState } from "react";
import { useEstabelecimentos } from "../../../hooks/useEstabelecimentos";
import { EstabelecimentoInterface } from "../../../interface";
import { toast } from "react-toastify";
import { useVincularCartao } from "../../../hooks/useCartao";

interface Props {
  idCartao: number;
  idCliente: number;
}

const VincularCartaoLavacar: React.FC<Props> = ({ idCartao, idCliente }) => {
  const { data: lavacars, isLoading, isError } = useEstabelecimentos();
  const { mutate, isPending } = useVincularCartao();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleVincularCartaoLavacar = (idLavacar: number) => {
    if (!idLavacar) {
      toast.info("O Id do credenciado é obrigatório");
      setShowModal(false);
      return;
    }
    mutate({ idCartao, idCliente, idLavacar });
    setShowModal(false);
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Vincular a um Credenciado
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Escolha Credenciado</h2>

            {isLoading && <p>Carregando...</p>}
            {isError && <p className="text-red-500">Erro ao carregar lavacars.</p>}
            {!isLoading && !isError && (lavacars ?? []).length === 0 && (
              <p className="text-gray-500">Nenhum credenciado disponível.</p>
            )}

            {!isLoading && !isError && (lavacars ?? []).length > 0 && (
              <ul className="space-y-2">
                {(lavacars ?? []).map((lavacar: EstabelecimentoInterface) => (
                  <li
                    key={lavacar.idLavacar}
                    className="flex justify-between items-center p-2 border rounded-md"
                  >
                    <span>{lavacar.nome}</span>
                    <button
                      onClick={() => handleVincularCartaoLavacar(lavacar.idLavacar)}
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

export default VincularCartaoLavacar;
