import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHotels } from "../contexts/HotelContext";
import { useReservations } from "../contexts/ReservationContext";

const Reserva = () => {
  const { id } = useParams();
  const navegar = useNavigate();

  const { hotels } = useHotels();
  const { addReservation } = useReservations();

  const hotel = hotels.find((h) => h.id === parseInt(id));

  const [reservationData, setReservationData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    roomType: "standard",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    if (!reservationData.checkIn || !reservationData.checkOut) return 0;
    const checkInDate = new Date(reservationData.checkIn);
    const checkOutDate = new Date(reservationData.checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * hotel.precoPorNoite;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reservationData.checkIn && reservationData.checkOut && reservationData.guests > 0) {
      addReservation({
        hotelId: hotel.id,
        hotelName: hotel.nome,
        ...reservationData,
        total: calculateTotal(),
        status: "confirmada",
      });
      alert("Reserva realizada com sucesso!");
      navegar("/hoteis");
    }
  };

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
    <div className="animacao-fade-in max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-6">
        Reservar {hotel.nome}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-purple-200 dark:border-purple-700 mb-6">
        <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-4">
          Detalhes da Reserva
        </h2>
        <p className="text-purple-600 dark:text-purple-400 mb-2">
           {hotel.localizacao}
        </p>
        <p className="text-purple-600 dark:text-purple-400">
          R$ {hotel.precoPorNoite.toFixed(2)} / noite
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-purple-200 dark:border-purple-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
              Check-in
            </label>
            <input
              type="date"
              name="checkIn"
              value={reservationData.checkIn}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
              Check-out
            </label>
            <input
              type="date"
              name="checkOut"
              value={reservationData.checkOut}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
            Número de Hóspedes
          </label>
          <input
            type="number"
            name="guests"
            value={reservationData.guests}
            onChange={handleInputChange}
            min="1"
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
            Tipo de Quarto
          </label>
          <select
            name="roomType"
            value={reservationData.roomType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
          >
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suíte</option>
          </select>
        </div>

        <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
            Total: R$ {calculateTotal().toFixed(2)}
          </h3>
          <p className="text-purple-600 dark:text-purple-400 text-sm">
            {reservationData.checkIn && reservationData.checkOut
              ? `${Math.ceil((new Date(reservationData.checkOut) - new Date(reservationData.checkIn)) / (1000 * 60 * 60 * 24))} noites`
              : "Selecione as datas para calcular o total"}
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
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
