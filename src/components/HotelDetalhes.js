import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useHotels } from "../contexts/HotelContext";

const HotelDetalhes = () => {
  const { id } = useParams();
  const navegar = useNavigate();

  const { hotels } = useHotels();

  const hotel = hotels.find((h) => h.id === parseInt(id));

  if (!hotel) {
    return (
      <div className="animacao-fade-in text-center py-12">
        <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-4">
          Hotel não encontrado
        </h1>
        <button
          onClick={() => navegar(-1)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="animacao-fade-in max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-purple-200 dark:border-purple-700">
        <div className="grid md:grid-cols-2 md:min-h-[460px]">
          <div className="h-full">
            <img
              src={hotel.imagem}
              alt={hotel.nome}
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="p-6 lg:p-8 border-t md:border-t-0 md:border-l border-purple-700/50 shadow-[inset_12px_0_24px_rgba(147,51,234,0.15)] rounded-r-lg">
            <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-4">
              {hotel.nome}
            </h1>
            <p className="text-purple-600 dark:text-purple-400 mb-2">
              {hotel.localizacao}
            </p>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">
              R$ {hotel.precoPorNoite.toFixed(2)} / noite
            </p>
            <p className="text-purple-600 dark:text-purple-400 mb-6">
              {hotel.descricao}
            </p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                Comodidades
              </h3>
              <ul className="list-disc list-inside text-purple-700 dark:text-purple-300">
                {hotel.comodidades.map((comodidade, index) => (
                  <li key={index}>{comodidade}</li>
                ))}
              </ul>
            </div>
            <div className="space-x-4">
              <Link
                to={`/reserva/${hotel.id}`}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Reservar Agora
              </Link>
              <button
                onClick={() => navegar(-1)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetalhes;
