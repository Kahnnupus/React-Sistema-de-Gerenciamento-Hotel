import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFeedback } from "../contexts/FeedbackContext";
import API_BASE_URL from "../config/api";
import { Hotel, Calendar, Eye, Trash2, CheckCircle, Clock, AlertTriangle, Edit } from "lucide-react";

const MeusHoteis = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirm } = useFeedback();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchMyHotels();
  }, []);

  const fetchMyHotels = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hotels/meus-hoteis`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log('Hotéis recebidos:', data.hotels);
        setHotels(data.hotels);
      }
    } catch (error) {
      console.error('Erro ao carregar meus hotéis:', error);
      showError('Erro', 'Não foi possível carregar seus hotéis.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hotelId) => {
    const confirmed = await showConfirm('Confirmar Exclusão', 'Tem certeza que deseja deletar este hotel? Esta ação não pode ser desfeita.');
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
        showSuccess('Sucesso', 'Hotel deletado com sucesso!');
        fetchMyHotels();
      } else {
        showError('Erro', data.message || 'Erro ao deletar hotel');
      }
    } catch (error) {
      console.error('Erro ao deletar hotel:', error);
      showError('Erro', 'Erro ao deletar hotel');
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 flex items-center gap-2">
          <Hotel className="w-8 h-8" />
          Meus Hotéis
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/add-hotel")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
          >
            <Hotel className="w-4 h-4" />
            Cadastrar Novo Hotel
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-purple-200 dark:border-purple-700">
          <Hotel className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <p className="text-purple-500 dark:text-purple-400 mb-4">
            Você ainda não cadastrou nenhum hotel.
          </p>
          <button
            onClick={() => navigate("/add-hotel")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Cadastrar Primeiro Hotel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
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
                    </div>
                    <div className="flex items-center gap-2">
                      {hotel.aprovado ? (
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

                  {/* Comodidades */}
                  {hotel.comodidades && hotel.comodidades.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                        Comodidades:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {hotel.comodidades.map((comodidade, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-sm"
                          >
                            {comodidade}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tipos de Quartos */}
                  {hotel.tipos_quartos && hotel.tipos_quartos.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                        Tipos de Quartos:
                      </h4>
                      <div className="space-y-2">
                        {hotel.tipos_quartos.map((tipo) => (
                          <div
                            key={tipo.id}
                            className="bg-purple-50 dark:bg-gray-700 p-2 rounded"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-semibold text-purple-800 dark:text-purple-200">
                                  {tipo.nome}
                                </span>
                                {tipo.descricao && (
                                  <p className="text-sm text-purple-600 dark:text-purple-400">
                                    {tipo.descricao}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-purple-800 dark:text-purple-200">
                                  R$ {parseFloat(tipo.preco_por_noite).toFixed(2)}/noite
                                </p>
                                <p className="text-sm text-purple-600 dark:text-purple-400">
                                  {tipo.quantidade_disponivel} disponíveis
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <button
                      onClick={() => {
                        if (hotel.total_reservas > 0) {
                          navigate(`/meus-hoteis/${hotel.id}/reservas`);
                        } else {
                          showError('Aviso', 'Este hotel ainda não possui reservas.');
                        }
                      }}
                      className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 text-sm ${hotel.total_reservas > 0
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-400 cursor-not-allowed text-white"
                        }`}
                    >
                      <Calendar className="w-4 h-4" />
                      Ver Reservas ({hotel.total_reservas || 0})
                    </button>
                    <button
                      onClick={() => navigate(`/hoteis/${hotel.id}`)}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </button>
                    <button
                      onClick={() => handleDelete(hotel.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Deletar
                    </button>
                  </div>

                  {hotel.rejeitado ? (
                    <div className="mt-3 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded p-3">
                      <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Este hotel foi reprovado pelo administrador. Verifique as informações e entre em contato.
                      </p>
                    </div>
                  ) : !hotel.aprovado && (
                    <div className="mt-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded p-3">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Este hotel está aguardando aprovação do administrador. Ele não está visível para outros usuários ainda.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeusHoteis;
