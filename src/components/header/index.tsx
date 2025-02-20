"use client";
import { useState, useContext, useEffect } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import { UserContext } from "@/context/UserContext";
import useLogout from "../../../hooks/useLogout";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const logout = useLogout();
  const router = useRouter();

  useEffect(() => {
    const handlePerfilAtualizado = () => {
      const storedUser = sessionStorage.getItem("perfil:user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    window.addEventListener("perfilAtualizado", handlePerfilAtualizado);

    return () => {
      window.removeEventListener("perfilAtualizado", handlePerfilAtualizado);
    };
  }, [setUser]);

  const handleProfileClick = () => {
    if (user) {
      sessionStorage.setItem("perfil:user", JSON.stringify(user));
      router.push(user.idLavacar ? "/perfil-credenciado" : "/perfil-usuario");
    }
  };

  return (
    <header
      className={`bg-black shadow-md p-3 flex justify-end items-center fixed top-0 left-0 right-0 z-20 transition-all duration-300`}
    >
      <div className="flex items-center space-x-6">
        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition">
            {/* Imagem do usuário */}
            <div className="relative w-12 h-12">
              <Image
                className="rounded-full border-4 border-gray-400 shadow-lg"
                src={user?.urlImagemPerfil || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                alt="User avatar"
                width={48}
                height={48}
              />
            </div>

            {/* Nome e Tipo de Usuário */}
            <div className="flex flex-col text-white text-left">
              <p className="text-lg font-semibold">{user?.nome}</p>
              <p className="text-sm text-gray-300">{user?.tipoUsuario}</p>
            </div>

            {/* Ícone de Dropdown */}
            <ChevronDown size={20} className="text-gray-300" />
          </button>

          {/* Menu suspenso */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg border z-30">
              <ul className="text-gray-700">
                <li className="px-5 py-3 hover:bg-gray-100 cursor-pointer font-medium" onClick={handleProfileClick}>
                  Meu Perfil
                </li>
                <li
                  className="px-5 py-3 hover:bg-red-50 text-red-500 cursor-pointer flex items-center gap-3 font-medium"
                  onClick={() => logout.mutate()}
                >
                  <LogOut size={20} />
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
