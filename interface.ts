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
  cpf: string;
  dataNascimento: string;
  }

  export interface CarroInterface {
    idCarro : number;
      modelo: string;
      placa: string;
      ano: number;
      cor: string;
      idCliente:number;
    }
    export interface EstabelecimentoInterface {
      idLavacar: number;
      nome: string;
      endereco: string;
      telefone: string;
      email: string;
      cnpj: string;
    }
  export interface InterfaceLavacar {
    idLavacar?: number;
    nome: string;
    cnpj:string
    endereco: string;
    telefone: string;
    email: string;
    idUsuario:number
  }
  export interface CartaoInterface{
    idCartao: number,
    idLavacar:number,
    estabelcimento:string,
        idCliente: number,
        idCarro: number,
        numeroCartao: string,
        saldo: number,
        senha: string,
        confirmSenha?:string
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
}

export interface VincularCartaoParams {
  idCartao: number;
  idLavacar: number;
  idCliente: number;
}
  