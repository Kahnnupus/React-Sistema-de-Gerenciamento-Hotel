const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });
const User = require('../models/User');
const connectDB = require('../config/db');

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('Verificando usuário administrador...');

        const adminEmail = 'admin@hotel.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin', 10);

            await User.create({
                email: adminEmail,
                password: hashedPassword,
                nome: 'Administrador',
                is_admin: true
            });

            console.log('Usuário administrador criado');
            console.log('   Email: admin@hotel.com');
            console.log('   Senha: admin');
        } else {
            console.log(' Usuário administrador já existe');
        }

        console.log('\n Banco de dados MongoDB inicializado com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error(' Erro ao inicializar banco de dados:', error.message);
        process.exit(1);
    }
};

seedDatabase();
