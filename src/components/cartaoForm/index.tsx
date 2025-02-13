'use client'
import { useState, useEffect } from 'react';
import { CartaoInterface } from '../../../interface';
import { useCleintes } from '../../../hooks/useClientes';
import { useCarros } from '../../../hooks/useCarros';
import { useCartoes } from '../../../hooks/useCartao';

interface CartaoFormProps {
  cartaoEditado?: CartaoInterface;
  aoFechar: () => void;
  aoSalvar: (cartao: CartaoInterface) => void;
}

const CartaoForm: React.FC<CartaoFormProps> = ({ cartaoEditado, aoFechar, aoSalvar }) => {
  const [cartao, setCartao] = useState<CartaoInterface>(
    cartaoEditado || { idCartao: 0, idCliente: 0, idCarro: 0, numeroCartao: '', saldo: 0 , senha: '', estabelcimento:'', idLavacar:0 }
  );

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  const queryClientes =  useCleintes();
  const queryCartoes = useCartoes();
  const queryCarros = useCarros();

 
  useEffect(() => {
    if (cartaoEditado) {
      setCartao(prevCartao => ({
        ...prevCartao,
        ...cartaoEditado
      }));
    }
  }, [cartaoEditado]);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCartao(prevCartao => ({
      ...prevCartao,
      [name]: name === "idCliente" || name === "idCarro" ? Number(value) : value
    }));
  };

  
  const validarSenha = (senha: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(senha);
  };

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSenha(value);

    if (!validarSenha(value)) {
      setErroSenha('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.');
    } else {
      setErroSenha('');
    }
  };

  const handleConfirmarSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmarSenha(e.target.value);
  };

 
  const carrosDisponiveis = queryCarros.data
  ? queryCarros.data.filter(
      (carro) =>
        !queryCartoes.data?.some((cartao) => cartao.idCarro === carro.idCarro) ||
        carro.idCarro === cartaoEditado?.idCarro 
    )
  : [];


  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

   
    if (!cartaoEditado) {
      if (senha !== confirmarSenha) {
        setErroSenha('As senhas não coincidem.');
        return;
      }
      if (!validarSenha(senha)) {
        setErroSenha('A senha não atende aos requisitos.');
        return;
      }
    }

    
    const cartaoParaSalvar = cartaoEditado ? { ...cartao } : { ...cartao, senha };

    aoSalvar(cartaoParaSalvar);
    aoFechar();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{cartaoEditado ? 'Editar Cartão' : 'Adicionar Cartão'}</h2>
        <form onSubmit={handleSubmit}>
      
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Número do Cartão</label>
            <input
              type="text"
              name="numeroCartao"
              value={cartao.numeroCartao}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

        
          {!cartaoEditado && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <input
                  type="password"
                  name="senha"
                  value={senha}
                  onChange={handleSenhaChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                <input
                  type="password"
                  name="confirmarSenha"
                  value={confirmarSenha}
                  onChange={handleConfirmarSenhaChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              {erroSenha && <p className="text-red-500 text-sm">{erroSenha}</p>}
            </>
          )}

          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Saldo</label>
            <input
              type="number"
              name="saldo"
              value={cartao.saldo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

        
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Cliente</label>
            <select
              name="idCliente"
              required
              className="w-full p-2 border border-gray-300 rounded"
              value={cartao.idCliente}
              onChange={handleChange}
            >
              <option value={0}>Selecione o cliente</option>
              {queryClientes.data?.map((client) => (
                <option key={client.idCliente} value={client.idCliente}>
                  {client.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Carro</label>
            <select
              name="idCarro"
              required
              className="w-full p-2 border border-gray-300 rounded"
              value={cartao.idCarro || 0} 
              onChange={handleChange}
            >
              <option value={0}>Selecione o carro</option>
              {carrosDisponiveis.map((car) => (
                <option key={car.idCarro} value={car.idCarro}>
                  {car.modelo} - {car.placa}
                </option>
              ))}
            </select>

          </div>

        
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={aoFechar} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CartaoForm;
