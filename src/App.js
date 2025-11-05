import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { HotelProvider } from "./contexts/HotelContext";
import { ReservationProvider } from "./contexts/ReservationContext";
import Home from "./components/Home";
import Hoteis from "./components/Hoteis";
import AddHotel from "./components/AddHotel";
import HotelDetalhes from "./components/HotelDetalhes";
import Reserva from "./components/Reserva";
import Dashboard from "./components/Dashboard";
import Perfil from "./components/Perfil";
import Configuracoes from "./components/Configuracoes";
import NotFound from "./components/NotFound";
import "./App.css";

function AppContent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-purple-50 text-gray-900"} transition-colors duration-300 flex flex-col`}>
        <nav className={`shadow-md p-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <div className="container mx-auto flex justify-between items-center">
            <div className="space-x-4">
              <Link className={`hover:text-purple-800 transition-colors font-medium ${theme === "dark" ? "text-purple-400 hover:text-purple-300" : "text-purple-600"}`} to="/">Home</Link>
              <Link className={`hover:text-purple-800 transition-colors font-medium ${theme === "dark" ? "text-purple-400 hover:text-purple-300" : "text-purple-600"}`} to="/hoteis">Hotéis</Link>
              <Link className={`hover:text-purple-800 transition-colors font-medium ${theme === "dark" ? "text-purple-400 hover:text-purple-300" : "text-purple-600"}`} to="/dashboard">Dashboard</Link>
            </div>
            <button onClick={toggleTheme} className={`px-4 py-2 rounded-md hover:bg-purple-300 transition-colors font-medium ${theme === "dark" ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-purple-200 text-purple-800"}`}>
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </nav>
        <main className="container mx-auto p-4 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hoteis" element={<Hoteis />} />
            <Route path="/add-hotel" element={<AddHotel />} />
            <Route path="/hoteis/:id" element={<HotelDetalhes />} />
            <Route path="/reserva/:id" element={<Reserva />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="perfil" element={<Perfil />} />
              <Route path="configuracoes" element={<Configuracoes />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className={`shadow-md p-4 mt-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <div className="container mx-auto text-center">
          </div>
        </footer>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <HotelProvider>
        <ReservationProvider>
          <AppContent />
        </ReservationProvider>
      </HotelProvider>
    </ThemeProvider>
  );
}

export default App;
