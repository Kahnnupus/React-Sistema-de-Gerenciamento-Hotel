const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
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

    const contactMessage = await ContactMessage.create({
      user_id: req.userId,
      reservation_id: reservation_id || null,
      assunto,
      mensagem
    });

    res.status(201).json({
      success: true,
      message: 'Mensagem enviada com sucesso. Um administrador entrará em contato em breve.',
      messageId: contactMessage._id
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
    const messages = await ContactMessage.find({ user_id: req.userId })
      .populate({
        path: 'reservation_id',
        populate: {
          path: 'hotel_id',
          select: 'nome'
        }
      })
      .sort({ created_at: -1 });

    const formattedMessages = messages.map(msg => {
      const obj = msg.toObject();
      if (obj.reservation_id) {
        obj.reserva_id = obj.reservation_id._id;
        if (obj.reservation_id.hotel_id) {
          obj.hotel_nome = obj.reservation_id.hotel_id.nome;
        }
      }
      return obj;
    });

    res.json({
      success: true,
      messages: formattedMessages
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
