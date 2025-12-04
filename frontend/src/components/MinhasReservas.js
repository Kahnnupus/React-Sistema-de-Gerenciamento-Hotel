import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFeedback } from "../contexts/FeedbackContext";
import API_BASE_URL from "../config/api";
import { Calendar, Hotel, MapPin, User, DollarSign, MessageSquare, Edit, Trash2, Mail, ArrowLeft, BedDouble, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const MinhasReservas = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirm } = useFeedback();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [contactMessage, setContactMessage] = useState({
    assunto: '',
    mensagem: ''
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchReservations();
  }, [user, navigate, token]);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setReservations(data.reservations);

        // Check for reservations canceled due to hotel removal
        const canceledReservations = data.reservations.filter(
          r => r.status === 'cancelada_hotel_removido'
        );

        if (canceledReservations.length > 0) {
          for (const r of canceledReservations) {
            await showConfirm(
              'Atenção',
              `O hotel "${r.hotel_nome_backup || 'Desconhecido'}" foi removido da plataforma e sua reserva foi cancelada.`,
              'Entendi'
            );

            // Delete the reservation after notification
            try {
              await fetch(`${API_BASE_URL}/reservations/${r.id || r._id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
            } catch (error) {
              console.error('Erro ao limpar reserva cancelada:', error);
            }
          }
          // Refresh list
          fetchReservations();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
      showError('Erro', 'Não foi possível carregar suas reservas.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (reservationId) => {
    const confirmed = await showConfirm('Confirmar Cancelamento', 'Tem certeza que deseja cancelar esta reserva?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Sucesso', 'Reserva cancelada com sucesso!');
        await fetchReservations(); // Force immediate update
      } else {
        showError('Erro', data.message || 'Erro ao cancelar reserva');
      }
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      showError('Erro', 'Erro ao cancelar reserva');
    }
  };

  const handleOpenContact = (reservation) => {
    setSelectedReservation(reservation);
    setContactMessage({
      assunto: `Alteração na reserva #${reservation.id}`,
      mensagem: ''
    });
    setShowContactModal(true);
  };

  const handleSendContact = async () => {
    if (!contactMessage.mensagem.trim()) {
      showError('Atenção', 'Por favor, escreva uma mensagem');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservation_id: selectedReservation.id,
          assunto: contactMessage.assunto,
          mensagem: contactMessage.mensagem
        }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Sucesso', data.message);
        setShowContactModal(false);
        setContactMessage({ assunto: '', mensagem: '' });
      } else {
        showError('Erro', data.message || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      showError('Erro', 'Erro ao enviar mensagem');
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
          <Calendar className="w-8 h-8" />
          Minhas Reservas
        </h1>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-purple-500 dark:text-purple-400 mb-4">
            Você ainda não tem reservas.
          </p>
          <button
            onClick={() => navigate("/hoteis")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center gap-2 mx-auto"
          >
            <Hotel className="w-4 h-4" />
            Ver Hotéis Disponíveis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-purple-200 dark:border-purple-700"
            >
              <div className="flex flex-col md:flex-row">
                <img
                  src={reservation.hotel_imagem}
                  alt={reservation.hotel_nome}
                  className="w-full md:w-48 h-48 object-cover"
                />
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200">
                        {reservation.hotel_nome}
                      </h3>
                      <p className="text-purple-600 dark:text-purple-400">
                        {reservation.hotel_localizacao}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${reservation.status === 'ativa'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-400 text-white'
                        }`}
                    >
                      {reservation.status === 'ativa' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {reservation.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-purple-500 dark:text-purple-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Check-in
                      </p>
                      <p className="font-semibold text-purple-800 dark:text-purple-200">
                        {new Date(reservation.check_in).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-500 dark:text-purple-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Check-out
                      </p>
                      <p className="font-semibold text-purple-800 dark:text-purple-200">
                        {new Date(reservation.check_out).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-500 dark:text-purple-400 flex items-center gap-1">
                        <BedDouble className="w-3 h-3" /> Tipo de Quarto
                      </p>
                      <p className="font-semibold text-purple-800 dark:text-purple-200">
                        {reservation.tipo_quarto_nome}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-500 dark:text-purple-400 flex items-center gap-1">
                        <Hotel className="w-3 h-3" /> Quartos
                      </p>
                      <p className="font-semibold text-purple-800 dark:text-purple-200">
                        {reservation.numero_quartos}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-500 dark:text-purple-400 flex items-center gap-1">
                        <User className="w-3 h-3" /> Hóspedes
                      </p>
                      <p className="font-semibold text-purple-800 dark:text-purple-200">
                        {reservation.numero_hospedes}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-500 dark:text-purple-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> Valor Total
                      </p>
                      <p className="font-semibold text-purple-800 dark:text-purple-200">
                        R$ {parseFloat(reservation.valor_total).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {reservation.observacoes && (
                    <div className="mb-3">
                      <p className="text-sm text-purple-500 dark:text-purple-400 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> Observações
                      </p>
                      <p className="text-purple-600 dark:text-purple-400">
                        {reservation.observacoes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4 flex-wrap">
                    {reservation.status === 'ativa' && (
                      <button
                        onClick={() => navigate(`/editar-reserva/${reservation.id}`)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar Reserva
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenContact(reservation)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Contatar Administrador
                    </button>
                    {reservation.status === 'ativa' && (
                      <button
                        onClick={() => handleCancelar(reservation.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Cancelar Reserva
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Contato */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">
              Contatar Administrador
            </h3>

            <div className="mb-4">
              <label className="block text-purple-700 dark:text-purple-300 mb-2">
                Assunto
              </label>
              <input
                type="text"
                value={contactMessage.assunto}
                onChange={(e) => setContactMessage({ ...contactMessage, assunto: e.target.value })}
                className="w-full px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              />
            </div>

            <div className="mb-4">
              <label className="block text-purple-700 dark:text-purple-300 mb-2">
                Mensagem
              </label>
              <textarea
                value={contactMessage.mensagem}
                onChange={(e) => setContactMessage({ ...contactMessage, mensagem: e.target.value })}
                rows="4"
                className="w-full px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
                placeholder="Descreva sua solicitação de alteração..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSendContact}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Enviar
              </button>
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinhasReservas;
