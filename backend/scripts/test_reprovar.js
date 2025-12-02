const db = require('../config/database');

async function testReprovarHotel() {
    try {
        // Buscar um hotel para testar
        const [hotels] = await db.query('SELECT id, nome, aprovado, rejeitado FROM hotels LIMIT 1');

        if (hotels.length === 0) {
            console.log('Nenhum hotel encontrado para testar');
            process.exit(0);
        }

        const hotel = hotels[0];
        console.log('Hotel antes:', hotel);

        // Reprovar o hotel
        await db.query(
            'UPDATE hotels SET aprovado = FALSE, rejeitado = TRUE WHERE id = ?',
            [hotel.id]
        );

        // Buscar novamente
        const [updated] = await db.query('SELECT id, nome, aprovado, rejeitado FROM hotels WHERE id = ?', [hotel.id]);
        console.log('Hotel depois:', updated[0]);

        // Reverter para o estado original
        await db.query(
            'UPDATE hotels SET aprovado = ?, rejeitado = ? WHERE id = ?',
            [hotel.aprovado, hotel.rejeitado, hotel.id]
        );

        console.log('\nTeste concluído! O campo rejeitado está funcionando corretamente.');
        process.exit(0);
    } catch (error) {
        console.error('Erro:', error);
        process.exit(1);
    }
}

testReprovarHotel();
