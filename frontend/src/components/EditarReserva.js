import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFeedback } from "../contexts/FeedbackContext";
import API_BASE_URL from "../config/api";

const EditarReserva = () => {
  const { token, user } = useAuth();
  const { showSuccess } = useFeedback();
  const navigate = useNavigate();
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    check_in: "",
    check_out: "",
    numero_quartos: 1,
    numero_hospedes: 1,
    observacoes: "",
    nome_cliente: "",
    email_cliente: "",
    telefone_cliente: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchReservation();
  }, [user, navigate, token, reservationId]);

  const fetchReservation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setReservation(data.reservation);
        setFormData({
          check_in: data.reservation.check_in.split('T')[0],
          check_out: data.reservation.check_out.split('T')[0],
          numero_quartos: data.reservation.numero_quartos,
          numero_hospedes: data.reservation.numero_hospedes,
          observacoes: data.reservation.observacoes || "",
          nome_cliente: data.reservation.nome_cliente || "",
          email_cliente: data.reservation.email_cliente || "",
          telefone_cliente: data.reservation.telefone_cliente || "",
          preco_por_noite: data.reservation.preco_por_noite,
          capacidade_pessoas: data.reservation.capacidade_pessoas
        });
      } else {
        setError(data.message || "Erro ao carregar reserva");
      }
    } catch (error) {
      console.error('Erro ao carregar reserva:', error);
      setError('Erro ao carregar reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numero_hospedes' ? parseInt(value) : value
    }));
  };

  const calcularTotalEstimado = () => {
    if (!formData.check_in || !formData.check_out || !reservation?.preco_por_noite) return 0;
    const start = new Date(formData.check_in);
    const end = new Date(formData.check_out);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * reservation.preco_por_noite : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Validações básicas
    if (new Date(formData.check_in) >= new Date(formData.check_out)) {
      setError("A data de check-out deve ser posterior à data de check-in");
      setSaving(false);
      return;
    }

    if (formData.numero_hospedes < 1) {
      setError("Número de hóspedes deve ser maior que 0");
      setSaving(false);
      return;
    }

    if (reservation.capacidade_pessoas && formData.numero_hospedes > reservation.capacidade_pessoas) {
      setError(`O limite de hóspedes para este quarto é ${reservation.capacidade_pessoas}`);
      setSaving(false);
      return;
    }

    const valor_total = calcularTotalEstimado();

    try {
      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          valor_total: calcularTotalEstimado()
        }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Sucesso', 'Reserva atualizada com sucesso!');
        navigate('/minhas-reservas');
      } else {
        setError(data.message || 'Erro ao atualizar reserva');
      }
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      setError('Erro ao atualizar reserva');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-purple-600 dark:text-purple-400">Carregando...</div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || "Reserva não encontrada"}</p>
        <button
          onClick={() => navigate('/minhas-reservas')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Voltar às Minhas Reservas
        </button>
      </div>
    );
  }

  return (
    <div className="animacao-fade-in max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200">
          Editar Reserva
        </h1>
        <button
          onClick={() => navigate('/minhas-reservas')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Voltar
        </button>
      </div>

      {/* Informações da Reserva */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-purple-200 dark:border-purple-700">
        <h2 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">
          {reservation.hotel_nome}
        </h2>
        <div className="grid grid-cols-2 gap-4 text-purple-600 dark:text-purple-400">
          <div>
            <p className="text-sm font-semibold">Localização</p>
            <p>{reservation.hotel_localizacao}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Tipo de Quarto</p>
            <p>{reservation.tipo_quarto_nome}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Preço por Noite</p>
            <p>R$ {parseFloat(reservation.preco_por_noite).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Status</p>
            <p className={reservation.status === 'ativa' ? 'text-green-600' : 'text-gray-600'}>
              {reservation.status}
            </p>
          </div>
        </div>
      </div>

      {/* Formulário de Edição */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-purple-200 dark:border-purple-700">
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-purple-700 dark:text-purple-300 font-semibold mb-2">
              Data de Check-in
            </label>
            <input
              type="date"
              name="check_in"
              value={formData.check_in}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 font-semibold mb-2">
              Data de Check-out
            </label>
            <input
              type="date"
              name="check_out"
              value={formData.check_out}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-purple-700 dark:text-purple-300 font-semibold mb-2">
              Valor Total Estimado
            </label>
            <div className="w-full px-4 py-2 border border-purple-200 dark:border-purple-600 rounded-md bg-purple-50 dark:bg-gray-700 text-purple-800 dark:text-purple-200 font-bold">
              R$ {calcularTotalEstimado().toFixed(2)}
            </div>
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 font-semibold mb-2">
              Número de Hóspedes
            </label>
            <input
              type="number"
              name="numero_hospedes"
              value={formData.numero_hospedes}
              onChange={handleInputChange}
              min="1"
              max={reservation?.capacidade_pessoas || 10}
              className="w-full px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
            {reservation?.capacidade_pessoas && (
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                Limite máximo: {reservation.capacidade_pessoas} hóspede(s)
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-purple-700 dark:text-purple-300 font-semibold mb-2">
              Nome do Cliente
            </label>
            <input
              type="text"
              name="nome_cliente"
              value={formData.nome_cliente}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            />
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 font-semibold mb-2">
              Email do Cliente
            </label>
            <input
              type="email"
              name="email_cliente"
              value={formData.email_cliente}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            />
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 font-semibold mb-2">
              Telefone do Cliente
            </label>
            <input
              type="tel"
              name="telefone_cliente"
              value={formData.telefone_cliente}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-purple-700 dark:text-purple-300 font-semibold mb-2">
            Observações
          </label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            placeholder="Adicione observações sobre a reserva..."
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-gray-400"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/minhas-reservas')}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarReserva;
