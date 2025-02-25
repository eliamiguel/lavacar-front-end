"use client";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { PerfilUser } from "../../../interface";
import { useEditarPerfilcredenciado } from "../../../hooks/usePerfil";
import { toast } from "react-toastify";
import { UserContext } from "@/context/UserContext";
import { useUploadImagemPerfil } from "../../../hooks/useUpload";


const PerfilCredenciado = () => {
  const { setUser } = useContext(UserContext);
  const [lavacar, setLavacar] = useState<PerfilUser | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [urlImagemPerfil, setUrlImagemPerfil] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const editarPerfil = useEditarPerfilcredenciado();
  const uploadImagem = useUploadImagemPerfil();

  useEffect(() => {
    const storedLavacar = sessionStorage.getItem("perfil:user");
    if (storedLavacar) {
      const parsedLavacar: PerfilUser = JSON.parse(storedLavacar);
      setLavacar(parsedLavacar);
      setNome(parsedLavacar.nome);
      setEmail(parsedLavacar.email);
      setCnpj(parsedLavacar.cnpj || "");
      setTelefone(parsedLavacar.telefone || "");
      setEndereco(parsedLavacar.endereco || "");
      setUrlImagemPerfil(parsedLavacar.urlImagemPerfil || "");
    }
  }, []);

  
  const handleSave = async () => {
    if (!lavacar?.idLavacar) {
      toast.error("Erro: Credenciado inválido.");
      return;
    }

    
    let finalUrlImagem = urlImagemPerfil;

    if (selectedFile) {
        const response = await uploadImagem.mutateAsync(selectedFile);
        finalUrlImagem = response.imageUrl; 

        return;
      
    }

    await editarPerfil.mutateAsync({
      idLavacar: lavacar.idLavacar,
      nome,
      email,
      cnpj,
      telefone,
      endereco,
      urlImagemPerfil: finalUrlImagem,
    });

    const updatedLavacar = { ...lavacar, nome, email, cnpj, telefone, endereco, urlImagemPerfil: finalUrlImagem };
    sessionStorage.setItem("perfil:user", JSON.stringify(updatedLavacar));
    setUser(updatedLavacar);
  };

  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUrlImagemPerfil(URL.createObjectURL(file)); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 p-8 bg-white shadow-lg rounded-xl flex items-center">
    
      <div className="w-1/3 flex flex-col items-center text-center border-r border-gray-300 pr-6">
        <Image
          className="rounded-full border-4 border-gray-300 shadow-lg"
          src={urlImagemPerfil || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
          alt="Foto do Estabelecimento"
          width={140}
          height={140}
        />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">{nome || "Nome do Estabelecimento"}</h2>
        <p className="text-gray-500 text-lg">{email || "E-mail não disponível"}</p>
        <p className="text-gray-500 text-md">{cnpj ? `CNPJ: ${cnpj}` : "CNPJ não informado"}</p>
        <p className="text-gray-500 text-md">{telefone ? `Telefone: ${telefone}` : "Telefone não informado"}</p>
      </div>

    
      <div className="w-2/3 pl-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Editar Perfil</h2>
        <div className="space-y-4">
          <div>
            <label className="text-gray-700 font-semibold block mb-1">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-gray-700 font-semibold block mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-gray-700 font-semibold block mb-1">CNPJ</label>
            <input
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-gray-700 font-semibold block mb-1">Telefone</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-gray-700 font-semibold block mb-1">Endereço</label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-gray-700 font-semibold block mb-1">URL da Imagem</label>
            <input
              type="text"
              value={urlImagemPerfil}
              onChange={(e) => setUrlImagemPerfil(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          
          <div>
            <label className="text-gray-700 font-semibold block mb-1">Enviar Imagem</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg"
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

export default PerfilCredenciado;
