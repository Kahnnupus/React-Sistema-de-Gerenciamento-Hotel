import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useHotels } from "../contexts/HotelContext";
import { Hotel, Plus, Search, MapPin, Eye, DollarSign } from "lucide-react";

const normalize = (s) =>
  (s || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const getMinPrice = (hotel) => {
  // Backend returns tipos_quartos
  if (Array.isArray(hotel.tipos_quartos) && hotel.tipos_quartos.length > 0) {
    return hotel.tipos_quartos.reduce(
      (min, t) => Math.min(min, Number(t.preco_por_noite || 0)),
      Number(hotel.tipos_quartos[0].preco_por_noite || 0)
    );
  }
  // Fallback for old format
  if (Array.isArray(hotel.roomTypes) && hotel.roomTypes.length > 0) {
    return hotel.roomTypes.reduce(
      (min, t) => Math.min(min, Number(t.preco || 0)),
      Number(hotel.roomTypes[0].preco || 0)
    );
  }
  return Number(hotel.precoPorNoite || 0);
};

const Hoteis = () => {
  const { hotels } = useHotels();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const city = params.get("city") || "";
    setSearchTerm(city);
  }, [location.search]);

  const filteredHotels = useMemo(() => {
    const t = normalize(searchTerm);
    if (!t) return hotels;
    return hotels.filter((hotel) =>
      [hotel.nome, hotel.localizacao, hotel.descricao].some((field) =>
        normalize(field).includes(t)
      )
    );
  }, [hotels, searchTerm]);

  return (
    <div className="animacao-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 flex items-center gap-2">
          <Hotel className="w-8 h-8" />
          Hotéis Disponíveis
        </h1>
        <Link
          to="/add-hotel"
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Hotel
        </Link>
      </div>

      <div className="mb-6 relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar hotéis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => {
          const minPrice = getMinPrice(hotel);

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
                <p className="text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {hotel.localizacao}
                </p>
                {hotel.descricao && (
                  <p className="text-purple-600 dark:text-purple-400 mb-3 line-clamp-2">
                    {hotel.descricao}
                  </p>
                )}

                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  A partir de R$ {minPrice.toFixed(2)} / noite
                </p>

                <Link
                  to={`/hoteis/${hotel.id}`}
                  className="inline-flex items-center gap-2 mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  <Eye className="w-4 h-4" />
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
