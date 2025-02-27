import {  ReactNode } from "react"

export interface IAuthInput{
    label:string,
    newState:(state: string )=>void,
    Ispassword?:boolean,
    placeholder?:string,
    value?: string | number
  }

  
  
  export interface IFROM{
    handleSubmit:(e: React.FormEvent)=>void,
    children:ReactNode
  }
  export interface Item {
    id: number;
    cliente: string;
    status: string;
    data_criacao: string;
    valor_total: number;
  }
  
  export interface VisibilityState {
    [key: number]: boolean; 
  }

  export interface ClienteIrteface {
  idCliente?: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cnpj: string;
  dataCadastro?: string | Date;
  }

  export interface CarroInterface {
    idCarro : number;
      modelo: string;
      placa: string;
      ano: number;
      cor: string;
      idCliente:number;
      marca?: string,
      chassis?: string,
      renavam?: string,
      lotacao?: string,
      desembargador?: string,
    }
    export interface EstabelecimentoInterface {
      idLavacar: number;
      nome: string;
      endereco: string;
      telefone: string;
      email: string;
      cnpj: string;
      senhaHash:string;
      razaoSocial?:string;
      cidade?:string;
      atividadePrincipal?:string;
      clientesVinculados?: { idCliente: number; nome: string }[];
    }
  export interface InterfaceLavacar {
    idLavacar?: number;
    nome: string;
    cnpj:string
    endereco: string;
    telefone: string;
    email: string;
    idUsuario:number,
    razaoSocial?:string;
    cidade?:string;
    atividadePrincipal?:string;
  }
  export interface CartaoInterface{
    idCartao: number,
    idLavacar:number,
    estabelcimento:string,
    idCliente: number,
    idCarro: number,
    tipoCartao:string,
    numeroCartao: string,
    mensagem?:string,
    sucesso?:boolean,
    saldo: number,
    senha: string,
    confirmSenha?:string,
    idLavacarLogado?:number,
    clienteNome: string;
  carroModelo: string;
  carroPlaca: string;

  cliente?: {
    idCliente: number;
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cnpj: string;
  };

  
  carro?: {
    idCarro: number;
    modelo: string;
    placa: string;
    ano: number;
    cor: string;
  };
  
  }
  export interface TransacaoInterface {
    idTransacao: number;
    valorDesconto: number;
    dataTransacao: string;
    status: string;
    cartao: {
      cliente: {
        nome: string;
      };
    };
    lavacar: {
      nome: string;
    };
  }

  export interface TransacaoRecente {
    data: string;
    valorDesconto: number;
  }
  export interface TransacaoRecente {
    dataTransacao: string;
    valorDesconto: number;
  }
  
  export interface DashboardData {
    totalCartoes: number;
    totalCarros: number;
    totalCleinetes: number;
    totalEstabelecimentos: number;
    totalTransacoes: number;
    transacoesRecentes: TransacaoRecente[];
  }
  export interface Lavacar {
    idLavacar: number;
    nome: string;
    endereco: string;
    telefone: string;
    email: string;
    razaoSocial?:string;
    cidade?:string;
    atividadePrincipal?:string;
}

export interface VincularCartaoParams {
  idCartao: number;
  idLavacar: number;
  idCliente: number;
}


export interface LavacarInterface {
  idLavacar: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  cnpj: string;
  atividadePrincipal:string,
  ramoAtuacao:string,
  razaoSocial:string,
  cidade:string,
  cartoesPermitidos: {
    idCartao: number;
    numeroCartao: string;
    saldo: number;
  }[];
  transacoes: {
    idTransacao: number;
    valorDesconto: number;
    dataTransacao: string;
    status: string;
  }[];
}
export interface IntefacePermitidos {
  idCartao: number;
  numeroCartao: string;
  saldo: number;
  modelo?: string;
  placa?: string;
  tipoCartao?: string;
  limiteSaldo?:number
}

export  interface IterfacetransacoesSeuEstabelecimento {
  idTransacao: number;
  valorDesconto: number;
  dataTransacao: string;
  status: string;
}

export interface PerfilUser {
  idUsuario?: number;
  idLavacar?: number;
  nome: string;
  email: string;
  senhaHash?: string; 
  atividadePrincipal?: string,
  ramoAtuacao?: string,
  razaoSocial?: string,
  cidade?: string,
  urlImagemPerfil?: string;
  tipoUsuario: "admin" | "funcionario" | "super";
  telefone?: string;
  endereco?: string;
  cnpj?: string; 
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}

export interface PerfilUsuario {
  idUsuario?: number;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  urlImagemPerfil?: string;
}

export interface PerfilLavacar {
  idLavacar?: number;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  cnpj: string;
  atividadePrincipal?: string,
  ramoAtuacao?: string,
  razaoSocial?: string,
  cidade?: string,
  urlImagemPerfil?: string;
}


export interface UsuarioPerfilPayload {
  idUsuario: number;
  nome: string;
  email: string;
  urlImagemPerfil: string;
}

export interface CredenciadoPerfilPayload {
  idLavacar: number;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  cnpj: string;
  urlImagemPerfil: string;
}


export interface Cliente {
  idCliente: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cnpj: string;
}

export interface Carro {
  idCarro: number;
  modelo: string;
  placa: string;
  ano: number;
  cor: string;
}

export interface Cartao {
  idCartao: number;
  saldo: number;
  tipoCartao: string;
  limiteSaldo?: number;
  placa?: string;
  modelo?: string;
}

export interface Transacao {
  idTransacao: number;
  idCartao?: number;
  idLavacar: number;
  valorDesconto: number;
  dataTransacao: string;
  status: string;
  cartao?: { cliente?: Cliente };
}

export interface Lavacar {
  idLavacar: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  cnpj: string;
  urlImagemPerfil?: string;
  clientes: Cliente[];
  cartoesPermitidos: Cartao[];
  transacoes: Transacao[];
}
