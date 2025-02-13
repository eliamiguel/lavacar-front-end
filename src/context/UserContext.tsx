import { createContext, useEffect, useState, Dispatch, SetStateAction } from 'react';

export interface User {
  idLavacar?: number;
  idUsuario?: number;
  email: string;
  nome: string;
  urlImagemPerfil: string;
  tipoUsuario: string;
  nomeEstabelecimento?: string;
}

export interface UserContextType {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  isAdmin: boolean;
  isLavacar: boolean;
  logoutUser: () => void;  // Método para logout
}

export interface ContextProps {
  children: React.ReactNode;
}

const throwError = () => {
  throw new Error("setUser foi chamado fora do UserContextProvider");
};

const initialValue: UserContextType = {
  user: undefined,
  setUser: throwError, 
  isAdmin: false,
  isLavacar: false,
  logoutUser: () => {},
};

export const UserContext = createContext<UserContextType>(initialValue);

export const UserContextProvider = ({ children }: ContextProps) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLavacar, setIsLavacar] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);  // 🔥 Estado para forçar re-render

  useEffect(() => {
    const loadUser = () => {
      const UserJSON = localStorage.getItem("orcamento:user");
      if (UserJSON) {
        const parsedUser: User = JSON.parse(UserJSON);
        setUser(parsedUser);
        setIsAdmin(parsedUser.tipoUsuario === 'admin');
        setIsLavacar(!!parsedUser.idLavacar);
      } else {
        setUser(undefined);
        setIsAdmin(false);
        setIsLavacar(false);
      }
      setForceUpdate((prev) => prev + 1); // 🔥 Força a atualização
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("orcamento:user");
    setUser(undefined);
    setIsAdmin(false);
    setIsLavacar(false);
    setForceUpdate((prev) => prev + 1); // 🔥 Força a atualização ao fazer logout
  };

  return (
    <UserContext.Provider key={forceUpdate} value={{ user, setUser, isAdmin, isLavacar, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
