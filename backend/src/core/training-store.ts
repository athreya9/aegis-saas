import fs from 'fs';
import path from 'path';

export interface TrainingRecord {
    id: string; // Internal Sync ID (UUID)
    signal_id: string; // The SIG-xxx ID
    raw_message?: string;
    parsed_payload: any;
    parse_confidence: number;
    aegis_validation_result?: any;
    execution_result?: any;
    pnl?: number;
    outcome_status?: 'PENDING' | 'WIN' | 'LOSS' | 'EXPIRED';
    latency_ms: number;
    created_at: string;
}

import { db } from '../db/pg-client';

const DATA_DIR = '/data/training';

// Ensure dir exists (Requires root or appropriate permissions)
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
        console.error(`[TrainingStore] Failed to create ${DATA_DIR}: ${e}`);
    }
}

export class TrainingStore {
    private static getFilesystemMirror() {
        return path.join(DATA_DIR, `training_dataset_${new Date().toISOString().split('T')[0]}.jsonl`);
    }

    /**
     * Primary Ingest: Capture Signal + Validation
     */
    public static async logIngest(record: Partial<TrainingRecord>): Promise<void> {
        const fullRecord: TrainingRecord = {
            id: record.id || `TRN-${Date.now()}`,
            signal_id: record.signal_id || '',
            raw_message: record.raw_message,
            parsed_payload: record.parsed_payload,
            parse_confidence: record.parse_confidence || 0,
            aegis_validation_result: record.aegis_validation_result,
            latency_ms: record.latency_ms || 0,
            created_at: new Date().toISOString()
        };

        // 1. PostgreSQL (Primary)
        try {
            await db.query(`
                INSERT INTO ai_training_data (
                    signal_id, raw_message, parsed_payload, parse_confidence, 
                    aegis_validation_result, latency_ms, created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (signal_id) DO UPDATE SET
                    aegis_validation_result = EXCLUDED.aegis_validation_result,
                    latency_ms = EXCLUDED.latency_ms
            `, [
                fullRecord.signal_id, fullRecord.raw_message, JSON.stringify(fullRecord.parsed_payload),
                fullRecord.parse_confidence, JSON.stringify(fullRecord.aegis_validation_result),
                fullRecord.latency_ms, fullRecord.created_at
            ]);
        } catch (e) {
            console.error(`[TrainingStore] Postgres Ingest Error: ${e}`);
        }

        // 2. Filesystem (Mirror - Append Only)
        this.appendToFileSystem(fullRecord);
    }

    /**
     * Outcome Capture: Capture Execution Result + P&L
     */
    public static async logOutcome(signalId: string, outcome: { execution?: any, pnl?: number, status?: string }): Promise<void> {
        try {
            await db.query(`
                UPDATE ai_training_data SET
                    execution_result = $1,
                    pnl = $2,
                    outcome_status = $3
                WHERE signal_id = $4
            `, [JSON.stringify(outcome.execution), outcome.pnl, outcome.status, signalId]);

            // Append Update event to log (History tracking)
            this.appendToFileSystem({
                event: 'OUTCOME_UPDATE',
                signal_id: signalId,
                ...outcome,
                timestamp: new Date().toISOString()
            });
        } catch (e) {
            console.error(`[TrainingStore] Postgres Outcome Error: ${e}`);
        }
    }

    private static appendToFileSystem(data: any) {
        try {
            const line = JSON.stringify(data) + '\n';
            fs.appendFileSync(this.getFilesystemMirror(), line);
        } catch (e) {
            console.error(`[TrainingStore] FS Mirror Error: ${e}`);
        }
    }

    public static async getExposedDataset(isAdmin: boolean = false): Promise<any[]> {
        if (!isAdmin) throw new Error("ADMIN_AUTHORITY_REQUIRED");
        const res = await db.query('SELECT * FROM ai_training_data ORDER BY created_at DESC');
        return res.rows;
    }
}
