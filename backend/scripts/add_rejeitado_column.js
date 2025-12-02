const db = require('../config/database');

async function addRejeitadoColumn() {
    try {
        const connection = await db.getConnection();
        console.log('Conectado ao banco de dados.');

        // Verificar se a coluna já existe
        const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'hotel_management' 
      AND TABLE_NAME = 'hotels' 
      AND COLUMN_NAME = 'rejeitado'
    `);

        if (columns.length > 0) {
            console.log('A coluna "rejeitado" já existe na tabela "hotels".');
        } else {
            console.log('Adicionando coluna "rejeitado" à tabela "hotels"...');
            await connection.query(`
        ALTER TABLE hotels 
        ADD COLUMN rejeitado BOOLEAN DEFAULT FALSE AFTER aprovado
      `);
            console.log('Coluna "rejeitado" adicionada com sucesso.');
        }

        connection.release();
        process.exit(0);
    } catch (error) {
        console.error('Erro ao adicionar coluna:', error);
        process.exit(1);
    }
}

addRejeitadoColumn();
