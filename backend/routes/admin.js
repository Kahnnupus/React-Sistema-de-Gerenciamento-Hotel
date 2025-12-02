const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Middleware para verificar se é admin
const adminMiddleware = async (req, res, next) => {
  try {
    const [users] = await db.query(
      'SELECT is_admin FROM users WHERE id = ?',
      [req.userId]
    );

    if (users.length === 0 || !users[0].is_admin) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar esta rota.'
      });
    }

    next();
  } catch (error) {
    console.error('Erro no middleware admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar permissões'
    });
  }
};

// Aplicar autenticação em todas as rotas
router.use(authMiddleware);
router.use(adminMiddleware);

// =====================================================
// GERENCIAMENTO DE HOTÉIS
// =====================================================

// Listar todos os hotéis (aprovados e pendentes)
router.get('/hotels', async (req, res) => {
  try {
    const [hotels] = await db.query(`
      SELECT h.*, u.nome as proprietario_nome, u.email as proprietario_email
      FROM hotels h
      INNER JOIN users u ON h.user_id = u.id
      ORDER BY h.aprovado ASC, h.created_at DESC
    `);

    // Buscar comodidades e tipos de quartos
    for (let hotel of hotels) {
      const [comodidades] = await db.query(
        'SELECT comodidade FROM hotel_comodidades WHERE hotel_id = ?',
        [hotel.id]
      );
      hotel.comodidades = comodidades.map(c => c.comodidade);

      const [roomTypes] = await db.query(
        'SELECT * FROM room_types WHERE hotel_id = ?',
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

// Listar hotéis pendentes de aprovação
router.get('/hotels/pendentes', async (req, res) => {
  try {
    const [hotels] = await db.query(`
      SELECT h.*, u.nome as proprietario_nome, u.email as proprietario_email
      FROM hotels h
      INNER JOIN users u ON h.user_id = u.id
      WHERE h.aprovado = FALSE AND h.rejeitado = FALSE
      ORDER BY h.created_at DESC
    `);

    // Buscar comodidades e tipos de quartos
    for (let hotel of hotels) {
      const [comodidades] = await db.query(
        'SELECT comodidade FROM hotel_comodidades WHERE hotel_id = ?',
        [hotel.id]
      );
      hotel.comodidades = comodidades.map(c => c.comodidade);

      const [roomTypes] = await db.query(
        'SELECT * FROM room_types WHERE hotel_id = ?',
        [hotel.id]
      );
      hotel.tipos_quartos = roomTypes;
    }

    res.json({
      success: true,
      hotels
    });
  } catch (error) {
    console.error('Erro ao listar hotéis pendentes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar hotéis pendentes'
    });
  }
});

// Aprovar hotel
router.put('/hotels/:id/aprovar', async (req, res) => {
  try {
    const [hotels] = await db.query(
      'SELECT id FROM hotels WHERE id = ?',
      [req.params.id]
    );

    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hotel não encontrado'
      });
    }

    await db.query(
      'UPDATE hotels SET aprovado = TRUE WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Hotel aprovado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao aprovar hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao aprovar hotel'
    });
  }
});

// Reprovar/desaprovar hotel
router.put('/hotels/:id/reprovar', async (req, res) => {
  try {
    const [hotels] = await db.query(
      'SELECT id FROM hotels WHERE id = ?',
      [req.params.id]
    );

    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hotel não encontrado'
      });
    }

    await db.query(
      'UPDATE hotels SET aprovado = FALSE, rejeitado = TRUE WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Hotel reprovado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao reprovar hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao reprovar hotel'
    });
  }
});

// =====================================================
// GERENCIAMENTO DE USUÁRIOS
// =====================================================

// Listar todos os usuários
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT 
        id, 
        email, 
        nome, 
        telefone, 
        endereco, 
        is_admin, 
        created_at 
      FROM users 
      ORDER BY created_at DESC
    `);

    // Contar hotéis e reservas de cada usuário
    for (let user of users) {
      const [hotelCount] = await db.query(
        'SELECT COUNT(*) as total FROM hotels WHERE user_id = ?',
        [user.id]
      );
      user.total_hoteis = hotelCount[0].total;

      const [reservationCount] = await db.query(
        'SELECT COUNT(*) as total FROM reservations WHERE user_id = ?',
        [user.id]
      );
      user.total_reservas = reservationCount[0].total;
    }

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar usuários'
    });
  }
});

// Buscar usuário por ID
router.get('/users/:id', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, email, nome, telefone, endereco, is_admin, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário'
    });
  }
});

// Atualizar usuário
router.put('/users/:id', async (req, res) => {
  try {
    const { nome, telefone, endereco, email, is_admin, password } = req.body;

    const [users] = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    let query = 'UPDATE users SET nome = ?, telefone = ?, endereco = ?, email = ?, is_admin = ?';
    let params = [nome, telefone, endereco, email, is_admin];

    // Se houver nova senha
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(req.params.id);

    await db.query(query, params);

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar usuário'
    });
  }
});

// Deletar usuário
router.delete('/users/:id', async (req, res) => {
  try {
    // Não permitir deletar a si mesmo
    if (parseInt(req.params.id) === req.userId) {
      return res.status(400).json({
        success: false,
        message: 'Você não pode deletar sua própria conta'
      });
    }

    const [result] = await db.query(
      'DELETE FROM users WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar usuário'
    });
  }
});

// Tornar usuário administrador
router.put('/users/:id/tornar-admin', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    await db.query(
      'UPDATE users SET is_admin = TRUE WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Usuário promovido a administrador com sucesso'
    });
  } catch (error) {
    console.error('Erro ao tornar usuário admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao tornar usuário administrador'
    });
  }
});

// Remover privilégios de administrador
router.put('/users/:id/remover-admin', async (req, res) => {
  try {
    // Não permitir remover a si mesmo
    if (parseInt(req.params.id) === req.userId) {
      return res.status(400).json({
        success: false,
        message: 'Você não pode remover seus próprios privilégios de administrador'
      });
    }

    const [users] = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    await db.query(
      'UPDATE users SET is_admin = FALSE WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Privilégios de administrador removidos com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover privilégios de administrador'
    });
  }
});

// =====================================================
// ESTATÍSTICAS
// =====================================================

// Dashboard com estatísticas
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Total de usuários
    const [userCount] = await db.query('SELECT COUNT(*) as total FROM users');

    // Total de hotéis
    const [hotelCount] = await db.query('SELECT COUNT(*) as total FROM hotels');

    // Hotéis aprovados
    const [approvedHotelCount] = await db.query('SELECT COUNT(*) as total FROM hotels WHERE aprovado = TRUE');

    // Hotéis pendentes
    const [pendingHotelCount] = await db.query('SELECT COUNT(*) as total FROM hotels WHERE aprovado = FALSE');

    // Total de reservas
    const [reservationCount] = await db.query('SELECT COUNT(*) as total FROM reservations');

    // Reservas ativas
    const [activeReservationCount] = await db.query('SELECT COUNT(*) as total FROM reservations WHERE status = "ativa"');

    res.json({
      success: true,
      stats: {
        total_usuarios: userCount[0].total,
        total_hoteis: hotelCount[0].total,
        hoteis_aprovados: approvedHotelCount[0].total,
        hoteis_pendentes: pendingHotelCount[0].total,
        total_reservas: reservationCount[0].total,
        reservas_ativas: activeReservationCount[0].total
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas'
    });
  }
});

module.exports = router;
