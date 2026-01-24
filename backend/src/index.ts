import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import signalsRouter from './routes/signals';
import controlRouter from './routes/control';

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

app.use('/api/v1/signals', signalsRouter);
app.use('/api/v1/control', controlRouter);

// Start
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Aegis Backend] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Mode] MOCK SERVER (No Core Access)`);
});
