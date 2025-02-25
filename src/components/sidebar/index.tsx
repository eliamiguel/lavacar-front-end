"use client";
import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { LogOut, Users, Car, LayoutDashboard, ArrowLeft, ArrowRight, RefreshCw, UserCog, Building2 } from "lucide-react";
import useLogout from "../../../hooks/useLogout";

function Sidebar() {
  const { user } = useContext(UserContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const logout = useLogout();
  const [forceRender, setForceRender] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setForceRender((prev) => prev + 1);
  }, [user]);

  return (
    <div key={forceRender} className={`h-screen  bg-black text-white fixed top-0 left-0 z-50 transition-all shadow-lg pt-4 ${isCollapsed ? "w-16" : "w-40"}`}>
      
      <div className="flex items-center justify-center transition-all">
        <Image 
          src="/images/BC-fundo.png" 
          alt="Logo Lavacar" 
          width={isCollapsed ? 50 : 100} 
          height={isCollapsed ? 25 : 50} 
          priority 
        />
      </div>

      <div className="flex items-center justify-between p-4 mt-2">
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white hover:text-gray-400 transition">
          {isCollapsed ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </button>
      </div>

      <nav className="mt-4 space-y-2">
        <Link href="/dashboard">
          <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${pathname === "/dashboard" ? "bg-gray-700 text-white" : "hover:bg-gray-800"}`}>
            <LayoutDashboard size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </div>
        </Link>

        {(user?.tipoUsuario === "admin" || user?.tipoUsuario === "super") && (
          <Link href="/clientes">
            <div className={`flex items-center gap-3 my-2 p-3 rounded-lg cursor-pointer transition ${pathname === "/clientes" ? "bg-gray-700 text-white" : "hover:bg-gray-800"}`}>
              <Users size={20} />
              {!isCollapsed && <span>Clientes</span>}
            </div>
          </Link>
        )}

        {(user?.tipoUsuario === "admin" || user?.tipoUsuario === "super") && (
          <Link href="/carros">
            <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${pathname === "/carros" ? "bg-gray-700 text-white" : "hover:bg-gray-800"}`}>
              <Car size={20} />
              {!isCollapsed && <span>Carros</span>}
            </div>
          </Link>
        )}

        {(user?.tipoUsuario === "admin" || user?.tipoUsuario === "super") && (
          <Link href="/transacoes">
            <div className={`flex items-center gap-3 my-2 p-3 rounded-lg cursor-pointer transition ${pathname === "/transacoes" ? "bg-gray-700 text-white" : "hover:bg-gray-800"}`}>
              <RefreshCw size={20} />
              {!isCollapsed && <span>Transações</span>}
            </div>
          </Link>
        )}

        {user?.tipoUsuario === "credenciado" && (
          <Link href="/seuestabelecimento">
            <div className={`flex items-center gap-3 my-2 p-3 rounded-lg cursor-pointer transition ${pathname === "/seuestabelecimento" ? "bg-gray-700 text-white" : "hover:bg-gray-800"}`}>
              <Building2 size={20} />
              {!isCollapsed && <span>Meu Lavacar</span>}
            </div>
          </Link>
        )}

        {(user?.tipoUsuario === "admin" || user?.tipoUsuario === "super") && (
          <Link href="/admin">
            <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${pathname === "/admin" ? "bg-gray-700 text-white" : "hover:bg-gray-800"}`}>
              <UserCog size={20} />
              {!isCollapsed && <span>Administrador</span>}
            </div>
          </Link>
        )}
      </nav>

      <div onClick={() => logout.mutate()} className="absolute bottom-4 left-4 flex items-center gap-3 cursor-pointer text-red-400 hover:text-red-300 transition">
        <LogOut size={20} />
        {!isCollapsed && <span>Sair</span>}
      </div>
    </div>
  );
}

export default Sidebar;
