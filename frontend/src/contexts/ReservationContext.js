import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import API_BASE_URL from "../config/api";
import { useAuth } from "./AuthContext";
import { useHotels } from "./HotelContext";
import { useFeedback } from "./FeedbackContext";

const ReservationContext = createContext();

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservations must be used within a ReservationProvider");
  }
  return context;
};

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const { refreshHotels } = useHotels();
  const { showError } = useFeedback();

  const fetchReservations = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setReservations(data.reservations);
      }
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Carregar reservas quando usuário estiver autenticado e configurar auto-refresh
  useEffect(() => {
    if (token && user) {
      fetchReservations();

      // Auto-refresh a cada 30 segundos
      const interval = setInterval(() => {
        fetchReservations();
      }, 30000);

      return () => clearInterval(interval);
    } else {
      setReservations([]);
      setLoading(false);
    }
  }, [token, user, fetchReservations]);

  const addReservation = async (reservation) => {
    try {
      // Fetch hotel details to get room_type_id
      const hotelResponse = await fetch(`${API_BASE_URL}/hotels/${reservation.hotelId}`);
      const hotelData = await hotelResponse.json();

      if (!hotelData.success) {
        showError('Erro', 'Erro ao buscar informações do hotel');
        return false;
      }

      const hotel = hotelData.hotel;
      const roomType = hotel.tipos_quartos?.find(rt => rt.nome === reservation.roomType);

      if (!roomType) {
        showError('Erro', 'Tipo de quarto não encontrado');
        return false;
      }

      // Transform to backend format
      const backendReservation = {
        hotel_id: reservation.hotelId,
        room_type_id: roomType.id,
        check_in: reservation.checkIn,
        check_out: reservation.checkOut,
        numero_quartos: 1,
        numero_hospedes: reservation.guests,
        valor_total: reservation.total,
        observacoes: reservation.observacoes || '',
        nome_cliente: user?.nome || '',
        email_cliente: user?.email || '',
        telefone_cliente: user?.telefone || ''
      };

      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(backendReservation),
      });

      const data = await response.json();

      if (data.success) {
        await fetchReservations(); // Recarregar lista
        await refreshHotels(); // Atualizar disponibilidade de quartos
        return true;
      } else {
        showError('Erro', data.message || 'Erro ao criar reserva');
      }

      return false;
    } catch (error) {
      console.error('Erro ao adicionar reserva:', error);
      showError('Erro', 'Erro ao conectar com o servidor');

      return false;
    }
  };

  const cancelReservation = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        await fetchReservations(); // Recarregar lista
        await refreshHotels(); // Atualizar disponibilidade de quartos
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      return false;
    }
  };

  const updateReservation = async (id, updatedReservation) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedReservation),
      });

      const data = await response.json();

      if (data.success) {
        await fetchReservations(); // Recarregar lista
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      return false;
    }
  };

  return (
    <ReservationContext.Provider value={{
      reservations,
      addReservation,
      cancelReservation,
      updateReservation,
      loading,
      refreshReservations: fetchReservations
    }}>
      {children}
    </ReservationContext.Provider>
  );
};
