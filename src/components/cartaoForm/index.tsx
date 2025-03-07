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
  const [cartao, setCartao] = useState<CartaoInterface>(() => ({
    idCartao: 0,
    idCliente: 0,
    idCarro: 0,
    idLavacar: 0,
    estabelcimento: '',
    numeroCartao: '',
    quantidadeServicosMensais: 0,
    senha: '',
    clienteNome: '', 
    carroModelo: '', 
    carroPlaca: '', 
    mensagem: undefined,
    sucesso: undefined,
    confirmSenha: '',
    idLavacarLogado: undefined,
    tipoCartao: 'NORMAL'
  }));
  

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  const queryClientes =  useCleintes();
  const queryCartoes = useCartoes();
  const queryCarros = useCarros();

 
  useEffect(() => {
    if (cartaoEditado) {
    
  
      setCartao((prevCartao) => ({
        ...prevCartao,
        ...cartaoEditado,
        clienteNome: cartaoEditado.clienteNome || '',
        carroModelo: cartaoEditado.carroModelo || '',
        carroPlaca: cartaoEditado.carroPlaca || '',
        mensagem: cartaoEditado.mensagem || undefined,
        sucesso: cartaoEditado.sucesso || undefined,
        confirmSenha: cartaoEditado.confirmSenha || '',
        idLavacarLogado: cartaoEditado.idLavacarLogado || undefined
      }));
    }
  }, [cartaoEditado]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setCartao((prevCartao) => ({
      ...prevCartao,
      [name]: name === "idCliente" || name === "idCarro" || name === "quantidadeServicosMensais"
        ? Number(value) || 0 
        : value || "" 
    }));
  };
  
  

  
  const validarSenha = (senha: string) => {
    const regex = /^\d{6}$/;
    return regex.test(senha);
  };

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSenha(value);

    if (!validarSenha(value)) {
      setErroSenha('A senha deve ter pelo menos 6 numeros');
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
    <div className="fixed p-3 inset-0 mt-20 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
    <h2 className="text-2xl font-bold mb-6">{cartaoEditado ? 'Editar Cartão' : 'Adicionar Cartão'}</h2>
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
        <input
          type="text"
          name="numeroCartao"
          value={cartao.numeroCartao}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cartão</label>
        <select
          name="tipoCartao"
          value={cartao.tipoCartao || "NORMAL"}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="NORMAL">Normal (Limite: 2)</option>
          <option value="CORINGA">Coringa (Sem Limite)</option>
        </select>
      </div>

      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Saldo</label>
        <input
          type="number"
          name="quantidadeServicosMensais"
          value={cartao.quantidadeServicosMensais ?? 0}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
        <select
          name="idCliente"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

      {/* Carro */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Carro</label>
        <select
          name="idCarro"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

      {/* Senha e Confirmação */}
      {!cartaoEditado && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              name="senha"
              value={senha}
              placeholder='exemplo: Teste@123'
              onChange={handleSenhaChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
            <input
              type="password"
              name="confirmarSenha"
              value={confirmarSenha}
              onChange={handleConfirmarSenhaChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {erroSenha && <p className="text-red-500 text-sm col-span-2">{erroSenha}</p>}
        </>
      )}
      
      {/* Botões de Ação */}
      <div className="col-span-2 flex justify-end space-x-4 mt-4">
        <button
          type="button"
          onClick={aoFechar}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Salvar
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default CartaoForm;
