import React, { useState } from "react";
import { useHotels } from "../contexts/HotelContext";

const AddHotel = () => {
  const { addHotel } = useHotels();

  const [newHotel, setNewHotel] = useState({
    nome: "",
    localizacao: "",
    precoPorNoite: "",
    descricao: "",
    imagem: "",
    comodidades: "",
    quartosDisponiveis: "",
  });

  const [hotelImage, setHotelImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHotelImage(e.target.result);
        setNewHotel((prev) => ({ ...prev, imagem: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      newHotel.nome &&
      newHotel.localizacao &&
      newHotel.precoPorNoite &&
      newHotel.descricao &&
      newHotel.quartosDisponiveis
    ) {
      addHotel({
        ...newHotel,
        precoPorNoite: parseFloat(newHotel.precoPorNoite),
        comodidades: newHotel.comodidades.split(",").map((c) => c.trim()),
        quartosDisponiveis: parseInt(newHotel.quartosDisponiveis),
        imagem: newHotel.imagem || "https://via.placeholder.com/400x300?text=Novo+Hotel",
      });
      setNewHotel({
        nome: "",
        localizacao: "",
        precoPorNoite: "",
        descricao: "",
        imagem: "",
        comodidades: "",
        quartosDisponiveis: "",
      });
      setHotelImage(null);
      alert("Hotel adicionado com sucesso!");
    }
  };

  return (
    <div className="animacao-fade-in">
      <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-6">
        Adicionar Hotel
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-lg border border-purple-200 dark:border-purple-700"
      >
        <div className="mb-4">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
            Nome do Hotel
          </label>
          <input
            type="text"
            name="nome"
            value={newHotel.nome}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
            Localização
          </label>
          <input
            type="text"
            name="localizacao"
            value={newHotel.localizacao}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
            Preço por Noite
          </label>
          <input
            type="number"
            name="precoPorNoite"
            value={newHotel.precoPorNoite}
            onChange={handleInputChange}
            step="0.01"
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={newHotel.descricao}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            rows="3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
            Comodidades (separadas por vírgula)
          </label>
          <input
            type="text"
            name="comodidades"
            value={newHotel.comodidades}
            onChange={handleInputChange}
            placeholder="Wi-Fi gratuito, Piscina, Spa"
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
            Quartos Disponíveis
          </label>
          <input
            type="number"
            name="quartosDisponiveis"
            value={newHotel.quartosDisponiveis}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
            Imagem do Hotel
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
          />
          {hotelImage && (
            <img
              src={hotelImage}
              alt="Preview"
              className="mt-2 w-32 h-24 object-cover rounded-md border border-purple-300"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Adicionar Hotel
        </button>
      </form>
    </div>
  );
};

export default AddHotel;
