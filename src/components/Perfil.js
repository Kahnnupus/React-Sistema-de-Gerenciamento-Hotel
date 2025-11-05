import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Perfil = () => {
  const { user, updateProfile } = useAuth();
  const [perfil, setPerfil] = useState(user);
  const [estaEditando, setEstaEditando] = useState(false);
  const [perfilEditado, setPerfilEditado] = useState(user);
  const [imagemPerfil, setImagemPerfil] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPerfilEditado((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagemPerfil(e.target.result);
        setPerfilEditado((prev) => ({ ...prev, foto: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setPerfil(perfilEditado);
    updateProfile(perfilEditado);
    setEstaEditando(false);

    const mensagemSucesso = document.createElement('div');
    mensagemSucesso.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 opacity-0 transition-opacity duration-500';
    mensagemSucesso.innerHTML = `
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        Perfil atualizado com sucesso!
      </div>
    `;
    document.body.appendChild(mensagemSucesso);

    setTimeout(() => {
      mensagemSucesso.classList.remove('opacity-0');
      mensagemSucesso.classList.add('opacity-100');
    }, 10);

    setTimeout(() => {
      mensagemSucesso.classList.remove('opacity-100');
      mensagemSucesso.classList.add('opacity-0');
      setTimeout(() => {
        mensagemSucesso.remove();
      }, 500);
    }, 3000);
  };

  const handleCancel = () => {
    setPerfilEditado(perfil);
    setImagemPerfil(null);
    setEstaEditando(false);
  };

  return (
    <div className="animacao-fade-in max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-6">
        Perfil do Usuário
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-purple-200 dark:border-purple-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200">
            Informações Pessoais
          </h3>
          {!estaEditando && (
            <button
              onClick={() => setEstaEditando(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Editar
            </button>
          )}
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={
                estaEditando ? imagemPerfil || perfilEditado.foto : perfil.foto
              }
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 dark:border-purple-600"
            />
            {estaEditando && (
              <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                📷
              </label>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
              Nome
            </label>
            {estaEditando ? (
              <input
                type="text"
                name="nome"
                value={perfilEditado.nome}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              />
            ) : (
              <p className="text-purple-900 dark:text-purple-100">
                {perfil.nome}
              </p>
            )}
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
              Email
            </label>
            {estaEditando ? (
              <input
                type="email"
                name="email"
                value={perfilEditado.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              />
            ) : (
              <p className="text-purple-900 dark:text-purple-100">
                {perfil.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
              Telefone
            </label>
            {estaEditando ? (
              <input
                type="tel"
                name="telefone"
                value={perfilEditado.telefone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              />
            ) : (
              <p className="text-purple-900 dark:text-purple-100">
                {perfil.telefone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
              Endereço
            </label>
            {estaEditando ? (
              <textarea
                name="endereco"
                value={perfilEditado.endereco}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
                rows="3"
              />
            ) : (
              <p className="text-purple-900 dark:text-purple-100">
                {perfil.endereco}
              </p>
            )}
          </div>
        </div>

        {estaEditando && (
          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
