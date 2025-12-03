import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API_BASE_URL from "../config/api";

const AdminDashboard = () => {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
      return;
    }

    fetchStats();

    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAdmin, navigate, token]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-purple-600 dark:text-purple-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="animacao-fade-in">
      <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-6">
        Dashboard Administrativo
      </h1>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-purple-200 dark:border-purple-700">
          <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
            Total de Usuários
          </h3>
          <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
            {stats?.total_usuarios || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-purple-200 dark:border-purple-700">
          <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
            Total de Hotéis
          </h3>
          <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
            {stats?.total_hoteis || 0}
          </p>
          <p className="text-sm text-purple-500 dark:text-purple-400 mt-2">
            {stats?.hoteis_aprovados || 0} aprovados | {stats?.hoteis_pendentes || 0} pendentes
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-purple-200 dark:border-purple-700">
          <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">
            Total de Reservas
          </h3>
          <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
            {stats?.total_reservas || 0}
          </p>
          <p className="text-sm text-purple-500 dark:text-purple-400 mt-2">
            {stats?.reservas_ativas || 0} ativas
          </p>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => navigate("/admin/usuarios")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-colors text-left"
        >
          <h3 className="text-xl font-bold mb-2">Gerenciar Usuários</h3>
          <p className="text-purple-100">Ver, editar e gerenciar todos os usuários do sistema</p>
        </button>

        <button
          onClick={() => navigate("/admin/hoteis")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-colors text-left"
        >
          <h3 className="text-xl font-bold mb-2">Gerenciar Hotéis</h3>
          <p className="text-purple-100">Ver todos os hotéis e aprovar cadastros pendentes</p>
        </button>

        <button
          onClick={() => navigate("/admin/hoteis-pendentes")}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-4 px-6 rounded-lg transition-colors text-left"
        >
          <h3 className="text-xl font-bold mb-2">Hotéis Pendentes</h3>
          <p className="text-yellow-100">
            {stats?.hoteis_pendentes || 0} hotéis aguardando aprovação
          </p>
        </button>

        <button
          onClick={() => navigate("/")}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-lg transition-colors text-left"
        >
          <h3 className="text-xl font-bold mb-2">Voltar ao Site</h3>
          <p className="text-gray-100">Retornar à visualização normal do sistema</p>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
