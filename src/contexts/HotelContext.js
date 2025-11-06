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
      precoPorNoite: 250.0,
      descricao: "Hotel luxuoso com vista para o mar, piscina infinita e spa.",
      imagem:
        "https://media-cdn.tripadvisor.com/media/photo-s/0d/5a/9e/12/orla-copacabana-hotel.jpg",
      comodidades: [
        "Wi-Fi gratuito",
        "Piscina",
        "Spa",
        "Restaurante",
        "Vista para o mar",
      ],
      quartosDisponiveis: 20,
    },
    {
      id: 2,
      nome: "Mountain Resort",
      localizacao: "Curitiba, Brasil",
      precoPorNoite: 180.0,
      descricao: "Resort nas montanhas com chalés aconchegantes e lareira.",
      imagem:
        "https://mcities.com.br/curitiba/wp-content/uploads/sites/3/2021/06/varshana-boutique-hotel-1024x682.jpg",
      comodidades: [
        "Wi-Fi gratuito",
        "Lareira",
        "Café da manhã incluído",
        "Trilhas",
        "Vista para as montanhas",
      ],
      quartosDisponiveis: 15,
    },
    {
      id: 3,
      nome: "Urban Hotel",
      localizacao: "São Paulo, Brasil",
      precoPorNoite: 150.0,
      descricao:
        "Hotel moderno no centro da cidade, próximo a pontos turísticos.",
      imagem:
        "https://viagem.cnnbrasil.com.br/wp-content/uploads/sites/5/2025/01/suite-W-HOTEL-SAO-PAULO-SAULO-TAFARELO.jpg?w=1024",
      comodidades: [
        "Wi-Fi gratuito",
        "Academia",
        "Café da manhã incluído",
        "Localização central",
        "Estacionamento",
      ],
      quartosDisponiveis: 30,
    },
  ]);

  const addHotel = (hotel) => {
    setHotels((prev) => [...prev, { ...hotel, id: Date.now() }]);
  };

  const updateHotel = (id, updatedHotel) => {
    setHotels((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updatedHotel } : h))
    );
  };

  const deleteHotel = (id) => {
    setHotels((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <HotelContext.Provider
      value={{ hotels, addHotel, updateHotel, deleteHotel }}
    >
      {children}
    </HotelContext.Provider>
  );
};
