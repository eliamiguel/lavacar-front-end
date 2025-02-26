"use client";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { PerfilUser } from "../../../interface";
import { useEditarPerfilUsuario } from "../../../hooks/usePerfil";
import { toast } from "react-toastify";
import { UserContext } from "@/context/UserContext";
import { useUploadImagemPerfil } from "../../../hooks/useUpload";

const PerfilUsuario = () => {
  const [usuario, setUsuario] = useState<PerfilUser | null>(null);
  const { setUser } = useContext(UserContext);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [urlImagemPerfil, setUrlImagemPerfil] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const editarPerfil = useEditarPerfilUsuario();
  const uploadImagem = useUploadImagemPerfil();

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

    let finalUrlImagem = urlImagemPerfil;

    if (selectedFile) {
      const response = await uploadImagem.mutateAsync(selectedFile);
      finalUrlImagem = response.imageUrl;
      return;
    }

    await editarPerfil.mutateAsync({
      idUsuario: usuario.idUsuario,
      nome,
      email,
      urlImagemPerfil: finalUrlImagem,
    });

    const updatedUser = { ...usuario, nome, email, urlImagemPerfil: finalUrlImagem };
    sessionStorage.setItem("perfil:user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 p-8 bg-white shadow-lg rounded-xl flex flex-col md:flex-row items-center">
      
      {/* Seção da foto e informações do perfil */}
      <div className="w-full md:w-1/3 flex flex-col items-center text-center md:border-r md:border-gray-300 md:pr-6">
        <Image
          className="rounded-full border-4 border-gray-300 shadow-lg object-cover"
          src={urlImagemPerfil || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
          alt="Foto de perfil"
          width={140}
          height={140}
        />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">{nome || "Usuário"}</h2>
        <p className="text-gray-500 text-lg">{email || "Email não disponível"}</p>
      </div>

      {/* Seção de edição */}
      <div className="w-full md:w-2/3 md:pl-6 mt-8 md:mt-0">
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

          <div>
            <label className="text-gray-700 font-semibold block mb-1">Enviar Imagem</label>
            <label className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-500 transition duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h4l2-3h4l2 3h4a2 2 0 012 2v10a2 2 0 01-2 2h-4l-2 3H9l-2-3H3a2 2 0 01-2-2V9a2 2 0 012-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a3 3 0 110-6 3 3 0 010 6z" />
              </svg>
              <span className="text-gray-500">Selecionar imagem</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
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
