import { createContext, useEffect, useState, Dispatch, SetStateAction } from "react";

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
  logoutUser: () => void;
}

export interface ContextProps {
  children: React.ReactNode;
}

const initialValue: UserContextType = {
  user: undefined,
  setUser: () => {}, 
  isAdmin: false,
  isLavacar: false,
  logoutUser: () => {},
};

export const UserContext = createContext<UserContextType>(initialValue);

export const UserContextProvider = ({ children }: ContextProps) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLavacar, setIsLavacar] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      try {
        const userJSON = sessionStorage.getItem("perfil:user");

        if (userJSON) {
          const parsedUser: User = JSON.parse(userJSON);
          setUser(parsedUser);
          setIsAdmin(parsedUser.tipoUsuario === "admin");
          setIsLavacar(!!parsedUser.idLavacar);
        } else {
          setUser(undefined);
          setIsAdmin(false);
          setIsLavacar(false);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário do sessionStorage:", error);
        setUser(undefined);
      }
    };

    loadUser();

    // Adicionando um evento para escutar mudanças no sessionStorage
    window.addEventListener("perfilAtualizado", loadUser);

    return () => window.removeEventListener("perfilAtualizado", loadUser);
  }, []);

  const logoutUser = () => {
    sessionStorage.removeItem("perfil:user");
    setUser(undefined);
    setIsAdmin(false);
    setIsLavacar(false);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin, isLavacar, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
