import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFeedback } from "../contexts/FeedbackContext";
import API_BASE_URL from "../config/api";
import { Hotel, ArrowLeft, Clock, CheckCircle, XCircle, Trash2, Eye, User } from "lucide-react";

const AdminHoteisPendentes = () => {
    const { token, isAdmin } = useAuth();
    const navigate = useNavigate();
    const { showSuccess, showError, showConfirm } = useFeedback();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAdmin()) {
            navigate("/");
            return;
        }

        fetchPendingHotels();

        // Auto-refresh a cada 30 segundos
        const interval = setInterval(() => {
            fetchPendingHotels();
        }, 30000);

        return () => clearInterval(interval);
    }, [isAdmin, navigate, token]);

    const fetchPendingHotels = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/hotels/pendentes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                setHotels(data.hotels);
            }
        } catch (error) {
            console.error('Erro ao carregar hotéis pendentes:', error);
            showError('Erro', 'Não foi possível carregar os hotéis pendentes.');
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
                fetchPendingHotels();
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
                fetchPendingHotels();
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
                fetchPendingHotels();
            } else {
                showError('Erro', data.message);
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
                    Hotéis Pendentes de Aprovação
                </h1>
                <button
                    onClick={() => navigate("/admin-dashboard")}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar ao Dashboard
                </button>
            </div>

            {hotels.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-purple-200 dark:border-purple-700">
                    <p className="text-purple-500 dark:text-purple-400 text-lg">
                        Nenhum hotel pendente de aprovação.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {hotels.map((hotel) => (
                        <div
                            key={hotel.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-yellow-400 dark:border-yellow-600"
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
                                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            Pendente
                                        </span>
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
                                            <div className="flex flex-wrap gap-2">
                                                {hotel.tipos_quartos.map((tipo, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-sm"
                                                    >
                                                        {tipo.nome} - R$ {parseFloat(tipo.preco_por_noite).toFixed(2)}/noite ({tipo.quantidade_disponivel} disponíveis)
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Ações */}
                                    <div className="flex gap-2 mt-4 flex-wrap">
                                        <button
                                            onClick={() => handleAprovar(hotel.id)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors font-medium flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Aprovar
                                        </button>
                                        <button
                                            onClick={() => handleReprovar(hotel.id)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reprovar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(hotel.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Deletar
                                        </button>
                                        <button
                                            onClick={() => navigate(`/hoteis/${hotel.id}`)}
                                            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Ver Detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminHoteisPendentes;
