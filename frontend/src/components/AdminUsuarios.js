import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFeedback } from "../contexts/FeedbackContext";
import API_BASE_URL from "../config/api";
import { Users, ArrowLeft, Search, Shield, Trash2, Check, X, ShieldOff } from "lucide-react";

const AdminUsuarios = () => {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirm } = useFeedback();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
      return;
    }

    fetchUsers();

    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      fetchUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAdmin, navigate, token]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      showError('Erro', 'Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId, isCurrentlyAdmin) => {
    try {
      const endpoint = isCurrentlyAdmin ? 'remover-admin' : 'tornar-admin';

      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Sucesso', data.message);
        fetchUsers();
      } else {
        showError('Erro', data.message);
      }
    } catch (error) {
      console.error('Erro ao alterar privilégios:', error);
      showError('Erro', 'Erro ao alterar privilégios do usuário');
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = await showConfirm('Confirmar Exclusão', 'Tem certeza que deseja deletar este usuário?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Sucesso', data.message);
        fetchUsers();
      } else {
        showError('Erro', data.message);
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      showError('Erro', 'Erro ao deletar usuário');
    }
  };

  const filteredUsers = users.filter(user =>
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-purple-600 dark:text-purple-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="animacao-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 flex items-center gap-2">
          <Users className="w-8 h-8" />
          Gerenciar Usuários
        </h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </button>
      </div>

      {/* Busca */}
      <div className="mb-6 relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
        />
      </div>

      {/* Lista de Usuários */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Telefone</th>
              <th className="px-4 py-3 text-center">Hotéis</th>
              <th className="px-4 py-3 text-center">Reservas</th>
              <th className="px-4 py-3 text-center">Admin</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id || user._id}
                className="border-b border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-3 text-purple-800 dark:text-purple-200">
                  {user.nome || '-'}
                </td>
                <td className="px-4 py-3 text-purple-600 dark:text-purple-400">
                  {user.email}
                </td>
                <td className="px-4 py-3 text-purple-600 dark:text-purple-400">
                  {user.telefone || '-'}
                </td>
                <td className="px-4 py-3 text-center text-purple-800 dark:text-purple-200">
                  {user.total_hoteis}
                </td>
                <td className="px-4 py-3 text-center text-purple-800 dark:text-purple-200">
                  {user.total_reservas}
                </td>
                <td className="px-4 py-3 text-center">
                  {user.is_admin ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-sm flex items-center justify-center gap-1 w-fit mx-auto">
                      <Check className="w-3 h-3" /> Sim
                    </span>
                  ) : (
                    <span className="bg-gray-400 text-white px-2 py-1 rounded text-sm flex items-center justify-center gap-1 w-fit mx-auto">
                      <X className="w-3 h-3" /> Não
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleToggleAdmin(user.id || user._id, user.is_admin)}
                      className={`${user.is_admin
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-green-500 hover:bg-green-600'
                        } text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1`}
                      title={user.is_admin ? 'Remover Admin' : 'Tornar Admin'}
                    >
                      {user.is_admin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id || user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                      title="Deletar Usuário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-purple-500 dark:text-purple-400">
            Nenhum usuário encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsuarios;
