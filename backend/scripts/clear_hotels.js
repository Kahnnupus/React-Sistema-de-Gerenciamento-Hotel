const mysql = require('mysql2/promise');
require('dotenv').config();

async function clearHotels() {
    let connection;

    try {
        console.log('🔄 Iniciando limpeza de hotéis...\n');

        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            multipleStatements: true
        });

        console.log('✅ Conectado ao MySQL');

        await connection.query('USE hotel_management');

        // Desabilitar verificação de chave estrangeira
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        // Limpar tabelas relacionadas a hotéis
        console.log('🗑️  Deletando reservas...');
        await connection.query('TRUNCATE TABLE reservations');

        console.log('🗑️  Deletando tipos de quartos...');
        await connection.query('TRUNCATE TABLE room_types');

        console.log('🗑️  Deletando comodidades...');
        await connection.query('TRUNCATE TABLE hotel_comodidades');

        console.log('🗑️  Deletando hotéis...');
        await connection.query('TRUNCATE TABLE hotels');

        // Habilitar verificação de chave estrangeira
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('\n✅ Todos os hotéis e dados relacionados foram removidos com sucesso!');

    } catch (error) {
        console.error('❌ Erro ao limpar hotéis:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

clearHotels();
