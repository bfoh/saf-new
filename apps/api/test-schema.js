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
        const res = await client.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'student_progress';
        `);
        console.log("Columns:", res.rows.map(r => r.column_name));
    } catch (err) {
        console.error('SQL Error:', err.message);
    } finally {
        await client.end();
    }
}
test();
