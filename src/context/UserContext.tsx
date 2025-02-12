
import { createContext, useEffect, useState, Dispatch, SetStateAction } from 'react';

// Interface para o objeto do usuário
export interface User {
  idLavacar?: number;
  idUsuario?: number;
    email: string;
    nome: string;
    urlImagemPerfil: string;
    tipoUsuario:string;
    nomeEstabelecimento?: string;
}


export interface UserContextType {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  isAdmin: boolean; 
  isLavacar: boolean; 
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
};


export const UserContext = createContext<UserContextType>(initialValue);


export const UserContextProvider = ({ children }: ContextProps) => {
  const [user, setUser] = useState<User | undefined>(initialValue.user);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLavacar, setIsLavacar] = useState(false);

  useEffect(() => {
    const UserJSON = localStorage.getItem("orcamento:user");
    if (UserJSON) {
      const parsedUser: User = JSON.parse(UserJSON);
      setUser(JSON.parse(UserJSON));

      if (parsedUser.idUsuario) {
        
        if (parsedUser.tipoUsuario === 'admin') {
          setIsAdmin(true);
          setIsLavacar(false);
        } 
      } else if (parsedUser.idLavacar) {
        // ✅ Estabelecimento (Lavacar)
        setIsLavacar(true);
        setIsAdmin(false);
       
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin, isLavacar}}>
      {children}
    </UserContext.Provider>
  );
};
