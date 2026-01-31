import { Router, Request, Response } from 'express';
import { requireRole, UserRole } from '../middleware/rbac';
import { OSClient } from '../core/os-client';

const router = Router();
const client = OSClient.getInstance();

// GET /api/v1/admin/telegram/status
router.get('/status', requireRole(UserRole.ADMIN), async (req: Request, res: Response) => {
    // SaaS is Read-Only. Direct OS Telegram integration is handled by Core.
    // For now, we return a conceptual status or fetch from a mirror key in Redis if available.
    res.json({
        enabled: true,
        status: 'MIRROR_ONLY',
        serviced_by: 'SAAS_BACKEND_PROXY'
    });
});

// POST /api/v1/admin/telegram/enable
router.post('/enable', requireRole(UserRole.ADMIN), async (req: Request, res: Response) => {
    res.status(403).json({ status: 'error', message: 'Read-only access: Control commands are not permitted from SaaS.' });
});

// POST /api/v1/admin/telegram/disable
router.post('/disable', requireRole(UserRole.ADMIN), async (req: Request, res: Response) => {
    res.status(403).json({ status: 'error', message: 'Read-only access: Control commands are not permitted from SaaS.' });
});

// GET /api/v1/admin/telegram/channels
router.get('/channels', requireRole(UserRole.ADMIN), async (req: Request, res: Response) => {
    // Return empty or cached config. Direct OS fetch is disabled in read-only mode.
    res.json({ channels: [], message: 'Configuration is read-only from Core OS.' });
});

// POST /api/v1/admin/telegram/channels/update
router.post('/channels/update', requireRole(UserRole.ADMIN), async (req: Request, res: Response) => {
    // Audit Log for Config Change
    const userId = req.headers['x-user-id'] as string || 'admin_123';
    console.log('[AUDIT] Channel Config Update by', userId);

    // In real impl, proxy to OS. Currently mocked as success as per Phase 5.
    res.json({ status: 'success', message: 'Channel Configuration Updated' });
});

export default router;
