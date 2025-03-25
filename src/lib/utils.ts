import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCNPJ(cnpj: string) {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

export function formatValor(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatInfoCarro(
  type: string,
  info: string | undefined
): string {
  console.log({ type, info });
  if (!info) return "";

  let infoFormat = info.toString().toUpperCase();

  switch (type.toLowerCase()) {
    case "placa":
      return `${infoFormat.slice(0, 3)}-${infoFormat.slice(3)}`;

    case "chassi":
      return `${infoFormat.slice(0, 4)} ${infoFormat.slice(
        4,
        8
      )} ${infoFormat.slice(8, 12)} ${infoFormat.slice(12)}`;

    case "renavam":
      return `${infoFormat.slice(0, 3)}-${infoFormat.slice(
        3,
        6
      )}-${infoFormat.slice(6)}`;
    default:
      return infoFormat;
  }
}
