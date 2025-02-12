"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { UserContext } from "@/context/UserContext";
import { LogOut, Users, Car, LayoutDashboard, ArrowLeft, ArrowRight, RefreshCw, UserCog, Building2 } from "lucide-react";
import useLogout from "../../../hooks/useLogout";

function Sidebar() {
  const { isAdmin, isLavacar } = useContext(UserContext); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const logout = useLogout();

  return (
    <div className={`h-screen bg-gray-900 text-white fixed pt-20 top-0 left-0 z-20 transition-all shadow-lg ${isCollapsed ? "w-16" : "w-40"}`}>
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

        {isAdmin && (
          <Link href="/clientes">
            <div className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
              <Users size={20} />
              {!isCollapsed && <span>Clientes</span>}
            </div>
          </Link>
        )}

        {isAdmin && (
          <Link href="/carros">
            <div className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
              <Car size={20} />
              {!isCollapsed && <span>Carros</span>}
            </div>
          </Link>
        )}
        {isAdmin &&(
        <Link href="/transacoes">
          <div className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
            <RefreshCw size={20} />
            {!isCollapsed && <span>Transações</span>}
          </div>
        </Link>
        )}
        {isLavacar && (
          <Link href="/seuestalecimento">
            <div className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
              <Building2 size={20} />
              {!isCollapsed && <span>Meu Lavacar</span>}
            </div>
          </Link>
        )}

        {isAdmin && (
          <>
            <Link href="/admin">
              <div className="flex items-center gap-3 p-3 bg-gray-800 text-yellow-400 rounded-lg cursor-pointer hover:bg-gray-700">
                <UserCog size={20} />
                {!isCollapsed && <span>Administrador</span>}
              </div>
            </Link>

          </>
        )}
      </nav>

      {/* Botão de Logout */}
      <div onClick={() => logout.mutate()} className="absolute bottom-4 left-4 flex items-center gap-3 cursor-pointer text-red-400 hover:text-red-300 transition">
        <LogOut size={20} />
        {!isCollapsed && <span>Sair</span>}
      </div>
    </div>
  );
}

export default Sidebar;
