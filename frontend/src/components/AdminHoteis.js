import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFeedback } from "../contexts/FeedbackContext";
import API_BASE_URL from "../config/api";
import { Hotel, ArrowLeft, CheckCircle, Clock, Trash2, Eye, XCircle, User, MapPin, Filter } from "lucide-react";

const AdminHoteis = () => {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirm } = useFeedback();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos'); // todos, aprovados, pendentes

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
      return;
    }

    fetchHotels();

    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      fetchHotels();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAdmin, navigate, token]);

  const fetchHotels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/hotels`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log('Hotéis carregados:', data.hotels.length, 'hotéis');
        console.log('Rejeitados:', data.hotels.filter(h => h.rejeitado).length);
        setHotels(data.hotels);
      }
    } catch (error) {
      console.error('Erro ao carregar hotéis:', error);
      showError('Erro', 'Não foi possível carregar os hotéis.');
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (hotelId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/hotels/${hotelId}/aprovar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Sucesso', data.message);
        await fetchHotels();
      } else {
        showError('Erro', data.message);
      }
    } catch (error) {
      console.error('Erro ao aprovar hotel:', error);
      showError('Erro', 'Erro ao aprovar hotel');
    }
  };

  const handleReprovar = async (hotelId) => {
    const confirmed = await showConfirm('Confirmar Reprovação', 'Tem certeza que deseja reprovar este hotel?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/hotels/${hotelId}/reprovar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Sucesso', data.message);
        console.log('Hotel reprovado, atualizando lista...');
        await fetchHotels();
      } else {
        showError('Erro', data.message);
      }
    } catch (error) {
      console.error('Erro ao reprovar hotel:', error);
      showError('Erro', 'Erro ao reprovar hotel');
    }
  };

  const handleDelete = async (hotelId) => {
    const confirmed = await showConfirm('Confirmar Exclusão', 'Tem certeza que deseja deletar este hotel?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Sucesso', data.message);
        fetchHotels();
      } else {
        showError('Erro', data.message);
      }
    } catch (error) {
      console.error('Erro ao deletar hotel:', error);
      showError('Erro', 'Erro ao deletar hotel');
    }
  };

  const filteredHotels = hotels.filter(hotel => {
    if (filter === 'aprovados') return hotel.aprovado;
    if (filter === 'pendentes') return !hotel.aprovado && !hotel.rejeitado;
    if (filter === 'rejeitados') return hotel.rejeitado;
    return true;
  });

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
          <Hotel className="w-8 h-8" />
          Gerenciar Hotéis
        </h1>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </button>
      </div>

      {/* Filtros */}
      {/* Filtros */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <button
          onClick={() => setFilter('todos')}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${filter === 'todos'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-purple-800 dark:text-purple-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
        >
          <Filter className="w-4 h-4" />
          Todos ({hotels.length})
        </button>
        <button
          onClick={() => setFilter('aprovados')}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${filter === 'aprovados'
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-purple-800 dark:text-purple-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
        >
          <CheckCircle className="w-4 h-4" />
          Aprovados ({hotels.filter(h => h.aprovado).length})
        </button>
        <button
          onClick={() => setFilter('pendentes')}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${filter === 'pendentes'
            ? 'bg-yellow-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-purple-800 dark:text-purple-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
        >
          <Clock className="w-4 h-4" />
          Pendentes ({hotels.filter(h => !h.aprovado && !h.rejeitado).length})
        </button>
        <button
          onClick={() => setFilter('rejeitados')}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${filter === 'rejeitados'
            ? 'bg-red-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-purple-800 dark:text-purple-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
        >
          <XCircle className="w-4 h-4" />
          Rejeitados ({hotels.filter(h => h.rejeitado).length})
        </button>
      </div>

      {/* Lista de Hotéis */}
      <div className="grid grid-cols-1 gap-6">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id || hotel._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-purple-200 dark:border-purple-700"
          >
            <div className="flex flex-col md:flex-row">
              <img
                src={hotel.imagem}
                alt={hotel.nome}
                className="w-full md:w-48 h-48 object-cover"
              />
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200">
                      {hotel.nome}
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400">
                      {hotel.localizacao}
                    </p>
                    <p className="text-sm text-purple-500 dark:text-purple-400 mt-1 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Proprietário: {hotel.proprietario_nome} ({hotel.proprietario_email})
                    </p>
                  </div>
                  <div>
                    {hotel.rejeitado ? (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Reprovado
                      </span>
                    ) : hotel.aprovado ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Aprovado
                      </span>
                    ) : (
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Pendente
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-purple-600 dark:text-purple-400 mb-3">
                  {hotel.descricao}
                </p>

                {/* Tipos de Quartos */}
                <div className="mb-3">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                    Tipos de Quartos:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {hotel.tipos_quartos?.map((tipo, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-sm"
                      >
                        {tipo.nome} - R$ {parseFloat(tipo.preco_por_noite).toFixed(2)}/noite ({tipo.quantidade_disponivel} disponíveis)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {!hotel.aprovado && (
                    <button
                      onClick={() => handleAprovar(hotel.id || hotel._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Aprovar
                    </button>
                  )}
                  {hotel.aprovado && (
                    <button
                      onClick={() => handleReprovar(hotel.id || hotel._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Desaprovar
                    </button>
                  )}
                  {!hotel.aprovado && !hotel.rejeitado && (
                    <button
                      onClick={() => handleReprovar(hotel.id || hotel._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reprovar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(hotel.id || hotel._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <div className="text-center py-8 text-purple-500 dark:text-purple-400">
          Nenhum hotel encontrado.
        </div>
      )}
    </div>
  );
};

export default AdminHoteis;
