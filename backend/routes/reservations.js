const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Listar todas as reservas do usuário autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [reservations] = await db.query(`
      SELECT 
        r.*,
        h.nome as hotel_nome,
        h.localizacao as hotel_localizacao,
        h.imagem as hotel_imagem,
        rt.nome as tipo_quarto_nome,
        rt.descricao as tipo_quarto_descricao
      FROM reservations r
      INNER JOIN hotels h ON r.hotel_id = h.id
      INNER JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [req.userId]);

    res.json({
      success: true,
      reservations
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
    const [reservations] = await db.query(`
      SELECT 
        r.*,
        h.nome as hotel_nome,
        h.localizacao as hotel_localizacao,
        h.imagem as hotel_imagem,
        rt.nome as tipo_quarto_nome,
        rt.descricao as tipo_quarto_descricao,
        rt.descricao as tipo_quarto_descricao,
        rt.preco_por_noite,
        rt.capacidade_pessoas
      FROM reservations r
      INNER JOIN hotels h ON r.hotel_id = h.id
      INNER JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.id = ? AND r.user_id = ?
    `, [req.params.id, req.userId]);

    if (reservations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    res.json({
      success: true,
      reservation: reservations[0]
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
  const connection = await db.getConnection();

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
    if (!hotel_id || !room_type_id || !check_in || !check_out || !nome_cliente || !email_cliente || !telefone_cliente) {
      return res.status(400).json({
        success: false,
        message: 'Hotel, tipo de quarto, datas, nome, email e telefone são obrigatórios'
      });
    }

    // Verificar se hotel existe e está aprovado
    const [hotels] = await connection.query(
      'SELECT id, aprovado FROM hotels WHERE id = ?',
      [hotel_id]
    );

    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hotel não encontrado'
      });
    }

    if (!hotels[0].aprovado) {
      return res.status(400).json({
        success: false,
        message: 'Este hotel ainda não foi aprovado'
      });
    }

    // Verificar se tipo de quarto existe e tem disponibilidade
    const [roomTypes] = await connection.query(
      'SELECT * FROM room_types WHERE id = ? AND hotel_id = ?',
      [room_type_id, hotel_id]
    );

    if (roomTypes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de quarto não encontrado'
      });
    }

    const roomType = roomTypes[0];

    if (roomType.quantidade_disponivel < (numero_quartos || 1)) {
      return res.status(400).json({
        success: false,
        message: 'Quartos insuficientes disponíveis'
      });
    }

    await connection.beginTransaction();

    // Inserir reserva
    const [result] = await connection.query(
      `INSERT INTO reservations 
       (user_id, hotel_id, room_type_id, check_in, check_out, numero_quartos, numero_hospedes, valor_total, observacoes, nome_cliente, email_cliente, telefone_cliente) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.userId,
        hotel_id,
        room_type_id,
        check_in,
        check_out,
        numero_quartos || 1,
        numero_hospedes || 1,
        valor_total,
        observacoes,
        nome_cliente,
        email_cliente,
        telefone_cliente
      ]
    );

    // Atualizar quantidade disponível
    await connection.query(
      'UPDATE room_types SET quantidade_disponivel = quantidade_disponivel - ? WHERE id = ?',
      [numero_quartos || 1, room_type_id]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Reserva criada com sucesso',
      reservation: {
        id: result.insertId,
        user_id: req.userId,
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
        telefone_cliente,
        status: 'ativa'
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar reserva'
    });
  } finally {
    connection.release();
  }
});

// Atualizar reserva
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { check_in, check_out, numero_quartos, numero_hospedes, observacoes, status, nome_cliente, email_cliente, telefone_cliente } = req.body;

    // Verificar se reserva existe e pertence ao usuário
    const [reservations] = await db.query(
      'SELECT * FROM reservations WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (reservations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    const reservation = reservations[0];

    // Atualizar reserva
    await db.query(
      `UPDATE reservations 
       SET check_in = ?, check_out = ?, numero_quartos = ?, numero_hospedes = ?, observacoes = ?, status = ?, nome_cliente = ?, email_cliente = ?, telefone_cliente = ? 
       WHERE id = ?`,
      [
        check_in || reservation.check_in,
        check_out || reservation.check_out,
        numero_quartos || reservation.numero_quartos,
        numero_hospedes || reservation.numero_hospedes,
        observacoes !== undefined ? observacoes : reservation.observacoes,
        status || reservation.status,
        nome_cliente || reservation.nome_cliente,
        email_cliente || reservation.email_cliente,
        telefone_cliente || reservation.telefone_cliente,
        req.params.id
      ]
    );

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
  const connection = await db.getConnection();

  try {
    // Buscar reserva
    const [reservations] = await connection.query(
      'SELECT * FROM reservations WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (reservations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reserva não encontrada'
      });
    }

    const reservation = reservations[0];

    await connection.beginTransaction();

    // Devolver quartos ao tipo de quarto
    await connection.query(
      'UPDATE room_types SET quantidade_disponivel = quantidade_disponivel + ? WHERE id = ?',
      [reservation.numero_quartos, reservation.room_type_id]
    );

    // Deletar reserva
    await connection.query('DELETE FROM reservations WHERE id = ?', [req.params.id]);

    await connection.commit();

    res.json({
      success: true,
      message: 'Reserva cancelada com sucesso'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao cancelar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar reserva'
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
