const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Hotel = require('../models/Hotel');
const RoomType = require('../models/RoomType');
const authMiddleware = require('../middleware/auth');

// Listar todas as reservas do usuário autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user_id: req.userId })
      .populate('hotel_id', 'nome localizacao imagem')
      .populate('room_type_id', 'nome descricao')
      .sort({ created_at: -1 });

    const formattedReservations = reservations.map(r => ({
      ...r.toObject(),
      hotel_nome: r.hotel_id?.nome || 'Hotel Removido',
      hotel_localizacao: r.hotel_id?.localizacao || '',
      hotel_imagem: r.hotel_id?.imagem || '',
      tipo_quarto_nome: r.room_type_id?.nome || 'Quarto Removido',
      tipo_quarto_descricao: r.room_type_id?.descricao || ''
    }));

    res.json({
      success: true,
      reservations: formattedReservations
    });
  } catch (error) {
    console.error('Erro ao listar reservas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar reservas'
    });
  }
});

// Buscar reserva por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ _id: req.params.id, user_id: req.userId })
      .populate('hotel_id', 'nome localizacao imagem')
      .populate('room_type_id', 'nome descricao preco_por_noite capacidade_pessoas');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    res.json({
      success: true,
      reservation: {
        ...reservation.toObject(),
        hotel_nome: reservation.hotel_id?.nome || 'Hotel Removido',
        hotel_localizacao: reservation.hotel_id?.localizacao || '',
        hotel_imagem: reservation.hotel_id?.imagem || '',
        tipo_quarto_nome: reservation.room_type_id?.nome || 'Quarto Removido',
        tipo_quarto_descricao: reservation.room_type_id?.descricao || '',
        preco_por_noite: reservation.room_type_id?.preco_por_noite || 0,
        capacidade_pessoas: reservation.room_type_id?.capacidade_pessoas || 0
      }
    });
  } catch (error) {
    console.error('Erro ao buscar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar reserva'
    });
  }
});

// Criar nova reserva
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      hotel_id,
      room_type_id,
      check_in,
      check_out,
      numero_quartos,
      numero_hospedes,
      valor_total,
      observacoes,
      nome_cliente,
      email_cliente,
      telefone_cliente
    } = req.body;

    // Validar campos obrigatórios
    if (!hotel_id || !room_type_id || !check_in || !check_out || !nome_cliente || !email_cliente) {
      return res.status(400).json({
        success: false,
        message: 'Hotel, tipo de quarto, datas, nome e email são obrigatórios'
      });
    }

    // Verificar se hotel existe e está aprovado
    const hotel = await Hotel.findById(hotel_id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel não encontrado'
      });
    }

    if (!hotel.aprovado) {
      return res.status(400).json({
        success: false,
        message: 'Este hotel ainda não foi aprovado'
      });
    }

    // Verificar se tipo de quarto existe e tem disponibilidade
    const roomType = await RoomType.findOne({ _id: room_type_id, hotel_id: hotel_id });

    if (!roomType) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de quarto não encontrado'
      });
    }

    if (roomType.quantidade_disponivel < (numero_quartos || 1)) {
      return res.status(400).json({
        success: false,
        message: 'Quartos insuficientes disponíveis'
      });
    }

    // Inserir reserva
    const reservation = await Reservation.create({
      user_id: req.userId,
      hotel_id,
      room_type_id,
      check_in,
      check_out,
      numero_quartos: numero_quartos || 1,
      numero_hospedes: numero_hospedes || 1,
      valor_total,
      observacoes,
      nome_cliente,
      email_cliente,
      telefone_cliente,
      status: 'ativa'
    });

    // Atualizar quantidade disponível
    roomType.quantidade_disponivel -= (numero_quartos || 1);
    await roomType.save();

    res.status(201).json({
      success: true,
      message: 'Reserva criada com sucesso',
      reservation
    });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar reserva'
    });
  }
});

// Atualizar reserva
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { check_in, check_out, numero_quartos, numero_hospedes, observacoes, status, nome_cliente, email_cliente, telefone_cliente } = req.body;

    // Verificar se reserva existe e pertence ao usuário
    const reservation = await Reservation.findOne({ _id: req.params.id, user_id: req.userId });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    // Atualizar reserva
    // Atualizar campos
    reservation.check_in = check_in || reservation.check_in;
    reservation.check_out = check_out || reservation.check_out;
    reservation.numero_quartos = numero_quartos || reservation.numero_quartos;
    reservation.numero_hospedes = numero_hospedes || reservation.numero_hospedes;
    if (observacoes !== undefined) reservation.observacoes = observacoes;
    reservation.status = status || reservation.status;
    reservation.nome_cliente = nome_cliente || reservation.nome_cliente;
    reservation.email_cliente = email_cliente || reservation.email_cliente;
    reservation.telefone_cliente = telefone_cliente || reservation.telefone_cliente;

    // Recalcular valor total se datas ou quartos mudaram
    if (check_in || check_out || numero_quartos) {
      const roomType = await RoomType.findById(reservation.room_type_id);
      if (roomType) {
        const start = new Date(reservation.check_in);
        const end = new Date(reservation.check_out);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Mínimo 1 dia
        reservation.valor_total = diffDays * roomType.preco_por_noite * reservation.numero_quartos;
      }
    }

    await reservation.save();

    res.json({
      success: true,
      message: 'Reserva atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar reserva'
    });
  }
});

// Cancelar reserva
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Buscar reserva
    const reservation = await Reservation.findOne({ _id: req.params.id, user_id: req.userId });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    // Devolver quartos ao tipo de quarto
    const roomType = await RoomType.findById(reservation.room_type_id);
    if (roomType) {
      roomType.quantidade_disponivel += reservation.numero_quartos;
      await roomType.save();
    }

    // Deletar reserva
    await Reservation.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Reserva cancelada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar reserva'
    });
  }
});

module.exports = router;
