
import { db } from '../db';
import * as fs from 'fs';
import * as path from 'path';

async function runMigrations() {
    console.log('[Migration] Starting...');
    const migrationsDir = path.join(__dirname, '../../migrations');

    // Simple naive migration runner
    // In strict env, should track executed migrations in a table.
    // For now, we just execute the known new file 003. 
    // Ideally we list all and run.

    if (!fs.existsSync(migrationsDir)) {
        console.error('Migration directory not found:', migrationsDir);
        process.exit(1);
    }

    // const files = fs.readdirSync(migrationsDir).sort();
    const targetFile = '003_add_user_tiers_and_risk.sql';
    const filePath = path.join(migrationsDir, targetFile);

    if (fs.existsSync(filePath)) {
        console.log(`[Migration] Applying ${targetFile}...`);
        const sql = fs.readFileSync(filePath, 'utf-8');
        try {
            await db.query(sql);
            console.log(`[Migration] ${targetFile} applied successfully.`);
        } catch (e: any) {
            console.error(`[Migration] Failed to apply ${targetFile}:`, e);
        }
    } else {
        console.error(`m[Migration] File ${targetFile} not found.`);
    }

    // Close pool? 
    // db.pool.end(); // If db exposes pool. But db exports query wrapper.
    process.exit(0);
}

runMigrations();
