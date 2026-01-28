import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'aegis_saas_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'aegis_saas',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
});

export const db = {
    query: (text: string, params?: any[]) => pool.query(text, params),
    pool
};
