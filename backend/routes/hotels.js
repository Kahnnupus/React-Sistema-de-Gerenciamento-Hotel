const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Listar hotéis aprovados (público)
router.get('/', async (req, res) => {
  try {
    const [hotels] = await db.query(`
      SELECT h.*, u.nome as proprietario_nome, u.email as proprietario_email
      FROM hotels h
      INNER JOIN users u ON h.user_id = u.id
      WHERE h.aprovado = TRUE
      ORDER BY h.created_at DESC
    `);

    // Buscar comodidades e tipos de quartos para cada hotel
    for (let hotel of hotels) {
      const [comodidades] = await db.query(
        'SELECT comodidade FROM hotel_comodidades WHERE hotel_id = ?',
        [hotel.id]
      );
      hotel.comodidades = comodidades.map(c => c.comodidade);

      const [roomTypes] = await db.query(
        'SELECT * FROM room_types WHERE hotel_id = ? ORDER BY preco_por_noite ASC',
        [hotel.id]
      );
      hotel.tipos_quartos = roomTypes;
    }

    res.json({
      success: true,
      hotels
    });
  } catch (error) {
    console.error('Erro ao listar hotéis:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar hotéis'
    });
  }
});

// Listar meus hotéis (requer autenticação)
router.get('/meus-hoteis', authMiddleware, async (req, res) => {
  try {
    const [hotels] = await db.query(`
      SELECT 
        h.*,
        (SELECT COUNT(*) FROM reservations r WHERE r.hotel_id = h.id) as total_reservas
      FROM hotels h
      WHERE h.user_id = ?
      ORDER BY h.created_at DESC
    `, [req.userId]);

    // Buscar comodidades e tipos de quartos para cada hotel
    for (let hotel of hotels) {
      const [comodidades] = await db.query(
        'SELECT comodidade FROM hotel_comodidades WHERE hotel_id = ?',
        [hotel.id]
      );
      hotel.comodidades = comodidades.map(c => c.comodidade);

      const [roomTypes] = await db.query(
        'SELECT * FROM room_types WHERE hotel_id = ? ORDER BY preco_por_noite ASC',
        [hotel.id]
      );
      hotel.tipos_quartos = roomTypes;
    }

    res.json({
      success: true,
      hotels
    });
  } catch (error) {
    console.error('Erro ao listar meus hotéis:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar meus hotéis'
    });
  }
});

// Buscar reservas de um hotel específico (apenas para o proprietário)
router.get('/:hotelId/reservations', authMiddleware, async (req, res) => {
  try {
    const { hotelId } = req.params;

    // Verificar se o hotel pertence ao usuário
    const [hotels] = await db.query(
      'SELECT id FROM hotels WHERE id = ? AND user_id = ?',
      [hotelId, req.userId]
    );

    if (hotels.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para ver as reservas deste hotel'
      });
    }

    // Buscar reservas do hotel
    const [reservations] = await db.query(`
      SELECT 
        r.*,
        u.nome as cliente_nome,
        u.email as cliente_email,
        u.telefone as cliente_telefone,
        rt.nome as tipo_quarto_nome,
        h.nome as hotel_nome
      FROM reservations r
      INNER JOIN users u ON r.user_id = u.id
      INNER JOIN room_types rt ON r.room_type_id = rt.id
      INNER JOIN hotels h ON r.hotel_id = h.id
      WHERE r.hotel_id = ?
      ORDER BY r.created_at DESC
    `, [hotelId]);

    res.json({
      success: true,
      reservations
    });
  } catch (error) {
    console.error('Erro ao buscar reservas do hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar reservas do hotel'
    });
  }
});

// Buscar hotel por ID
router.get('/:id', async (req, res) => {
  try {
    const [hotels] = await db.query(`
      SELECT h.*, u.nome as proprietario_nome, u.email as proprietario_email
      FROM hotels h
      INNER JOIN users u ON h.user_id = u.id
      WHERE h.id = ?
    `, [req.params.id]);

    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hotel não encontrado'
      });
    }

    const hotel = hotels[0];

    // Buscar comodidades
    const [comodidades] = await db.query(
      'SELECT comodidade FROM hotel_comodidades WHERE hotel_id = ?',
      [hotel.id]
    );
    hotel.comodidades = comodidades.map(c => c.comodidade);

    // Buscar tipos de quartos
    const [roomTypes] = await db.query(
      'SELECT * FROM room_types WHERE hotel_id = ? ORDER BY preco_por_noite ASC',
      [hotel.id]
    );
    hotel.tipos_quartos = roomTypes;

    res.json({
      success: true,
      hotel
    });
  } catch (error) {
    console.error('Erro ao buscar hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar hotel'
    });
  }
});

// Criar novo hotel (requer autenticação)
router.post('/', authMiddleware, async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { nome, localizacao, descricao, imagem, comodidades, tipos_quartos } = req.body;

    // Validar campos obrigatórios
    if (!nome) {
      return res.status(400).json({
        success: false,
        message: 'Nome do hotel é obrigatório'
      });
    }

    // Validar tipos de quartos
    if (!tipos_quartos || tipos_quartos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'É necessário cadastrar pelo menos um tipo de quarto'
      });
    }

    await connection.beginTransaction();

    // Inserir hotel (não aprovado por padrão)
    const [result] = await connection.query(
      'INSERT INTO hotels (user_id, nome, localizacao, descricao, imagem, aprovado) VALUES (?, ?, ?, ?, ?, FALSE)',
      [req.userId, nome, localizacao, descricao, imagem]
    );

    const hotelId = result.insertId;

    // Inserir comodidades
    if (comodidades && Array.isArray(comodidades)) {
      for (let comodidade of comodidades) {
        await connection.query(
          'INSERT INTO hotel_comodidades (hotel_id, comodidade) VALUES (?, ?)',
          [hotelId, comodidade]
        );
      }
    }

    // Inserir tipos de quartos
    for (let tipo of tipos_quartos) {
      if (!tipo.nome || !tipo.preco_por_noite) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Nome e preço são obrigatórios para cada tipo de quarto'
        });
      }

      await connection.query(
        'INSERT INTO room_types (hotel_id, nome, descricao, preco_por_noite, capacidade_pessoas, quantidade_disponivel) VALUES (?, ?, ?, ?, ?, ?)',
        [hotelId, tipo.nome, tipo.descricao, tipo.preco_por_noite, tipo.capacidade_pessoas || 2, tipo.quantidade_disponivel || 0]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Hotel cadastrado com sucesso! Aguarde a aprovação do administrador.',
      hotel: {
        id: hotelId,
        nome,
        localizacao,
        descricao,
        imagem,
        aprovado: false
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar hotel:', error);
    console.error('Stack trace:', error.stack);
    console.error('SQL Message:', error.sqlMessage);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar hotel',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

// Atualizar hotel (requer autenticação e ser proprietário)
router.put('/:id', authMiddleware, async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { nome, localizacao, descricao, imagem, comodidades, tipos_quartos } = req.body;

    // Verificar se hotel existe e se o usuário é o proprietário
    const [hotels] = await connection.query(
      'SELECT * FROM hotels WHERE id = ?',
      [req.params.id]
    );

    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hotel não encontrado'
      });
    }

    const hotel = hotels[0];

    // Verificar se é o proprietário ou admin
    const [users] = await connection.query('SELECT is_admin FROM users WHERE id = ?', [req.userId]);
    const isAdmin = users[0]?.is_admin;

    if (hotel.user_id !== req.userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para editar este hotel'
      });
    }

    await connection.beginTransaction();

    // Atualizar hotel
    await connection.query(
      'UPDATE hotels SET nome = ?, localizacao = ?, descricao = ?, imagem = ? WHERE id = ?',
      [nome, localizacao, descricao, imagem, req.params.id]
    );

    // Atualizar comodidades
    if (comodidades && Array.isArray(comodidades)) {
      await connection.query('DELETE FROM hotel_comodidades WHERE hotel_id = ?', [req.params.id]);

      for (let comodidade of comodidades) {
        await connection.query(
          'INSERT INTO hotel_comodidades (hotel_id, comodidade) VALUES (?, ?)',
          [req.params.id, comodidade]
        );
      }
    }

    // Atualizar tipos de quartos
    if (tipos_quartos && Array.isArray(tipos_quartos)) {
      // Remover tipos antigos
      await connection.query('DELETE FROM room_types WHERE hotel_id = ?', [req.params.id]);

      // Inserir novos tipos
      for (let tipo of tipos_quartos) {
        await connection.query(
          'INSERT INTO room_types (hotel_id, nome, descricao, preco_por_noite, capacidade_pessoas, quantidade_disponivel) VALUES (?, ?, ?, ?, ?, ?)',
          [req.params.id, tipo.nome, tipo.descricao, tipo.preco_por_noite, tipo.capacidade_pessoas || 2, tipo.quantidade_disponivel || 0]
        );
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Hotel atualizado com sucesso'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao atualizar hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar hotel'
    });
  } finally {
    connection.release();
  }
});

// Deletar hotel (requer autenticação e ser proprietário)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Verificar se hotel existe e se o usuário é o proprietário
    const [hotels] = await db.query(
      'SELECT user_id FROM hotels WHERE id = ?',
      [req.params.id]
    );

    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hotel não encontrado'
      });
    }

    // Verificar se é o proprietário ou admin
    const [users] = await db.query('SELECT is_admin FROM users WHERE id = ?', [req.userId]);
    const isAdmin = users[0]?.is_admin;

    if (hotels[0].user_id !== req.userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para deletar este hotel'
      });
    }

    await db.query('DELETE FROM hotels WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Hotel deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar hotel'
    });
  }
});

module.exports = router;
