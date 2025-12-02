import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useHotels } from "../contexts/HotelContext";
import { ArrowLeft, MapPin, DollarSign, Check, Calendar, Users, BedDouble, AlertTriangle } from "lucide-react";

const HotelDetalhes = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  const { hotels } = useHotels();

  const hotel = hotels.find((h) => h.id === parseInt(id, 10));

  if (!hotel) {
    return (
      <div className="animacao-fade-in text-center py-12">
        <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-4">
          Hotel não encontrado
        </h1>
        <button
          onClick={() => navegar(-1)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>
    );
  }

  const guestCountFor = (h) => {
    const key = `${h.id}-${h.nome}-${h.localizacao}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++)
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    return 10 + (hash % 36); // 10..45
  };
  const liveGuests = guestCountFor(hotel);
  const labelGuests =
    liveGuests === 1 ? "pessoa hospedada" : "pessoas hospedadas";

  // Backend returns tipos_quartos with preco_por_noite, quantidade_disponivel, capacidade_pessoas
  const tiposParaMostrar =
    Array.isArray(hotel.tipos_quartos) && hotel.tipos_quartos.length > 0
      ? hotel.tipos_quartos.map(t => ({
        nome: t.nome,
        preco: t.preco_por_noite,
        quantidade: t.quantidade_disponivel,
        limiteHospedes: t.capacidade_pessoas
      }))
      : Array.isArray(hotel.roomTypes) && hotel.roomTypes.length > 0
        ? hotel.roomTypes
        : (() => {
          const base = Number(hotel.precoPorNoite || 0);
          if (!base) return [];
          return [
            { nome: "Standard", preco: base, quantidade: 3, limiteHospedes: 1 },
            {
              nome: "Suíte",
              preco: +(base * 1.25).toFixed(2),
              quantidade: 2,
              limiteHospedes: 2,
            },
            {
              nome: "Deluxe",
              preco: +(base * 1.5).toFixed(2),
              quantidade: 1,
              limiteHospedes: 4,
            },
          ];
        })();

  return (
    <div className="animacao-fade-in max-w-6xl mx-auto">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-purple-700/40">
        <div className="md:flex md:min-h-[520px]">
          <div className="md:w-1/2 relative md:min-h-[520px]">
            <img
              src={hotel.imagem}
              alt={hotel.nome}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute top-0 right-0 h-full w-[2px] bg-purple-500 shadow-[0_0_20px_#a855f7]"></div>
          </div>

          <div className="md:w-1/2 p-6 relative md:min-h-[520px] flex flex-col">
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-gray-700/30 dark:bg-gray-700 text-purple-100 border border-purple-500/40">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {liveGuests} {labelGuests}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-2">
              {hotel.nome}
            </h1>
            <p className="text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {hotel.localizacao}
            </p>

            <div className="mb-5 rounded-lg border border-purple-500/30 bg-purple-50/10 dark:bg-gray-900/30 p-4">
              <h3 className="text-base font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                <BedDouble className="w-4 h-4" />
                Preços por tipo de quarto:
              </h3>
              {tiposParaMostrar.length > 0 ? (
                <ul className="space-y-1">
                  {tiposParaMostrar.map((t, i) => (
                    <li
                      key={`${t.nome}-${i}`}
                      className="text-purple-700 dark:text-purple-300"
                    >
                      <span className="font-medium">{t.nome}:</span>{" "}
                      <span className="font-bold">
                        R$ {Number(t.preco || 0).toFixed(2)}
                      </span>{" "}
                      <span className="text-sm opacity-80">/ noite</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-purple-700 dark:text-purple-300">
                  Este hotel ainda não possui tipos de quarto cadastrados.
                </p>
              )}
            </div>

            {hotel.descricao && (
              <p className="text-purple-600 dark:text-purple-400 mb-5">
                {hotel.descricao}
              </p>
            )}

            {hotel.comodidades?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Comodidades
                </h3>
                <ul className="grid grid-cols-2 gap-2 text-purple-700 dark:text-purple-300">
                  {hotel.comodidades.map((c, i) => (
                    <li key={`${c}-${i}`} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto flex gap-4">
              <Link
                to={`/reserva/${hotel.id}`}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Reservar Agora
              </Link>
              <button
                onClick={() => navegar(-1)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-purple-500/60 shadow-[0_0_25px_#9333ea66]"></div>
      </div>
    </div>
  );
};

export default HotelDetalhes;
