const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Override query to return rows directly
const originalQuery = pool.query.bind(pool);
pool.query = async (text, params) => {
    const result = await originalQuery(text, params);
    return result.rows; // Return rows directly
};

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('✅ Database connected successfully');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

module.exports = { pool, testConnection };