import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Outlet, Link } from "react-router-dom";

const Dashboard = () => {
  const { isAdmin } = useAuth();
  
  return (
    <div className="animacao-fade-in">
      <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-6">
        Dashboard
      </h1>

      <nav className="mb-6">
        <Link
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 mr-4 transition-colors font-medium"
          to="perfil"
        >
          Perfil
        </Link>
        <Link
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors font-medium"
          to="configuracoes"
        >
          Configurações
        </Link>
        {isAdmin() && (
          <Link
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 ml-4 transition-colors font-medium"
            to="admin"
          >
            Admin
          </Link>
        )}
      </nav>
      <Outlet />
    </div>
  );
};

export default Dashboard;
