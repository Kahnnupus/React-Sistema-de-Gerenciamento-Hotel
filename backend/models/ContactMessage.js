const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reservation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation'
    },
    assunto: {
        type: String,
        required: true
    },
    mensagem: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pendente',
        enum: ['pendente', 'respondida', 'arquivada']
    },
    resposta: {
        type: String
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
