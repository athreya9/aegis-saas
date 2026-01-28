'use strict';
const { Router } = require('express');
const { DAILY_SIGNALS } = require('../store/signals');
const db = require('../db/client');
const { v4: uuidv4 } = require('uuid');

const router = Router();

router.get('/today', (req, res) => {
    res.json({
        market_status: 'OPEN',
        server_port: 4100,
        data: DAILY_SIGNALS
    });
});

router.post('/ingest', async (req, res) => {
    try {
        const apiKey = req.headers['x-api-key'];
        const source = req.headers['x-source'];

        if (apiKey !== 'AEGIS_BOT_SECRET_V1' || source !== 'TELEGRAM') {
            return res.status(403).json({ error: 'UNAUTHORIZED_SOURCE' });
        }

        const s = req.body;
        const sid = uuidv4();

        // 1. Store in memory (for frontend mapping)
        DAILY_SIGNALS.unshift({
            ...s,
            signal_id: sid,
            confidence_pct: s.confidence || 90,
            outcome_status: 'OPEN',
            timestamp_ist: new Date().toLocaleTimeString()
        });
        if (DAILY_SIGNALS.length > 50) DAILY_SIGNALS.pop();

        // 2. Store in DB (Correct Schema)
        await db.query(
            'INSERT INTO signals_daily (signal_id, instrument, symbol, transaction_type, entry_price, stop_loss, target_1, target_2, target_3, confidence) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [
                sid,
                s.instrument || 'NFO',
                s.symbol,
                s.side,
                s.entry_price,
                s.stop_loss,
                s.targets[0] || null,
                s.targets[1] || null,
                s.targets[2] || null,
                s.confidence || 90
            ]
        );

        res.json({ status: 'success', signal_id: sid });
    } catch (e) {
        console.error('Ingest Error:', e);
        res.status(500).json({ status: 'error', reason: e.message });
    }
});

module.exports = router;
