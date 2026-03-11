require('dotenv').config({ path: '/Users/ebenezerbarning/Desktop/SAFlinguameister/apps/api/.env' });
const { Client } = require('pg');

async function test() {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
    await client.connect();
    try {
        await client.query(`
            ALTER TABLE student_progress
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
        `);
        console.log("Columns added successfully.");
    } catch (err) {
        console.error('SQL Error:', err.message);
    } finally {
        await client.end();
    }
}
test();
