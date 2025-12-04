const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nome: {
        type: String,
        required: true,
        trim: true
    },
    localizacao: {
        type: String,
        trim: true
    },
    descricao: {
        type: String
    },
    imagem: {
        type: String
    },
    status: {
        type: String,
        enum: ['pendente', 'aprovado', 'rejeitado'],
        default: 'pendente'
    },
    // Mantendo aprovado por compatibilidade temporária, mas o status deve ser a fonte da verdade
    aprovado: {
        type: Boolean,
        default: false
    },
    comodidades: [{
        type: String
    }]
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Hotel', hotelSchema);
