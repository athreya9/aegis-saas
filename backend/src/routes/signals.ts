import { Router } from 'express';
import { DAILY_SIGNALS, HISTORY_SIGNALS } from '../store/signals';

const router = Router();

// GET /api/v1/signals/today
router.get('/today', (req, res) => {
    res.json({
        market_status: "OPEN",
        server_port: 4100,
        data: DAILY_SIGNALS
    });
});

// GET /api/v1/signals/history
router.get('/history', (req, res) => {
    res.json({
        market_status: "CLOSED",
        data: HISTORY_SIGNALS
    });
});

export default router;
