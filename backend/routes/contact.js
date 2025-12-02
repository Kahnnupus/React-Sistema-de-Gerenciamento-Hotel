const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Enviar mensagem de contato
router.post('/', async (req, res) => {
  try {
    const { reservation_id, assunto, mensagem } = req.body;

    if (!assunto || !mensagem) {
      return res.status(400).json({
        success: false,
        message: 'Assunto e mensagem são obrigatórios'
      });
    }

    const [result] = await db.query(
      'INSERT INTO contact_messages (user_id, reservation_id, assunto, mensagem) VALUES (?, ?, ?, ?)',
      [req.userId, reservation_id || null, assunto, mensagem]
    );

    res.status(201).json({
      success: true,
      message: 'Mensagem enviada com sucesso. Um administrador entrará em contato em breve.',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar mensagem'
    });
  }
});

// Listar minhas mensagens
router.get('/minhas-mensagens', async (req, res) => {
  try {
    const [messages] = await db.query(`
      SELECT 
        cm.*,
        r.id as reserva_id,
        h.nome as hotel_nome
      FROM contact_messages cm
      LEFT JOIN reservations r ON cm.reservation_id = r.id
      LEFT JOIN hotels h ON r.hotel_id = h.id
      WHERE cm.user_id = ?
      ORDER BY cm.created_at DESC
    `, [req.userId]);

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Erro ao listar mensagens:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar mensagens'
    });
  }
});

module.exports = router;
