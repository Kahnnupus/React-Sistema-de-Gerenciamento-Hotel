const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
    hotel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    nome: {
        type: String,
        required: true,
        trim: true
    },
    descricao: {
        type: String
    },
    preco_por_noite: {
        type: Number,
        required: true
    },
    capacidade_pessoas: {
        type: Number,
        default: 2
    },
    quantidade_disponivel: {
        type: Number,
        default: 0
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('RoomType', roomTypeSchema);
