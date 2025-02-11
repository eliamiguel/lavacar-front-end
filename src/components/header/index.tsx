"use client";
import { useState, useContext, useEffect } from "react";
import { LogOut, Bell, ChevronDown } from "lucide-react";
import { UserContext } from "@/context/UserContext";
import useLogout from "../../../hooks/useLogout";
import Image from "next/image";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const logout = useLogout();

  useEffect(() => {
    if (user && Array.isArray(user) && user.length > 0) {
      setUser({
        nome: user[0].nome,
        urlImagemPerfil: user[0].urlImagemPerfil,
        idUsuario: user[0].idUsuario,
        email: user[0].email,
        tipoUsuario: user[0].tipoUsuario,
      });
    }
  }, [user, setUser]);

  return (
    <header className=" bg-gray-900 shadow-md p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-20">
      {/* Nome do Sistema */}
      <div className="text-xl font-bold text-white">Lavacar System</div>

      {/* Ícones e Perfil */}
      <div className="flex items-center space-x-6">
        {/* Ícone de Notificação */}
        <button className="relative text-white hover:text-white">
          <Bell size={20} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Menu do Usuário */}
        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-3">
            <Image
              className="rounded-full"
              src={user?.urlImagemPerfil || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
              alt="User avatar"
              width={40}
              height={40}
            />
            <span className="font-medium text-white">{user?.nome}</span>
            <ChevronDown size={18} className="text-white"/>
          </button>

          {/* Dropdown do Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border z-30">
              <ul className="text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Perfil</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Configurações</li>
                <li className="px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer flex items-center gap-2" onClick={() => logout.mutate()}>
                  <LogOut size={18} />
                  Sair
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
