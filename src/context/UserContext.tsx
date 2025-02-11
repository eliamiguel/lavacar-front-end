
import { createContext, useEffect, useState, Dispatch, SetStateAction } from 'react';

// Interface para o objeto do usuário
export interface User {
  idUsuario: number;
    email: string;
    nome: string;
    urlImagemPerfil: string;
    tipoUsuario:string;
    nomeEstabelecimento?: string;
}

// Interface para o contexto
export interface UserContextType {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  isAdmin: boolean; // Função para verificar se o usuário é admin
  isFuncionario: boolean; // Função para verificar se o usuário é funcionario
}

export interface ContextProps {
  children: React.ReactNode;
}

// Função de placeholder para setUser
const throwError = () => {
  throw new Error("setUser foi chamado fora do UserContextProvider");
};

// Valor inicial do contexto
const initialValue: UserContextType = {
  user: undefined,
  setUser: throwError, // Substituí função vazia por throwError
  isAdmin: false,
  isFuncionario: false
};

// Criação do contexto
export const UserContext = createContext<UserContextType>(initialValue);

// Provedor do contexto
export const UserContextProvider = ({ children }: ContextProps) => {
  const [user, setUser] = useState<User | undefined>(initialValue.user);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFuncionario, setIsFuncionario] = useState(false);

  useEffect(() => {
    const UserJSON = localStorage.getItem("orcamento:user");
    if (UserJSON) {
      const parsedUser: User = JSON.parse(UserJSON);
      setUser(JSON.parse(UserJSON));

      if (parsedUser.tipoUsuario === 'admin') {
        setIsAdmin(true);
        setIsFuncionario(false);
      } else if (parsedUser.tipoUsuario === 'funcionario') {
        setIsFuncionario(true);
        setIsAdmin(false);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin, isFuncionario }}>
      {children}
    </UserContext.Provider>
  );
};
