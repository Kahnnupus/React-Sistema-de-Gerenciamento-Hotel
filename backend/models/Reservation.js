const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    room_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomType',
        required: true
    },
    check_in: {
        type: Date,
        required: true
    },
    check_out: {
        type: Date,
        required: true
    },
    numero_quartos: {
        type: Number,
        default: 1
    },
    numero_hospedes: {
        type: Number,
        default: 1
    },
    valor_total: {
        type: Number
    },
    status: {
        type: String,
        default: 'ativa',
        enum: ['ativa', 'cancelada', 'concluida']
    },
    observacoes: {
        type: String
    },
    nome_cliente: {
        type: String
    },
    email_cliente: {
        type: String
    },
    telefone_cliente: {
        type: String
    },
    hotel_nome_backup: {
        type: String
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Update enum separately or in schema definition if possible. 
// Mongoose schema definition update:
reservationSchema.path('status').enumValues.push('cancelada_hotel_removido', 'cancelada_hotel_rejeitado');

module.exports = mongoose.model('Reservation', reservationSchema);
