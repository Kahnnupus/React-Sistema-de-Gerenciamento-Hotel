import React, { useState } from "react";

const Perfil = () => {
  const [profile, setProfile] = useState({
    nome: "Felipe Albino",
    email: "Kanupuslp@gmail.com",
    telefone: "(83)98116-1020",
    endereco: "Francisco Assis de Oliveira, 80 Palmeira",
    foto: "https://via.placeholder.com/150",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [profileImage, setProfileImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setEditedProfile((prev) => ({ ...prev, foto: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    alert("Perfil atualizado com sucesso!");
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setProfileImage(null);
    setIsEditing(false);
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
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
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
                isEditing ? profileImage || editedProfile.foto : profile.foto
              }
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 dark:border-purple-600"
            />
            {isEditing && (
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
            {isEditing ? (
              <input
                type="text"
                name="nome"
                value={editedProfile.nome}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              />
            ) : (
              <p className="text-purple-900 dark:text-purple-100">
                {profile.nome}
              </p>
            )}
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editedProfile.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              />
            ) : (
              <p className="text-purple-900 dark:text-purple-100">
                {profile.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
              Telefone
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="telefone"
                value={editedProfile.telefone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              />
            ) : (
              <p className="text-purple-900 dark:text-purple-100">
                {profile.telefone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
              Endereço
            </label>
            {isEditing ? (
              <textarea
                name="endereco"
                value={editedProfile.endereco}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
                rows="3"
              />
            ) : (
              <p className="text-purple-900 dark:text-purple-100">
                {profile.endereco}
              </p>
            )}
          </div>
        </div>

        {isEditing && (
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
