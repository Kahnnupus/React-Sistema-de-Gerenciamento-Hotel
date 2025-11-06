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

  const MULT = { standard: 1.0, suite: 1.25, deluxe: 1.5 };
  const precoBase = Number(hotel.precoPorNoite || 0);
  const precoStd = precoBase * MULT.standard;
  const precoSuite = precoBase * MULT.suite;
  const precoDeluxe = precoBase * MULT.deluxe;

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

            <div className="bg-purple-50/60 dark:bg-gray-700/60 border border-purple-200/60 dark:border-purple-700/60 rounded-md p-4 mb-4">
              <p className="text-purple-700 dark:text-purple-200 font-semibold">
                Preços por tipo de quarto:
              </p>
              <ul className="mt-2 text-purple-700 dark:text-purple-300 space-y-1">
                <li>
                  Standard: <strong>R$ {precoStd.toFixed(2)}</strong> / noite
                </li>
                <li>
                  Suíte: <strong>R$ {precoSuite.toFixed(2)}</strong> / noite
                </li>
                <li>
                  Deluxe: <strong>R$ {precoDeluxe.toFixed(2)}</strong> / noite
                </li>
              </ul>
            </div>

            <p className="text-purple-600 dark:text-purple-400 mb-6">
              {hotel.descricao}
            </p>

            {Array.isArray(hotel.comodidades) &&
              hotel.comodidades.length > 0 && (
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
              )}

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
