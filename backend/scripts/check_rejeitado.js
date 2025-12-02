const db = require('../config/database');

async function checkRejeitadoColumn() {
    try {
        const [rows] = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'hotel_management' 
      AND TABLE_NAME = 'hotels' 
      AND COLUMN_NAME = 'rejeitado'
    `);

        console.log('Coluna rejeitado existe:', rows.length > 0 ? 'SIM' : 'NAO');

        if (rows.length > 0) {
            console.log('Detalhes:', rows);
        }

        // Testar um hotel
        const [hotels] = await db.query('SELECT id, nome, aprovado, rejeitado FROM hotels LIMIT 1');
        if (hotels.length > 0) {
            console.log('\nExemplo de hotel:');
            console.log(hotels[0]);
        }

        process.exit(0);
    } catch (error) {
        console.error('Erro:', error);
        process.exit(1);
    }
}

checkRejeitadoColumn();
