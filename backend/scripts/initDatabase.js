const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  let connection;
  
  try {
    console.log('🔄 Iniciando configuração do banco de dados...\n');

    // Conectar ao MySQL sem especificar database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      multipleStatements: true
    });

    console.log('✅ Conectado ao MySQL');

    // Ler arquivo SQL
    const sqlPath = path.join(__dirname, '../../database/init.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Executando script SQL...');

    // Executar script SQL
    await connection.query(sqlScript);

    console.log('✅ Script SQL executado com sucesso');

    // Selecionar o banco de dados
    await connection.query('USE hotel_management');

    // Verificar se admin já existe
    const [existingAdmin] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['admin@hotel.com']
    );

    if (existingAdmin.length === 0) {
      // Criar hash da senha 'admin'
      const hashedPassword = await bcrypt.hash('admin', 10);

      // Inserir administrador
      await connection.query(
        'INSERT INTO users (email, password, nome, is_admin) VALUES (?, ?, ?, ?)',
        ['admin@hotel.com', hashedPassword, 'Administrador', true]
      );

      console.log('✅ Usuário administrador criado');
      console.log('   Email: admin@hotel.com');
      console.log('   Senha: admin');
    } else {
      console.log('ℹ️  Usuário administrador já existe');
    }

    console.log('\n✅ Banco de dados inicializado com sucesso!');
    console.log('\n📊 Estrutura criada:');
    console.log('   - Banco de dados: hotel_management');
    console.log('   - Tabelas: users, hotels, hotel_comodidades, room_types, reservations, contact_messages');
    console.log('   - Administrador padrão criado\n');

  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Executar
initDatabase();
