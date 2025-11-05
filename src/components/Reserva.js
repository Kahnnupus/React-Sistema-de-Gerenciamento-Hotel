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

  const [dadosReserva, setDadosReserva] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    roomType: "standard",
  });

  const obterDataAmanha = () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    return amanha.toISOString().split('T')[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDadosReserva((prev) => ({ ...prev, [name]: value }));
  };

  const calcularTotal = () => {
    if (!dadosReserva.checkIn || !dadosReserva.checkOut) return 0;
    const dataCheckIn = new Date(dadosReserva.checkIn);
    const dataCheckOut = new Date(dadosReserva.checkOut);
    const diferencaTempo = Math.abs(dataCheckOut - dataCheckIn);
    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
    return diferencaDias * hotel.precoPorNoite;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dadosReserva.checkIn && dadosReserva.checkOut && dadosReserva.guests > 0) {
      addReservation({
        hotelId: hotel.id,
        hotelName: hotel.nome,
        ...dadosReserva,
        total: calcularTotal(),
        status: "confirmada",
      });
  
      const mensagemSucesso = document.createElement('div');
      mensagemSucesso.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 opacity-0 transition-opacity duration-500';
      mensagemSucesso.innerHTML = `
        <div class="flex items-center">
          <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          Reserva realizada com sucesso!
        </div>
      `;
      document.body.appendChild(mensagemSucesso);

      setTimeout(() => {
        mensagemSucesso.classList.remove('opacity-0');
        mensagemSucesso.classList.add('opacity-100');
      }, 10);

      setTimeout(() => {
        mensagemSucesso.classList.remove('opacity-100');
        mensagemSucesso.classList.add('opacity-0');
        setTimeout(() => {
          mensagemSucesso.remove();
        }, 500);
      }, 3000);

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
              value={dadosReserva.checkIn}
              onChange={handleInputChange}
              min={obterDataAmanha()}
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
              value={dadosReserva.checkOut}
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
            value={dadosReserva.guests}
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
            value={dadosReserva.roomType}
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
            Total: R$ {calcularTotal().toFixed(2)}
          </h3>
          <p className="text-purple-600 dark:text-purple-400 text-sm">
            {dadosReserva.checkIn && dadosReserva.checkOut
              ? `${Math.ceil((new Date(dadosReserva.checkOut) - new Date(dadosReserva.checkIn)) / (1000 * 60 * 60 * 24))} noites`
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
