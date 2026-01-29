import { Router, Request, Response } from 'express';
import { requireRole, UserRole } from '../middleware/rbac';
import { OSClient } from '../core/os-client';

const router = Router();
const client = OSClient.getInstance();

// GET /api/v1/admin/telegram/status
router.get('/status', requireRole(UserRole.ADMIN), async (req: Request, res: Response) => {
    const status = await client.getTelegramStatus();
    res.json({
        ...status,
        serviced_by: 'SAAS_BACKEND_PROXY'
    });
});

// POST /api/v1/admin/telegram/enable
router.post('/enable', requireRole(UserRole.ADMIN), async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string || 'admin_123';
    // Audit Spec: { action, state, user_id, ip, timestamp }
    const auditLog = {
        action: 'telegram_toggle',
        state: 'enabled',
        user_id: userId,
        ip: req.ip || 'unknown',
        timestamp: new Date().toISOString()
    };
    console.log('[AUDIT]', JSON.stringify(auditLog));

    // Call OS
    const result = await client.toggleTelegram(true, userId, "Manual Enable via Admin UI");
    if (result.success) {
        res.json({ status: 'success', message: 'Telegram Enabled' });
    } else {
        res.status(502).json({ status: 'error', message: result.message });
    }
});

// POST /api/v1/admin/telegram/disable
router.post('/disable', requireRole(UserRole.ADMIN), async (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] as string || 'admin_123';

    const auditLog = {
        action: 'telegram_toggle',
        state: 'disabled',
        user_id: userId,
        ip: req.ip || 'unknown',
        timestamp: new Date().toISOString()
    };
    console.log('[AUDIT]', JSON.stringify(auditLog));

    const result = await client.toggleTelegram(false, userId, "Manual Disable via Admin UI");
    if (result.success) {
        res.json({ status: 'success', message: 'Telegram Disabled' });
    } else {
        res.status(502).json({ status: 'error', message: result.message });
    }
});

// GET /api/v1/admin/telegram/channels
router.get('/channels', requireRole(UserRole.ADMIN), async (req: Request, res: Response) => {
    const data = await client.getTelegramChannels();
    res.json(data);
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
