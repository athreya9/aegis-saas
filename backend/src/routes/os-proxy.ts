
import { Router } from 'express';
import { OSClient } from '../core/os-client';

const router = Router();
const client = OSClient.getInstance();

// Middleware to inject source tag
const injectSource = (data: any) => {
    if (typeof data === 'object' && data !== null) {
        return { ...data, source: 'AEGIS_OS', serviced_by: 'SAAS_BACKEND' };
    }
    return data;
};

router.get('/status', (req, res) => {
    const data = client.getStatus();
    res.json(injectSource({
        online: client.isOnline(),
        last_updated: client.getLastUpdated(),
        data
    }));
});

router.get('/metrics', (req, res) => {
    res.json(injectSource(client.getMetrics()));
});

router.get('/positions', (req, res) => {
    res.json(injectSource({ positions: client.getPositions() }));
});

router.get('/signals', (req, res) => {
    res.json(injectSource({ signals: client.getSignals() }));
});

export default router;
