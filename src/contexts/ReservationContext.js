import React, { createContext, useContext, useState } from "react";

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

  const addReservation = (reservation) => {
    setReservations((prev) => [...prev, { ...reservation, id: Date.now() }]);
  };

  const cancelReservation = (id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const updateReservation = (id, updatedReservation) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedReservation } : r)),
    );
  };

  return (
    <ReservationContext.Provider value={{ reservations, addReservation, cancelReservation, updateReservation }}>
      {children}
    </ReservationContext.Provider>
  );
};
