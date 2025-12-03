const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Reservation = require('../models/Reservation');
const RoomType = require('../models/RoomType');
const authMiddleware = require('../middleware/auth');

// Middleware para verificar se é admin
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.is_admin) {
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
    const hotels = await Hotel.find()
      .populate('user_id', 'nome email')
      .sort({ aprovado: 1, created_at: -1 });

    const hotelsWithDetails = await Promise.all(hotels.map(async (hotel) => {
      const roomTypes = await RoomType.find({ hotel_id: hotel._id });

      return {
        ...hotel.toObject(),
        proprietario_nome: hotel.user_id.nome,
        proprietario_email: hotel.user_id.email,
        tipos_quartos: roomTypes
      };
    }));

    res.json({
      success: true,
      hotels: hotelsWithDetails
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
    // Assumindo que "rejeitado" não existe no schema atual, apenas aprovado=false
    // Se precisarmos de estado rejeitado, deveríamos adicionar ao schema ou usar um enum status
    // Por enquanto, vamos considerar pendente como aprovado=false
    const hotels = await Hotel.find({ aprovado: false })
      .populate('user_id', 'nome email')
      .sort({ created_at: -1 });

    const hotelsWithDetails = await Promise.all(hotels.map(async (hotel) => {
      const roomTypes = await RoomType.find({ hotel_id: hotel._id });

      return {
        ...hotel.toObject(),
        proprietario_nome: hotel.user_id.nome,
        proprietario_email: hotel.user_id.email,
        tipos_quartos: roomTypes
      };
    }));

    res.json({
      success: true,
      hotels: hotelsWithDetails
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
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { aprovado: true },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel não encontrado'
      });
    }

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
    // Como não temos campo rejeitado no schema, vamos apenas setar aprovado=false
    // Se quiser implementar rejeição explícita, precisaria atualizar o schema
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { aprovado: false },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel não encontrado'
      });
    }

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

// Deletar hotel
router.delete('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel não encontrado'
      });
    }

    // Deletar tipos de quartos e reservas associados
    await RoomType.deleteMany({ hotel_id: req.params.id });
    await Reservation.deleteMany({ hotel_id: req.params.id });

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

// =====================================================
// GERENCIAMENTO DE USUÁRIOS
// =====================================================

// Listar todos os usuários
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ created_at: -1 });

    const usersWithStats = await Promise.all(users.map(async (user) => {
      const totalHoteis = await Hotel.countDocuments({ user_id: user._id });
      const totalReservas = await Reservation.countDocuments({ user_id: user._id });

      return {
        ...user.toObject(),
        total_hoteis: totalHoteis,
        total_reservas: totalReservas
      };
    }));

    res.json({
      success: true,
      users: usersWithStats
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
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      user
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

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    user.nome = nome || user.nome;
    user.telefone = telefone || user.telefone;
    user.endereco = endereco || user.endereco;
    user.email = email || user.email;
    if (is_admin !== undefined) user.is_admin = is_admin;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

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
    if (req.params.id === req.userId) {
      return res.status(400).json({
        success: false,
        message: 'Você não pode deletar sua própria conta'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
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
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_admin: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

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
    if (req.params.id === req.userId) {
      return res.status(400).json({
        success: false,
        message: 'Você não pode remover seus próprios privilégios de administrador'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_admin: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

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
    const total_usuarios = await User.countDocuments();
    const total_hoteis = await Hotel.countDocuments();
    const hoteis_aprovados = await Hotel.countDocuments({ aprovado: true });
    const hoteis_pendentes = await Hotel.countDocuments({ aprovado: false });
    const total_reservas = await Reservation.countDocuments();
    const reservas_ativas = await Reservation.countDocuments({ status: 'ativa' });

    res.json({
      success: true,
      stats: {
        total_usuarios,
        total_hoteis,
        hoteis_aprovados,
        hoteis_pendentes,
        total_reservas,
        reservas_ativas
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
