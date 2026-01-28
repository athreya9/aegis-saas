import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/v1/support/ticket
router.post('/ticket', (req, res) => {
    // Mock Ticket Creation
    console.log(`[Support] Ticket Created for ${req.body.email}: ${req.body.issue}`);
    res.json({
        status: "success",
        ticket_id: `TKT-${Date.now()}`
    });
});

export default router;
