import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFeedback } from "../contexts/FeedbackContext";
import API_BASE_URL from "../config/api";
import { Calendar, User, Mail, Phone, DollarSign, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

const HotelReservas = () => {
    const { hotelId } = useParams();
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const { showError } = useFeedback();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hotelName, setHotelName] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        fetchReservations();
    }, [user, navigate, token, hotelId]);

    const fetchReservations = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}/reservations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                setReservations(data.reservations);
                if (data.reservations.length > 0) {
                    setHotelName(data.reservations[0].hotel_nome);
                }
            } else {
                showError('Erro', data.message || 'Erro ao carregar reservas');
                navigate('/meus-hoteis');
            }
        } catch (error) {
            console.error('Erro ao carregar reservas:', error);
            showError('Erro', 'Não foi possível carregar as reservas.');
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

    const activeReservations = reservations.filter(r => r.status === 'ativa');
    const canceledReservations = reservations.filter(r => r.status === 'cancelada');

    return (
        <div className="animacao-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                        <Calendar className="w-8 h-8" />
                        Reservas do Hotel
                    </h1>
                    {hotelName && (
                        <p className="text-purple-600 dark:text-purple-400 mt-1">{hotelName}</p>
                    )}
                </div>
                <button
                    onClick={() => navigate("/meus-hoteis")}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-600 dark:text-purple-400">Total de Reservas</p>
                            <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{reservations.length}</p>
                        </div>
                        <Calendar className="w-10 h-10 text-purple-400" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 dark:text-green-400">Reservas Ativas</p>
                            <p className="text-2xl font-bold text-green-800 dark:text-green-200">{activeReservations.length}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-red-200 dark:border-red-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-600 dark:text-red-400">Canceladas</p>
                            <p className="text-2xl font-bold text-red-800 dark:text-red-200">{canceledReservations.length}</p>
                        </div>
                        <XCircle className="w-10 h-10 text-red-400" />
                    </div>
                </div>
            </div>

            {reservations.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-purple-200 dark:border-purple-700">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                    <p className="text-purple-500 dark:text-purple-400">
                        Ainda não há reservas para este hotel.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reservations.map((reservation) => (
                        <div
                            key={reservation.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-purple-200 dark:border-purple-700"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200">
                                            Reserva #{reservation.id}
                                        </h3>
                                        {reservation.status === 'ativa' ? (
                                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Ativa
                                            </span>
                                        ) : (
                                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                <XCircle className="w-3 h-3" />
                                                Cancelada
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                            <User className="w-4 h-4" />
                                            <span><strong>Cliente:</strong> {reservation.cliente_nome || 'Não informado'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                            <Mail className="w-4 h-4" />
                                            <span><strong>Email:</strong> {reservation.cliente_email}</span>
                                        </div>
                                        {reservation.cliente_telefone && (
                                            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                                <Phone className="w-4 h-4" />
                                                <span><strong>Telefone:</strong> {reservation.cliente_telefone}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                            <Calendar className="w-4 h-4" />
                                            <span><strong>Tipo de Quarto:</strong> {reservation.tipo_quarto_nome}</span>
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                        <div className="bg-purple-50 dark:bg-gray-700 p-2 rounded">
                                            <p className="text-purple-600 dark:text-purple-400 text-xs">Check-in</p>
                                            <p className="font-semibold text-purple-800 dark:text-purple-200">
                                                {new Date(reservation.check_in).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-gray-700 p-2 rounded">
                                            <p className="text-purple-600 dark:text-purple-400 text-xs">Check-out</p>
                                            <p className="font-semibold text-purple-800 dark:text-purple-200">
                                                {new Date(reservation.check_out).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-gray-700 p-2 rounded">
                                            <p className="text-purple-600 dark:text-purple-400 text-xs flex items-center gap-1">
                                                <DollarSign className="w-3 h-3" />
                                                Valor Total
                                            </p>
                                            <p className="font-semibold text-purple-800 dark:text-purple-200">
                                                R$ {parseFloat(reservation.valor_total).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                        <div className="bg-purple-50 dark:bg-gray-700 p-2 rounded">
                                            <p className="text-purple-600 dark:text-purple-400 text-xs">Quartos</p>
                                            <p className="font-semibold text-purple-800 dark:text-purple-200">
                                                {reservation.numero_quartos}
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-gray-700 p-2 rounded">
                                            <p className="text-purple-600 dark:text-purple-400 text-xs">Hóspedes</p>
                                            <p className="font-semibold text-purple-800 dark:text-purple-200">
                                                {reservation.numero_hospedes}
                                            </p>
                                        </div>
                                    </div>

                                    {reservation.observacoes && (
                                        <div className="mt-3 bg-blue-50 dark:bg-blue-900 p-2 rounded">
                                            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Observações:</p>
                                            <p className="text-sm text-blue-800 dark:text-blue-200">{reservation.observacoes}</p>
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

export default HotelReservas;
