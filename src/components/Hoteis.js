import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useHotels } from "../contexts/HotelContext";
import { useTheme } from "../contexts/ThemeContext";

const Hoteis = () => {
  const { hotels } = useHotels();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const cityParam = params.get("city") || "";

  const [searchTerm, setSearchTerm] = useState(cityParam);

  useEffect(() => {
    if (cityParam) {
      setSearchTerm(cityParam);
    }
  }, [cityParam]);

  const norm = (s = "") =>
    s
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const filteredHotels = hotels.filter((hotel) => {
    const termo = norm(searchTerm);
    return (
      norm(hotel.nome).includes(termo) ||
      norm(hotel.localizacao).includes(termo) ||
      norm(hotel.descricao).includes(termo)
    );
  });

  return (
    <div className="animacao-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200">
          Hotéis Disponíveis
        </h1>
        <Link
          to="/add-hotel"
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Adicionar Hotel
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar hotéis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-purple-200 dark:border-purple-700"
          >
            <div className="relative">
              <img
                src={hotel.imagem}
                alt={hotel.nome}
                className="w-full h-48 object-cover rounded-t-lg"
              />

              <div className="absolute -bottom-px left-0 right-0 h-[1.5px] bg-purple-500 shadow-[0_6px_18px_#9333ea80]" />
            </div>

            <div className="p-4">
              <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-2">
                {hotel.nome}
              </h2>
              <p className="text-purple-600 dark:text-purple-400 mb-2">
                {hotel.localizacao}
              </p>
              <p className="text-purple-600 dark:text-purple-400 mb-2">
                {hotel.descricao}
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                R$ {hotel.precoPorNoite.toFixed(2)} / noite
              </p>
              <Link
                to={`/hoteis/${hotel.id}`}
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Ver Detalhes
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <p className="text-center text-purple-500 dark:text-purple-400 mt-8">
          Nenhum hotel encontrado.
        </p>
      )}
    </div>
  );
};

export default Hoteis;
