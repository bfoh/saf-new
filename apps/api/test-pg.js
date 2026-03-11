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
        const res = await client.query(`SELECT * FROM student_progress WHERE student_id = 'mock-student-id'`);
        console.log("Mock progress:", res.rows);
    } catch (err) {
        console.error('SQL Error:', err.message);
    } finally {
        await client.end();
    }
}
test();
