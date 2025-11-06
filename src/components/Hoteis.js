import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHotels } from "../contexts/HotelContext";
import { useTheme } from "../contexts/ThemeContext";

const Hoteis = () => {
  const { hotels } = useHotels();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MULT = { standard: 1.0, suite: 1.25, deluxe: 1.5 };

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
        {filteredHotels.map((hotel) => {
          const precoBase = Number(hotel.precoPorNoite || 0);
          const precoStd = precoBase * MULT.standard;
          const precoSuite = precoBase * MULT.suite;
          const precoDeluxe = precoBase * MULT.deluxe;

          return (
            <div
              key={hotel.id}
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-purple-700/40"
            >
              <div className="relative">
                <img
                  src={hotel.imagem}
                  alt={hotel.nome}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute -bottom-px left-0 right-0 h-[1.5px] bg-purple-500 shadow-[0_4px_12px_#9333ea80] group-hover:shadow-[0_10px_25px_#a855f7] transition-all duration-300" />
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

                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  A partir de R$ {precoStd.toFixed(2)} / noite
                </p>

                <Link
                  to={`/hoteis/${hotel.id}`}
                  className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>
          );
        })}
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
