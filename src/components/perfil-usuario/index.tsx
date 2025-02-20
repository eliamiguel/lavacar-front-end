"use client";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { PerfilUser } from "../../../interface";
import { useEditarPerfilUsuario } from "../../../hooks/usePerfil";
import { toast } from "react-toastify";
import { UserContext } from "@/context/UserContext";

const PerfilUsuario = () => {
  const [usuario, setUsuario] = useState<PerfilUser | null>(null);
  const { setUser } = useContext(UserContext);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [urlImagemPerfil, setUrlImagemPerfil] = useState("");

  const mutate = useEditarPerfilUsuario();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("perfil:user");
    if (storedUser) {
      const parsedUser: PerfilUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
      setNome(parsedUser.nome);
      setEmail(parsedUser.email);
      setUrlImagemPerfil(parsedUser.urlImagemPerfil || "");
    }
  }, []);

  const handleSave = async () => {
    if (!usuario?.idUsuario) {
      toast.error("Erro: Usuário inválido.");
      return;
    }

    await mutate.mutateAsync({
      idUsuario: usuario.idUsuario,
      nome,
      email,
      urlImagemPerfil,
    });

    const updatedUser = { ...usuario, nome, email, urlImagemPerfil };

    sessionStorage.setItem("perfil:user", JSON.stringify(updatedUser));
    setUser(updatedUser); // Atualiza o estado global
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 p-8 bg-white shadow-lg rounded-xl flex items-center">
      {/* Lado esquerdo - Informações do usuário */}
      <div className="w-1/3 flex flex-col items-center text-center border-r border-gray-300 pr-6">
        <Image
          className="rounded-full border-4 border-gray-300 shadow-lg"
          src={urlImagemPerfil || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
          alt="Foto de perfil"
          width={140}
          height={140}
        />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">{nome || "Usuário"}</h2>
        <p className="text-gray-500 text-lg">{email || "Email não disponível"}</p>
      </div>

      {/* Lado direito - Formulário de edição */}
      <div className="w-2/3 pl-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Editar Perfil</h2>
        <div className="space-y-4">
          <div>
            <label className="text-gray-700 font-semibold block mb-1">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-gray-700 font-semibold block mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-gray-700 font-semibold block mb-1">URL da Imagem</label>
            <input
              type="text"
              value={urlImagemPerfil}
              onChange={(e) => setUrlImagemPerfil(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-black text-white p-3 rounded-lg mt-6 font-bold transition-all hover:bg-gray-900"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default PerfilUsuario;
