import React, { useState, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isLoading } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpenMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 dark:bg-gray-900">
        <div className="text-purple-800 dark:text-purple-200">
          Carregando...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div
        className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-purple-50 text-gray-900"} transition-colors duration-300 flex flex-col`}
      >
        <nav
          className={`shadow-md p-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="container mx-auto grid grid-cols-3 items-center">
            <div className="flex items-center">
              <Link to="/">
                <img
                  src="/favicon.png"
                  alt="Logo"
                  className={`h-8 w-auto transition-all duration-300 ${
                    theme === "light" ? "invert" : ""
                  }`}
                />
              </Link>
            </div>

            <div className="flex justify-center">
              <div className="flex items-center gap-6">
                <Link
                  className={`hover:text-purple-800 transition-colors font-medium ${theme === "dark" ? "text-purple-400 hover:text-purple-300" : "text-purple-600"}`}
                  to="/"
                >
                  Home
                </Link>
                <Link
                  className={`hover:text-purple-800 transition-colors font-medium ${theme === "dark" ? "text-purple-400 hover:text-purple-300" : "text-purple-600"}`}
                  to="/hoteis"
                >
                  Hotéis
                </Link>
              </div>
            </div>

            <div
              className="flex items-center justify-end gap-3 relative"
              ref={menuRef}
            >
              <span
                className={`text-sm ${theme === "dark" ? "text-purple-300" : "text-purple-700"}`}
              >
                Olá, {user.nome.split(" ")[0]}
              </span>

              <button
                onClick={() => setOpenMenu((v) => !v)}
                aria-label="Abrir menu"
                className={`p-2 rounded-md border ${
                  theme === "dark"
                    ? "border-purple-700 hover:bg-gray-700"
                    : "border-purple-300 hover:bg-purple-100"
                }`}
              >
                <span
                  className={`block w-5 h-0.5 ${theme === "dark" ? "bg-purple-300" : "bg-purple-700"} mb-1`}
                ></span>
                <span
                  className={`block w-5 h-0.5 ${theme === "dark" ? "bg-purple-300" : "bg-purple-700"} mb-1`}
                ></span>
                <span
                  className={`block w-5 h-0.5 ${theme === "dark" ? "bg-purple-300" : "bg-purple-700"}`}
                ></span>
              </button>

              <button
                onClick={toggleTheme}
                className={`px-3 py-2 rounded-md transition-colors font-medium ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-purple-200 text-purple-800 hover:bg-purple-300"
                }`}
              >
                {theme === "light" ? "Dark" : "Light"}
              </button>

              {openMenu && (
                <div
                  className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 ${
                    theme === "dark"
                      ? "bg-gray-800 border-purple-700"
                      : "bg-white border-purple-200"
                  }`}
                >
                  <Link
                    to="/dashboard/perfil"
                    onClick={() => setOpenMenu(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-700 ${
                      theme === "dark"
                        ? "text-purple-200 hover:bg-gray-700"
                        : "text-purple-800 hover:bg-purple-100"
                    }`}
                  >
                    Meu perfil
                  </Link>
                  <Link
                    to="/dashboard/configuracoes"
                    onClick={() => setOpenMenu(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-700 ${
                      theme === "dark"
                        ? "text-purple-200 hover:bg-gray-700"
                        : "text-purple-800  hover:bg-purple-100"
                    }`}
                  >
                    Configurações
                  </Link>
                  <button
                    onClick={() => {
                      setOpenMenu(false);
                      logout();
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      theme === "dark"
                        ? "text-red-300 hover:bg-gray-700"
                        : "text-red-700 hover:bg-red-50"
                    }`}
                  >
                    Sair da conta
                  </button>
                </div>
              )}
            </div>
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

        <footer
          className={`shadow-md p-4 mt-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="container mx-auto text-center"></div>
        </footer>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HotelProvider>
          <ReservationProvider>
            <AppContent />
          </ReservationProvider>
        </HotelProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
