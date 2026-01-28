import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import signalsRouter from './routes/signals';
import controlRouter from './routes/control';
import brokerRouter from './routes/broker';
import adminRouter from './routes/admin';
import adminUsersRouter from './routes/admin-users';
import adminControlRouter from './routes/admin-control';
import osProxyRouter from './routes/os-proxy';
import adminTelegramRouter from './routes/admin-telegram';
import strategiesRouter from './routes/strategies';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const PORT = 4100; // STRICT: Core-Safe Port

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({
        service: 'Aegis SaaS Backend (Mock Phase 1)',
        status: 'ONLINE',
        mode: 'READ_ONLY',
        version: 'v1.0.0-alpha'
    });
});

// Priority Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/strategies', strategiesRouter);

app.use('/api/v1/control', controlRouter);
app.use('/api/v1/signals', signalsRouter);
app.use('/api/v1/broker', brokerRouter);
app.use('/api/v1/admin/training', adminRouter);
app.use('/api/v1/admin/users', adminUsersRouter);
app.use('/api/v1/admin/telegram', adminTelegramRouter);
app.use('/api/v1/admin', adminControlRouter); // Mounts /admin/kill-switch and /admin/system/status
app.use('/api/v1/os', osProxyRouter);
app.use('/api/v1/os', osProxyRouter);
app.use('/api/v1/admin', adminControlRouter); // Mounts /admin/kill-switch and /admin/system/status
app.use('/api/v1/os', osProxyRouter);

// Start
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Aegis Backend] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Mode] MOCK SERVER (No Core Access)`);
});
