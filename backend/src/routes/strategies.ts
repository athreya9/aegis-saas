import { Router, Request, Response } from 'express';
import { UserTier, TIERS } from '../config/tiers';

const router = Router();

// Mock Data for "Marketing" visibility
const STRATEGIES = [
    {
        id: 'trend-master-v1',
        name: 'Trend Master Pro',
        description: 'Follows major intraday trends on Nifty 50.',
        risk_profile: 'MODERATE',
        win_rate: '68%',
        drawdown: '12%',
        min_capital: 150000,
        tags: ['Trend', 'Intraday']
    },
    {
        id: 'mean-revert-alpha',
        name: 'Mean Reversion Alpha',
        description: 'Captures overextended moves and fades them.',
        risk_profile: 'HIGH',
        win_rate: '55%',
        drawdown: '18%',
        min_capital: 300000,
        tags: ['Reversal', 'Scalp']
    },
    {
        id: 'gamma-scalper',
        name: 'Gamma Scalper',
        description: 'High frequency options scalping engine.',
        risk_profile: 'EXTREME',
        win_rate: '45%',
        drawdown: '25%',
        min_capital: 500000,
        tags: ['Options', 'HFT']
    }
];

router.get('/', (req: Request, res: Response) => {
    // In a real app, we might filter based on Tier, but for now we expose all as "Showcase"
    res.json({
        strategies: STRATEGIES,
        count: STRATEGIES.length
    });
});

export default router;
