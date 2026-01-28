import { Router } from 'express';
import { sandboxManager } from '../core/manager';
import { KiteAdapter } from '../brokers/kite';
import { AngelAdapter } from '../brokers/angel';
import { FyersAdapter } from '../brokers/fyers';
import { ZerodhaPaperAdapter } from '../brokers/zerodha-paper';
import { EncryptionUtils } from '../lib/encryption';
import { db } from '../db/pg-client';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// POST /api/v1/broker/connect
router.post('/connect', async (req: any, res) => {
    const { brokerName, credentials } = req.body;
    const userId = req.user?.id || 'default_user';
    const sandbox = sandboxManager.getSandbox(userId);

    let adapter;
    switch (brokerName.toUpperCase()) {
        case 'ZERODHA': adapter = new KiteAdapter(); break;
        case 'ZERODHA_PAPER': adapter = new ZerodhaPaperAdapter(userId); break;
        case 'ANGEL_ONE': adapter = new AngelAdapter(); break;
        case 'FYERS': adapter = new FyersAdapter(); break;
        default: return res.status(400).json({ status: 'error', message: 'Unsupported broker' });
    }

    const success = await adapter.validateCredentials(credentials);
    if (success) {
        // Secure Storage Phase (AES-256-GCM)
        const encryptor = new EncryptionUtils(process.env.ENCRYPTION_SECRET || 'aegis-default-secret');
        const encrypted = encryptor.encrypt(JSON.stringify(credentials));

        try {
            await db.query(
                `INSERT INTO broker_credentials (user_id, broker_name, encrypted_data, iv, auth_tag)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (user_id) DO UPDATE SET
                 broker_name = EXCLUDED.broker_name,
                 encrypted_data = EXCLUDED.encrypted_data,
                 iv = EXCLUDED.iv,
                 auth_tag = EXCLUDED.auth_tag,
                 last_validated_at = CURRENT_TIMESTAMP`,
                [userId, brokerName, encrypted.encrypted, encrypted.iv, encrypted.authTag]
            );
        } catch (e) {
            console.error("[Broker] DB Storage Fail:", e);
        }

        sandbox.setBrokerAdapter(adapter);
        res.json({ status: 'success', message: `Connected to ${brokerName}` });
    } else {
        res.status(401).json({ status: 'error', message: 'Invalid credentials format' });
    }
});

// GET /api/v1/broker/status
router.get('/status', async (req: any, res) => {
    const userId = req.user?.id || 'default_user';
    const sandbox = sandboxManager.getSandbox(userId);
    const status = await sandbox.getStatus();

    res.json({
        status: 'success',
        data: {
            brokerConnected: status.brokerConnected,
            brokerName: sandbox.getBrokerAdapter()?.brokerName || 'NONE',
            lastValidatedAt: new Date().toISOString()
        }
    });
});

export default router;
