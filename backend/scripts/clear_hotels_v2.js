const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function clearHotels() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            multipleStatements: true
        });

        await connection.query('USE hotel_management');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE reservations');
        await connection.query('TRUNCATE TABLE room_types');
        await connection.query('TRUNCATE TABLE hotel_comodidades');
        await connection.query('TRUNCATE TABLE hotels');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        fs.writeFileSync('clear_result.txt', 'SUCCESS');

    } catch (error) {
        fs.writeFileSync('clear_result.txt', 'ERROR: ' + error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

clearHotels();
