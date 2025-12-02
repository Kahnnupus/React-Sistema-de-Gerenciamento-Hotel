const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/../.env' });

async function cleanup() {
    console.log('Starting cleanup...');

    // Create connection
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'hotel_management'
    });

    try {
        console.log('Connected to database.');

        // 1. Delete Hotel ID 3
        console.log('Deleting Hotel ID 3...');

        // Check if hotel exists
        const [hotelCheck] = await connection.execute('SELECT id FROM hotels WHERE id = ?', [3]);
        if (hotelCheck.length > 0) {
            // Delete reservations for this hotel
            await connection.execute('DELETE FROM reservations WHERE hotel_id = ?', [3]);
            // Delete room types
            await connection.execute('DELETE FROM room_types WHERE hotel_id = ?', [3]);
            // Delete amenities
            await connection.execute('DELETE FROM hotel_comodidades WHERE hotel_id = ?', [3]);
            // Delete hotel
            await connection.execute('DELETE FROM hotels WHERE id = ?', [3]);
            console.log('Hotel ID 3 deleted successfully.');
        } else {
            console.log('Hotel ID 3 not found.');
        }

        // 2. Delete non-admin users
        console.log('Deleting non-admin users...');

        // Find non-admin users
        const [users] = await connection.execute('SELECT id FROM users WHERE is_admin = 0');
        const userIds = users.map(u => u.id);

        if (userIds.length > 0) {
            console.log(`Found ${userIds.length} non-admin users to delete.`);
            const placeholders = userIds.map(() => '?').join(',');

            // Delete reservations by these users
            await connection.execute(`DELETE FROM reservations WHERE user_id IN (${placeholders})`, userIds);

            // Delete hotels owned by these users
            const [userHotels] = await connection.execute(`SELECT id FROM hotels WHERE user_id IN (${placeholders})`, userIds);
            const hotelIds = userHotels.map(h => h.id);

            if (hotelIds.length > 0) {
                console.log(`Deleting ${hotelIds.length} hotels owned by these users...`);
                const hotelPlaceholders = hotelIds.map(() => '?').join(',');
                await connection.execute(`DELETE FROM reservations WHERE hotel_id IN (${hotelPlaceholders})`, hotelIds);
                await connection.execute(`DELETE FROM room_types WHERE hotel_id IN (${hotelPlaceholders})`, hotelIds);
                await connection.execute(`DELETE FROM hotel_comodidades WHERE hotel_id IN (${hotelPlaceholders})`, hotelIds);
                await connection.execute(`DELETE FROM hotels WHERE id IN (${hotelPlaceholders})`, hotelIds);
            }

            // Finally delete users
            await connection.execute(`DELETE FROM users WHERE id IN (${placeholders})`, userIds);
            console.log(`Deleted ${userIds.length} non-admin users.`);
        } else {
            console.log('No non-admin users found.');
        }

    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await connection.end();
        console.log('Cleanup finished.');
    }
}

cleanup();
