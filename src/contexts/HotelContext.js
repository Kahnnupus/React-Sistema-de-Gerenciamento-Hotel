import React, { createContext, useContext, useState } from "react";

const HotelContext = createContext();

export const useHotels = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotels must be used within a HotelProvider");
  }
  return context;
};

export const HotelProvider = ({ children }) => {
  const [hotels, setHotels] = useState([
    {
      id: 1,
      nome: "Hotel Paradiso",
      localizacao: "Rio de Janeiro, Brasil",
      precoPorNoite: 250.00,
      descricao: "Hotel luxuoso com vista para o mar, piscina infinita e spa.",
      imagem: "https://via.placeholder.com/400x300?text=Hotel+Paradiso",
      comodidades: ["Wi-Fi gratuito", "Piscina", "Spa", "Restaurante", "Vista para o mar"],
      quartosDisponiveis: 20,
    },
    {
      id: 2,
      nome: "Mountain Resort",
      localizacao: "Serra Negra, Brasil",
      precoPorNoite: 180.00,
      descricao: "Resort nas montanhas com chalés aconchegantes e lareira.",
      imagem: "https://via.placeholder.com/400x300?text=Mountain+Resort",
      comodidades: ["Wi-Fi gratuito", "Lareira", "Café da manhã incluído", "Trilhas", "Vista para as montanhas"],
      quartosDisponiveis: 15,
    },
    {
      id: 3,
      nome: "Urban Hotel",
      localizacao: "São Paulo, Brasil",
      precoPorNoite: 150.00,
      descricao: "Hotel moderno no centro da cidade, próximo a pontos turísticos.",
      imagem: "https://via.placeholder.com/400x300?text=Urban+Hotel",
      comodidades: ["Wi-Fi gratuito", "Academia", "Café da manhã incluído", "Localização central", "Estacionamento"],
      quartosDisponiveis: 30,
    },
  ]);

  const addHotel = (hotel) => {
    setHotels((prev) => [...prev, { ...hotel, id: Date.now() }]);
  };

  const updateHotel = (id, updatedHotel) => {
    setHotels((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updatedHotel } : h)),
    );
  };

  const deleteHotel = (id) => {
    setHotels((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <HotelContext.Provider value={{ hotels, addHotel, updateHotel, deleteHotel }}>
      {children}
    </HotelContext.Provider>
  );
};
