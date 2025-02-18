"use client";
import { useState, useContext, useEffect } from "react";
import { LogOut, ChevronDown } from "lucide-react";
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
    <header className="bg-black shadow-md p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-20">
      {/* Logo da Empresa */}
      <div className="flex items-center">
        <Image
          src="/images/BC-fundo.png"  
          alt="Logo Lavacar"
          width={120} 
          height={50}
          priority
        />
      </div>

      <div className="flex items-center space-x-6">
       
        <button className="relative text-white hover:text-white">
         
        </button>

        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-3">
            {user?.tipoUsuario === "super" && (
              <Image
                className="rounded-full"
                src={user?.urlImagemPerfil || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                alt="User avatar"
                width={40}
                height={40}
              />
            )} 
            <span className="font-medium text-white">{user?.nome}</span>
            <ChevronDown size={18} className="text-white"/>
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-5 w-48 bg-white rounded-lg shadow-lg border z-30">
              <ul className="text-gray-700">
                
                 {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Perfil</li> */}
                {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Configurações</li> */}
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
