import { createContext, useEffect, useState, Dispatch, SetStateAction } from "react";


  
export interface Carro {
  idCarro: number;
  placa: string;
  modelo: string;
  ano: number;
  cor?: string;
  marca?: string;
}
  export interface Cartao {
    idCartao: number;
    numeroCartao: string;
    tipoCartao: 'NORMAL' | 'CORINGA';
    quantidadeServicosMensais: number;
    limiteSaldo?: number;
    carro?: {
      placa: string;
      modelo: string;
    } | null;
  }
  
// Interface simplificada para dados do cliente no token
export interface ClienteToken {
  idCliente: number;
  nome: string;
}

// Interface completa para dados do cliente na API
export interface Cliente {
  idCliente: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cnpj: string;
  carros: Carro[];
  cartoes: Cartao[];
}

// Interface do usuário atualizada
export interface User {
  idLavacar?: number;
  idUsuario?: number;
  email: string;
  nome: string;
  telefone?: string;
  cnpj?: string;
  endereco?: string;
  atividadePrincipal?: string;
  ramoAtuacao?: string;
  razaoSocial?: string;
  cidade?: string;
  urlImagemPerfil: string;
  tipoUsuario: string;
  nomeEstabelecimento?: string;
  cliente?: Cliente | null; // Informações do cliente vinculado (usuário)
  clientes?: Cliente[]; // Lista de clientes (estabelecimento)
}

// Interface do contexto atualizada
export interface UserContextType {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  isAdmin: boolean;
  isLavacar: boolean;
  isClient: boolean;
  hasClientData: boolean;
  logoutUser: () => void;
  loginUser: (userData: User, authToken?: string, responseData?: Record<string, unknown>) => void;
}

export interface ContextProps {
  children: React.ReactNode;
}

const initialValue: UserContextType = {
  user: undefined,
  setUser: () => {},
  token: null,
  setToken: () => {},
  isAdmin: false,
  isLavacar: false,
  isClient: false,
  hasClientData: false,
  logoutUser: () => {},
  loginUser: () => {},
};

export const UserContext = createContext<UserContextType>(initialValue);

export const UserContextProvider = ({ children }: ContextProps) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLavacar, setIsLavacar] = useState(false);

  const [hasClientData, setHasClientData] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Função para decodificar JWT (básica, sem verificação de assinatura)
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar JWT:', error);
      return null;
    }
  };

 
  const loginUser = (userData: User, authToken?: string, responseData?: Record<string, unknown>) => {
    let finalToken = authToken;
    
    if (!finalToken && responseData?.tokens && typeof responseData.tokens === 'object') {
      const tokens = responseData.tokens as Record<string, unknown>;
      if (tokens.accessToken && typeof tokens.accessToken === 'string') {
        finalToken = tokens.accessToken;
      }
    }
    
    if (!finalToken && typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const accessTokenCookie = cookies.find(cookie => 
        cookie.trim().startsWith('accessToken=')
      );
      if (accessTokenCookie) {
        finalToken = accessTokenCookie.split('=')[1];
      }
    }

    if (!finalToken || finalToken === 'undefined') {
      console.error('Nenhum token válido encontrado');
      return;
    }

    const tokenPayload = decodeJWT(finalToken);
    
    if (tokenPayload) {
      
      const completeUserData: User = {
        ...userData,
       
        cliente: (tokenPayload as Record<string, unknown>).cliente as Cliente | null || null,
        clientes: (tokenPayload as Record<string, unknown>).clientes as Cliente[] || []
      };

      setUser(completeUserData);
      setToken(finalToken);
      
      // Armazena no sessionStorage
      sessionStorage.setItem("lavacar:user", JSON.stringify(completeUserData));
      sessionStorage.setItem("lavacar:token", finalToken);
      
      // Atualiza estados derivados
      setIsAdmin(completeUserData.tipoUsuario === "admin");
      setIsLavacar(!!completeUserData.idLavacar);
      setHasClientData(!!(completeUserData.cliente || (completeUserData.clientes && completeUserData.clientes.length > 0)));
      
    }
  };
  const getTokenFromCookies = (): string | null => {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const accessTokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('accessToken=')
    );
    
    return accessTokenCookie ? accessTokenCookie.split('=')[1] : null;
  };
  // Carrega dados do sessionStorage na inicialização
  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== "undefined") {
      try {
        const userJSON = sessionStorage.getItem("lavacar:user");
        let tokenJSON = sessionStorage.getItem("lavacar:token");
        
        
        if (!tokenJSON) {
          tokenJSON = getTokenFromCookies();
          if (tokenJSON) {
            sessionStorage.setItem("lavacar:token", tokenJSON);
          }
        }
        
        if (userJSON && tokenJSON && tokenJSON !== 'undefined') {
          const parsedUser: User = JSON.parse(userJSON);
          
          // Verifica se o token é válido (sem verificar expiração para evitar logout automático)
          const tokenPayload = decodeJWT(tokenJSON);
          if (tokenPayload) {
            setUser(parsedUser);
            setToken(tokenJSON);
            setIsAdmin(parsedUser.tipoUsuario === "admin");
            setIsLavacar(!!parsedUser.idLavacar);
            setHasClientData(!!(parsedUser.cliente || (parsedUser.clientes && parsedUser.clientes.length > 0)));
          } else {
            console.log('Token inválido, fazendo logout');
            logoutUser();
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do sessionStorage:", error);
        // Não faz logout automático em caso de erro, apenas limpa os dados
        sessionStorage.removeItem("lavacar:user");
        sessionStorage.removeItem("lavacar:token");
      }
    }
  }, []);

  // Atualiza sessionStorage quando user ou token mudam
  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      if (user && token && token !== 'undefined') {
        sessionStorage.setItem("lavacar:user", JSON.stringify(user));
        sessionStorage.setItem("lavacar:token", token);
      }
    }
  }, [user, token, isMounted]);

  // Função de logout
  const logoutUser = () => {
    console.log('Executando logout...');
    
    if (typeof window !== "undefined") {
      // Limpa sessionStorage
      sessionStorage.removeItem("lavacar:user");
      sessionStorage.removeItem("lavacar:token");
      
      // Limpa localStorage também
      localStorage.removeItem("lavacar:user");
      localStorage.removeItem("lavacar:token");
      localStorage.removeItem("orcamento:user");
      localStorage.removeItem("orcamento:token");
      
      // Limpa os cookies também
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      console.log('Dados limpos do storage e cookies');
    }
    
    // Limpa o estado
    setUser(undefined);
    setToken(null);
    setIsAdmin(false);
    setIsLavacar(false);
    setHasClientData(false);
    
    console.log('Estado limpo, logout concluído');
  };

  // Monitora mudanças no usuário para atualizar estados derivados
  useEffect(() => {
    if (user) {
      setIsAdmin(user.tipoUsuario === "admin");
      setIsLavacar(!!user.idLavacar);
      setHasClientData(!!(user.cliente || (user.clientes && user.clientes.length > 0)));
    } else {
      setIsAdmin(false);
      setIsLavacar(false);
      setHasClientData(false);
    }
  }, [user]);


  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser, 
        token,
        setToken,
        isAdmin, 
        isLavacar, 
        isClient: !!user?.cliente,
        hasClientData,
        logoutUser,
        loginUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};