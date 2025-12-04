const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const RoomType = require('../models/RoomType');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Listar hotéis aprovados (público)
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find({
      $or: [
        { status: 'aprovado' },
        { aprovado: true }
      ]
    })
      .populate('user_id', 'nome email')
      .sort({ created_at: -1 });

    // Para cada hotel, buscar os tipos de quartos
    const hotelsWithRooms = await Promise.all(hotels.map(async (hotel) => {
      const roomTypes = await RoomType.find({ hotel_id: hotel._id }).sort({ preco_por_noite: 1 });

      return {
        ...hotel.toObject(),
        proprietario_nome: hotel.user_id.nome,
        proprietario_email: hotel.user_id.email,
        tipos_quartos: roomTypes
      };
    }));

    res.json({
      success: true,
      hotels: hotelsWithRooms
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
    const hotels = await Hotel.find({ user_id: req.userId }).sort({ created_at: -1 });

    const hotelsWithDetails = await Promise.all(hotels.map(async (hotel) => {
      const roomTypes = await RoomType.find({ hotel_id: hotel._id }).sort({ preco_por_noite: 1 });
      const totalReservas = await Reservation.countDocuments({ hotel_id: hotel._id });

      return {
        ...hotel.toObject(),
        tipos_quartos: roomTypes,
        total_reservas: totalReservas
      };
    }));

    res.json({
      success: true,
      hotels: hotelsWithDetails
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
    const hotel = await Hotel.findOne({ _id: hotelId, user_id: req.userId });

    if (!hotel) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para ver as reservas deste hotel'
      });
    }

    // Buscar reservas do hotel
    const reservations = await Reservation.find({ hotel_id: hotelId })
      .populate('user_id', 'nome email telefone')
      .populate('room_type_id', 'nome')
      .populate('hotel_id', 'nome')
      .sort({ created_at: -1 });

    const formattedReservations = reservations.map(r => ({
      ...r.toObject(),
      cliente_nome: r.user_id.nome,
      cliente_email: r.user_id.email,
      cliente_telefone: r.user_id.telefone,
      tipo_quarto_nome: r.room_type_id.nome,
      hotel_nome: r.hotel_id.nome
    }));

    res.json({
      success: true,
      reservations: formattedReservations
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
    const hotel = await Hotel.findById(req.params.id).populate('user_id', 'nome email');

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel não encontrado'
      });
    }

    const roomTypes = await RoomType.find({ hotel_id: hotel._id }).sort({ preco_por_noite: 1 });

    res.json({
      success: true,
      hotel: {
        ...hotel.toObject(),
        proprietario_nome: hotel.user_id.nome,
        proprietario_email: hotel.user_id.email,
        tipos_quartos: roomTypes
      }
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
router.post('/', authMiddleware, upload.single('imagem'), async (req, res) => {
  try {
    let { nome, localizacao, descricao, imagem, comodidades, tipos_quartos } = req.body;

    // Se houver arquivo, usar o caminho do arquivo
    if (req.file) {
      // Construir URL completa ou caminho relativo acessível
      // Aqui vamos salvar o caminho relativo para ser servido estaticamente
      const protocol = req.protocol;
      const host = req.get('host');
      imagem = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    // Se tipos_quartos vier como string (FormData), fazer parse
    if (typeof tipos_quartos === 'string') {
      try {
        tipos_quartos = JSON.parse(tipos_quartos);
      } catch (e) {
        console.error('Erro ao fazer parse de tipos_quartos:', e);
        return res.status(400).json({
          success: false,
          message: 'Formato inválido para tipos de quartos'
        });
      }
    }

    // Se comodidades vier como string (FormData), fazer parse ou split
    if (typeof comodidades === 'string') {
      // Se for JSON array string
      if (comodidades.startsWith('[')) {
        try {
          comodidades = JSON.parse(comodidades);
        } catch (e) {
          // Se falhar, tentar split por vírgula se não for JSON
          comodidades = comodidades.split(',').map(c => c.trim()).filter(Boolean);
        }
      } else {
        comodidades = comodidades.split(',').map(c => c.trim()).filter(Boolean);
      }
    }

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

    // Criar hotel
    const hotel = await Hotel.create({
      user_id: req.userId,
      nome,
      localizacao,
      descricao,
      imagem,
      status: 'pendente',
      aprovado: false,
      comodidades: comodidades || []
    });

    // Criar tipos de quartos
    for (let tipo of tipos_quartos) {
      if (!tipo.nome || !tipo.preco_por_noite) {
        continue;
      }

      await RoomType.create({
        hotel_id: hotel._id,
        nome: tipo.nome,
        descricao: tipo.descricao,
        preco_por_noite: tipo.preco_por_noite,
        capacidade_pessoas: tipo.capacidade_pessoas || 2,
        quantidade_disponivel: tipo.quantidade_disponivel || 0
      });
    }

    res.status(201).json({
      success: true,
      message: 'Hotel cadastrado com sucesso! Aguarde a aprovação do administrador.',
      hotel
    });
  } catch (error) {
    console.error('Erro ao criar hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar hotel',
      error: error.message
    });
  }
});

// Atualizar hotel (requer autenticação e ser proprietário)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nome, localizacao, descricao, imagem, comodidades, tipos_quartos } = req.body;

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel não encontrado'
      });
    }

    // Verificar se é o proprietário ou admin
    const user = await User.findById(req.userId);
    const isAdmin = user?.is_admin;

    if (hotel.user_id.toString() !== req.userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para editar este hotel'
      });
    }

    // Atualizar hotel
    hotel.nome = nome || hotel.nome;
    hotel.localizacao = localizacao || hotel.localizacao;
    hotel.descricao = descricao || hotel.descricao;
    hotel.imagem = imagem || hotel.imagem;
    if (comodidades) hotel.comodidades = comodidades;

    await hotel.save();

    // Atualizar tipos de quartos
    if (tipos_quartos && Array.isArray(tipos_quartos)) {
      // Remover tipos antigos
      await RoomType.deleteMany({ hotel_id: hotel._id });

      // Inserir novos tipos
      for (let tipo of tipos_quartos) {
        await RoomType.create({
          hotel_id: hotel._id,
          nome: tipo.nome,
          descricao: tipo.descricao,
          preco_por_noite: tipo.preco_por_noite,
          capacidade_pessoas: tipo.capacidade_pessoas || 2,
          quantidade_disponivel: tipo.quantidade_disponivel || 0
        });
      }
    }

    res.json({
      success: true,
      message: 'Hotel atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar hotel'
    });
  }
});

// Deletar hotel (requer autenticação e ser proprietário)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel não encontrado'
      });
    }

    // Verificar se é o proprietário ou admin
    const user = await User.findById(req.userId);
    const isAdmin = user?.is_admin;

    if (hotel.user_id.toString() !== req.userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para deletar este hotel'
      });
    }

    // Deletar hotel (e em cascata os quartos e reservas se configurado, mas aqui faremos manual ou deixaremos orfãos por enquanto, ideal é usar middleware pre-remove no Mongoose)
    // Deletar os quartos associados
    await RoomType.deleteMany({ hotel_id: hotel._id });

    // Cancelar reservas associadas e salvar nome do hotel para notificação
    await Reservation.updateMany(
      { hotel_id: hotel._id },
      {
        status: 'cancelada_hotel_removido',
        hotel_nome_backup: hotel.nome
      }
    );

    // Deletar o hotel
    await Hotel.findByIdAndDelete(req.params.id);

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
