"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Users, Car, LayoutDashboard, ArrowLeft, ArrowRight, RefreshCw, Shield, Settings, UserCog } from "lucide-react";
import useLogout from "../../../hooks/useLogout";


function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const logout = useLogout();
  const [userType, setUserType] = useState<string | null>(null); // Estado para armazenar o tipo de usuário

  // Simula busca do tipo de usuário (pode vir da API ou localStorage)
  useEffect(() => {
    const tipoUsuario = localStorage.getItem("userType") || "cliente"; // Simulando
    setUserType(tipoUsuario);
  }, []);

  return (
    <div className={`h-screen bg-gray-900 text-white fixed pt-14 top-0 left-0 z-20 transition-all shadow-lg ${isCollapsed ? "w-16" : "w-40"}`}>
      
      {/* Botão de expandir/recolher Sidebar */}
      <div className="flex items-center justify-between p-4 mt-2">
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white hover:text-gray-400 transition">
          {isCollapsed ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </button>
      </div>

      {/* Menu padrão */}
      <nav className="mt-4 space-y-2">
        <Link href="/dashboard">
          <div className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
            <LayoutDashboard size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </div>
        </Link>

        <Link href="/clientes">
          <div className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
            <Users size={20} />
            {!isCollapsed && <span>Clientes</span>}
          </div>
        </Link>

        <Link href="#">
          <div className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
            <Car size={20} />
            {!isCollapsed && <span>Carros</span>}
          </div>
        </Link>

        <Link href="/transacoes">
          <div className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
            <RefreshCw size={20} />
            {!isCollapsed && <span>Transações</span>}
          </div>
        </Link>

        {/* Link fixo para Administrador */}
        <Link href="/admin">
          <div className="flex items-center gap-3 p-3 bg-gray-800 text-yellow-400 rounded-lg cursor-pointer hover:bg-gray-700">
            <UserCog size={20} />
            {!isCollapsed && <span>Administrador</span>}
          </div>
        </Link>

        {/* Se o usuário for administrador, exibe opções extras */}
        {userType === "admin" && (
          <>
            <Link href="/admin/configuracoes">
              <div className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
                <Settings size={20} />
                {!isCollapsed && <span>Configurações</span>}
              </div>
            </Link>

            <Link href="/admin/gerenciar">
              <div className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
                <Shield size={20} />
                {!isCollapsed && <span>Gerenciar Sistema</span>}
              </div>
            </Link>
          </>
        )}
      </nav>

      {/* Botão de Logout */}
      <div onClick={() => logout.mutate()} className="absolute bottom-4 left-4 flex items-center gap-3 cursor-pointer text-red-400 hover:text-red-300 transition">
        <LogOut size={20}  />
        {!isCollapsed && <span>Sair</span>}
      </div>
    </div>
  );
}

export default Sidebar;
