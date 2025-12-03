import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHotels } from "../contexts/HotelContext";
import { useReservations } from "../contexts/ReservationContext";

import { useFeedback } from "../contexts/FeedbackContext";
import { ArrowLeft, MapPin, DollarSign, Calendar, Users, BedDouble, Check } from "lucide-react";

const Reserva = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  const { showSuccess } = useFeedback();

  const { hotels } = useHotels();
  const { addReservation } = useReservations();

  const hotel = hotels.find((h) => h.id === parseInt(id, 10));

  const tiposPreparados = useMemo(() => {
    // Backend returns tipos_quartos
    if (hotel?.tipos_quartos && hotel.tipos_quartos.length > 0) {
      return hotel.tipos_quartos.map((t, i) => ({
        nome: t.nome || `Quarto ${i + 1}`,
        preco: Number(t.preco_por_noite || 0),
        quantidade: Number(t.quantidade_disponivel ?? 0),
        limiteHospedes: Number(t.capacidade_pessoas ?? 1),
      }));
    }
    // Fallback for old format
    if (hotel?.roomTypes && hotel.roomTypes.length > 0) {
      return hotel.roomTypes.map((t, i) => ({
        nome: t.nome || `Quarto ${i + 1}`,
        preco: Number(t.preco || 0),
        quantidade: Number(t.quantidade ?? 0),
        limiteHospedes: Number(t.limiteHospedes ?? 1),
      }));
    }

    const base = Number(hotel?.precoPorNoite || 0);
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
  }, [hotel]);

  const [dadosReserva, setDadosReserva] = useState({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: "",
    guests: 1,
    roomType: "",
  });

  useEffect(() => {
    if (!tiposPreparados.length) return;
    const comVaga =
      tiposPreparados.find((t) => t.quantidade > 0) || tiposPreparados[0];
    setDadosReserva((prev) => ({ ...prev, roomType: comVaga.nome }));
  }, [hotel?.id, tiposPreparados]);

  const tipoSelecionado =
    tiposPreparados.find((t) => t.nome === dadosReserva.roomType) ||
    tiposPreparados[0];

  const limiteHospedes = tipoSelecionado?.limiteHospedes ?? 1;
  const qtdDisp = tipoSelecionado?.quantidade ?? 0;
  const precoNoite = Number(tipoSelecionado?.preco || 0);

  const excedeuLimite = Number(dadosReserva.guests || 0) > limiteHospedes;
  const semVaga = qtdDisp === 0;

  const obterDataAmanha = () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    return amanha.toISOString().split("T")[0];
  };
  const obterDataHoje = () => {
    const hoje = new Date();
    hoje.setDate(hoje.getDate());
    return hoje.toISOString().split("T")[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDadosReserva((prev) => ({ ...prev, [name]: value }));
  };

  const calcularNoites = () => {
    if (!dadosReserva.checkIn || !dadosReserva.checkOut) return 0;
    const dataCheckIn = new Date(dadosReserva.checkIn);
    const dataCheckOut = new Date(dadosReserva.checkOut);
    const diffMs = Math.abs(dataCheckOut - dataCheckIn);
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const calcularTotal = () => {
    const noites = calcularNoites();
    return noites > 0 ? noites * precoNoite : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hotel || semVaga || excedeuLimite) return;

    const noites = calcularNoites();
    if (noites <= 0) return;

    const success = await addReservation({
      hotelId: hotel.id,
      hotelName: hotel.nome,
      ...dadosReserva,
      guests: Number(dadosReserva.guests || 0),
      roomType: tipoSelecionado?.nome,
      precoPorNoiteAplicado: precoNoite,
      total: calcularTotal(),
      status: "confirmada",
    });

    if (!success) {
      return; // Error already shown by addReservation
    }

    showSuccess('Sucesso', 'Reserva realizada com sucesso!');
    navegar("/hoteis");
  };

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

  const noites = calcularNoites();

  return (
    <div className="animacao-fade-in max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-6">
        Reservar {hotel.nome}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-purple-200 dark:border-purple-700 mb-6">
        <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-4">
          Detalhes da Reserva
        </h2>
        <p className="text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {hotel.localizacao}
        </p>
        <p className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          R$ {precoNoite.toFixed(2)} / noite
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-purple-200 dark:border-purple-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Check-in
            </label>
            <input
              type="date"
              name="checkIn"
              value={dadosReserva.checkIn}
              onChange={handleInputChange}
              min={obterDataHoje()}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Check-out
            </label>
            <input
              type="date"
              name="checkOut"
              value={dadosReserva.checkOut}
              onChange={handleInputChange}
              min={dadosReserva.checkIn || obterDataAmanha()}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium flex items-center gap-1">
            <Users className="w-4 h-4" />
            Número de Hóspedes
          </label>
          <input
            type="number"
            name="guests"
            value={dadosReserva.guests}
            onChange={handleInputChange}
            min="1"
            max={limiteHospedes}
            className={`w-full px-3 py-2 border ${excedeuLimite
              ? "border-red-500 focus:ring-red-500"
              : "border-purple-300 focus:ring-purple-500"
              } dark:border-purple-600 rounded-md focus:outline-none dark:bg-gray-700 dark:text-purple-100`}
            required
          />
          {excedeuLimite ? (
            <p className="text-red-500 text-sm mt-1">
              O limite para este quarto é {limiteHospedes} hóspede(s).
            </p>
          ) : (
            <p className="text-purple-600 dark:text-purple-300 text-sm mt-1">
              Limite: {limiteHospedes} hóspede(s).
            </p>
          )}
        </div>

        <div className="mb-2">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium flex items-center gap-1">
            <BedDouble className="w-4 h-4" />
            Tipo de Quarto
          </label>
          <select
            name="roomType"
            value={dadosReserva.roomType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
          >
            {tiposPreparados.map((t, i) => (
              <option
                key={`${t.nome}-${i}`}
                value={t.nome}
                disabled={t.quantidade === 0}
              >
                {t.nome} — R$ {Number(t.preco || 0).toFixed(2)} / noite
                {t.quantidade === 0 ? " (Sem vagas)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <div className="text-sm">
            {semVaga ? (
              <p className="text-red-500">
                Este tipo de quarto está sem vagas no momento.
              </p>
            ) : (
              <p className="text-purple-600 dark:text-purple-300">
                {qtdDisp} quarto(s) disponível(is) • Limite: {limiteHospedes}{" "}
                hóspede(s).
              </p>
            )}
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
            Total: R$ {calcularTotal().toFixed(2)}
          </h3>
          <p className="text-purple-600 dark:text-purple-400 text-sm">
            {dadosReserva.checkIn && dadosReserva.checkOut
              ? `${noites} noite(s) · R$ ${precoNoite.toFixed(2)}/noite`
              : "Selecione as datas para calcular o total"}
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={excedeuLimite || semVaga}
            className={`${excedeuLimite || semVaga
              ? "bg-purple-600/50 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
              } text-white font-medium py-2 px-4 rounded-md transition-colors`}
          >
            Confirmar Reserva
          </button>
          <button
            type="button"
            onClick={() => navegar(-1)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Reserva;
