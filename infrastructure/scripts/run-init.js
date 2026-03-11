const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read .env file manually without external dependencies if possible, or use process.env
// The script will be run by telling the user to execute it after adding their password
const envPath = path.resolve(__dirname, '../../apps/api/.env');

function loadEnv() {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            if (!process.env[match[1]]) {
                process.env[match[1]] = match[2].trim();
            }
        }
    });
}

async function run() {
    try {
        loadEnv();
    } catch (err) {
        console.error("Could not load .env file. Please ensure apps/api/.env exists.");
        process.exit(1);
    }

    const password = process.env.DB_PASSWORD;

    if (!password || password === '[PUT_YOUR_PASSWORD_HERE]') {
        console.error("\n❌ ERROR: Password not set!\n");
        console.error("Please open apps/api/.env and replace [PUT_YOUR_PASSWORD_HERE] with your actual Supabase database password.\n");
        process.exit(1);
    }

    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: password,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false } // Required for Supabase
    });

    try {
        console.log("Connecting to Supabase...");
        await client.connect();
        console.log("Connected successfully! Exectuing init.sql...");

        const sqlPath = path.resolve(__dirname, 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await client.query(sql);
        console.log("✅ Database initialized successfully with all tables!");

    } catch (err) {
        console.error("❌ Failed to execute SQL:", err.message);
    } finally {
        await client.end();
    }
}

run();
