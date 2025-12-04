import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import API_BASE_URL from "../config/api";

const HotelContext = createContext();

export const useHotels = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotels must be used within a HotelProvider");
  }
  return context;
};

export const HotelProvider = ({ children }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHotels = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hotels`);
      const data = await response.json();

      if (data.success) {
        setHotels(data.hotels);
      }
    } catch (error) {
      console.error('Erro ao carregar hotéis:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar hotéis da API
  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const addHotel = async (hotel) => {
    try {
      const token = localStorage.getItem('token');

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      let body;

      if (hotel instanceof FormData) {
        body = hotel;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(hotel);
      }

      const response = await fetch(`${API_BASE_URL}/hotels`, {
        method: 'POST',
        headers,
        body,
      });

      const data = await response.json();

      if (data.success) {
        await fetchHotels(); // Recarregar lista
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message || 'Erro ao cadastrar hotel' };
    } catch (error) {
      console.error('Erro ao adicionar hotel:', error);
      return { success: false, message: 'Erro ao conectar com o servidor' };
    }
  };

  const updateHotel = async (id, updatedHotel) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedHotel),
      });

      const data = await response.json();

      if (data.success) {
        await fetchHotels(); // Recarregar lista
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message || 'Erro ao atualizar hotel' };
    } catch (error) {
      console.error('Erro ao atualizar hotel:', error);
      return { success: false, message: 'Erro ao conectar com o servidor' };
    }
  };

  const deleteHotel = async (id) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        await fetchHotels(); // Recarregar lista
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message || 'Erro ao deletar hotel' };
    } catch (error) {
      console.error('Erro ao deletar hotel:', error);
      return { success: false, message: 'Erro ao conectar com o servidor' };
    }
  };

  return (
    <HotelContext.Provider
      value={{ hotels, addHotel, updateHotel, deleteHotel, loading, refreshHotels: fetchHotels }}
    >
      {children}
    </HotelContext.Provider>
  );
};
