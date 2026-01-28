import { Router, Request, Response } from 'express';
import { signalManager } from '../core/signals';

const router = Router();

// Middleware to verify Bot Secret (Simple API Key)
const verifyBotSource = (req: Request, res: Response, next: any) => {
    const apiKey = req.headers['x-api-key'];
    const source = req.headers['x-source'];

    // Hardcoded for VPS Scope - in prod use ENV
    if (apiKey !== 'AEGIS_BOT_SECRET_V1' || source !== 'TELEGRAM') {
        return res.status(403).json({ error: "UNAUTHORIZED_SOURCE" });
    }
    next();
};

// POST /api/v1/signals/ingest
router.post('/ingest', verifyBotSource, async (req: Request, res: Response) => {
    try {
        const rawSignal = req.body;

        // Ingest (Validates internally)
        const processed = await signalManager.ingestSignal(rawSignal);

        res.json({
            status: "success",
            signal_id: processed.id,
            action: "QUEUED_FOR_ROUTING"
        });

    } catch (e: any) {
        // Return explicit rejection reason for Audit Log
        res.status(400).json({
            status: "rejected",
            reason: e.message
        });
    }
});

// GET /api/v1/signals/recent (For Frontend feed)
router.get('/recent', (req, res) => {
    res.json({
        status: "success",
        data: signalManager.getRecentSignals()
    });
});

// POST /api/v1/signals/report-outcome
// Called by Controlled Executor to record results for AI Training
router.post('/report-outcome', verifyBotSource, async (req: Request, res: Response) => {
    try {
        const { signal_id, execution, pnl, status } = req.body;
        if (!signal_id) throw new Error("signal_id required");

        const { TrainingStore } = require('../core/training-store');
        await TrainingStore.logOutcome(signal_id, { execution, pnl, status });

        res.json({ status: "success", message: "OUTCOME_RECORDED" });
    } catch (e: any) {
        res.status(400).json({ status: "error", message: e.message });
    }
});

export default router;
