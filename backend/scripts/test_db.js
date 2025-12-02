const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
        });
        console.log('Connected!');
        const [rows] = await connection.query('SHOW DATABASES');
        console.log('Databases:', rows);
        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

testConnection();
