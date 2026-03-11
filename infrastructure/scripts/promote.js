const { Client } = require('pg');
const path = require('path');

// Read .env manually
const fs = require('fs');
const envFile = fs.readFileSync(path.join(__dirname, '../../apps/api/.env'), 'utf8');
const env = {};
for (const line of envFile.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
}

const client = new Client({
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT || '5432'),
    database: env.DB_NAME || 'postgres',
    user: env.DB_USER || 'postgres',
    password: env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
});

(async () => {
    await client.connect();
    const r = await client.query(
        "UPDATE users SET role = 'teacher' WHERE email = $1 RETURNING id, email, role",
        ['teacher@linguameister.com']
    );
    console.log('Result:', r.rows[0] || 'no rows matched');
    await client.end();
})().catch(e => { console.error(e.message); process.exit(1); });
