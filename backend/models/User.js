const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        trim: true
    },
    telefone: {
        type: String,
        trim: true
    },
    endereco: {
        type: String,
        trim: true
    },
    is_admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Método para verificar senha
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Hook pre-save para hash da senha (opcional, se quisermos mover a lógica para cá)
// Por enquanto, manteremos a lógica no controller para minimizar mudanças drásticas

module.exports = mongoose.model('User', userSchema);
