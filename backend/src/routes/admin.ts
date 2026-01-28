import { Router, Request, Response } from 'express';
import { TrainingStore } from '../core/training-store';

const router = Router();

// Middleware to verify Admin Authority
const verifyAdmin = (req: Request, res: Response, next: any) => {
    const role = req.headers['x-user-role'];
    if (role !== 'ADMIN') {
        return res.status(403).json({ error: "ADMIN_AUTHORITY_REQUIRED" });
    }
    next();
};

// GET /api/v1/admin/training/export
router.get('/export', verifyAdmin, async (req: Request, res: Response) => {
    try {
        const dataset = await TrainingStore.getExposedDataset(true);
        res.json({
            status: "success",
            count: dataset.length,
            data: dataset
        });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

// GET /api/v1/admin/training/stats
router.get('/stats', verifyAdmin, async (req: Request, res: Response) => {
    try {
        const dataset = await TrainingStore.getExposedDataset(true);
        const stats = {
            total: dataset.length,
            accepted: dataset.filter(r => r.aegis_validation_result?.status === 'ACCEPTED').length,
            rejected: dataset.filter(r => r.aegis_validation_result?.status === 'REJECTED').length,
            executed: dataset.filter(r => r.outcome_status === 'EXECUTED_PAPER').length,
            pnl_total: dataset.reduce((acc, r) => acc + (Number(r.pnl) || 0), 0)
        };
        res.json({ status: "success", stats });
    } catch (e: any) {
        res.status(500).json({ status: "error", message: e.message });
    }
});

export default router;
