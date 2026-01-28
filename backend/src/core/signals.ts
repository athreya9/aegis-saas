import { SystemConfig } from './config';
import { SignalStats } from './stats';
import { TrainingStore } from './training-store';

export interface ScoreBreakdown {
    parsing: number; // 30%
    logic: number;   // 20%
    latency: number; // 20%
    history: number; // 30%
}

export interface Signal {
    id: string;
    source: string;
    instrument: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    entry_price: number;
    stop_loss: number;
    targets: number[];
    confidence: number; // 0-100
    score_breakdown?: ScoreBreakdown;
    timestamp_ist: string;
    metadata?: any;
}

export class SignalManager {
    private signals: Signal[] = [];

    private calculateScore(signal: Signal): { total: number, breakdown: ScoreBreakdown } {
        // 1. Parsing Score (30%) - Assumed high if regex passed
        const parsing = 100;

        // 2. Logic Score (20%) - Logic check
        let logic = 100;
        if (signal.side === 'BUY') {
            if (signal.stop_loss >= signal.entry_price || signal.targets.some(t => t <= signal.entry_price)) logic = 0;
        } else {
            if (signal.stop_loss <= signal.entry_price || signal.targets.some(t => t >= signal.entry_price)) logic = 0;
        }

        // 3. Latency Score (20%)
        let latency = 100;
        const signalTime = new Date(signal.timestamp_ist).getTime();
        const diff = (Date.now() - signalTime) / 1000;
        if (diff > 15) latency = 80;
        if (diff > 30) latency = 50;
        if (diff > 60) latency = 0; // Should be rejected anyway

        // 4. History Score (30%)
        const stats = SignalStats.getStats(signal.source);
        const history = Math.round(stats.success_rate * 100);

        // Weighted Sum
        const total = (parsing * 0.3) + (logic * 0.2) + (latency * 0.2) + (history * 0.3);

        return {
            total: Math.round(total),
            breakdown: { parsing, logic, latency, history }
        };
    }

    public validateSignal(signal: Signal): { valid: boolean; reason?: string } {
        // 1. Stale Check (60 seconds)
        const signalTime = new Date(signal.timestamp_ist).getTime();
        const now = Date.now(); // UTC (Server) roughly aligns if timezones managed
        const diff = (now - signalTime) / 1000;

        if (diff > 60) {
            return { valid: false, reason: `STALE_SIGNAL: ${Math.floor(diff)}s lag > 60s limit` };
        }

        // 2. Logic Check (Buy: SL < Entry < Target)
        if (signal.side === 'BUY') {
            if (signal.stop_loss >= signal.entry_price) return { valid: false, reason: "INVALID_RISK: Buy SL >= Entry" };
            if (signal.targets.some(t => t <= signal.entry_price)) return { valid: false, reason: "INVALID_REWARD: Buy Target <= Entry" };
        } else {
            // Sell: SL > Entry > Target
            if (signal.stop_loss <= signal.entry_price) return { valid: false, reason: "INVALID_RISK: Sell SL <= Entry" };
            if (signal.targets.some(t => t >= signal.entry_price)) return { valid: false, reason: "INVALID_REWARD: Sell Target >= Entry" };
        }

        // 3. Confidence Gate
        if (signal.confidence < 80) {
            return { valid: false, reason: `LOW_CONFIDENCE: ${signal.confidence}% < 80% threshold` };
        }

        return { valid: true };
    }

    public async ingestSignal(rawSignal: Signal) {
        // Calculate Latency for Training Data
        const signalTime = new Date(rawSignal.timestamp_ist).getTime();
        const diff = (Date.now() - signalTime) / 1000;

        // Enforce Validation
        const validation = this.validateSignal(rawSignal);
        if (!validation.valid) {
            console.warn(`[SignalManager] REJECTED ${rawSignal.source}: ${validation.reason}`);

            // Log REJECTED signals for training too (Negative samples)
            await TrainingStore.logIngest({
                signal_id: `REJ-${Date.now()}`,
                raw_message: rawSignal.metadata?.original_text || 'NO_RAW_DATA',
                parsed_payload: rawSignal,
                parse_confidence: rawSignal.confidence || 0,
                aegis_validation_result: { status: 'REJECTED', reason: validation.reason },
                latency_ms: Math.round(diff * 1000)
            });

            throw new Error(validation.reason);
        }

        // Calculate Deterministic Score
        const scoreData = this.calculateScore(rawSignal);

        // Add ID and Store
        const processedSignal = {
            ...rawSignal,
            id: `SIG-${Date.now()}`,
            confidence: scoreData.total,
            score_breakdown: scoreData.breakdown
        };
        this.signals.unshift(processedSignal);

        // LOG FOR TRAINING Data (PostgreSQL + Mirror)
        await TrainingStore.logIngest({
            signal_id: processedSignal.id,
            raw_message: processedSignal.metadata?.original_text || 'NO_RAW_DATA',
            parsed_payload: processedSignal,
            parse_confidence: processedSignal.confidence,
            aegis_validation_result: { status: 'ACCEPTED', score_breakdown: processedSignal.score_breakdown },
            latency_ms: Math.round(diff * 1000)
        });

        // Cap memory to last 50
        if (this.signals.length > 50) this.signals.pop();

        console.log(`[SignalManager] ACCEPTED ${processedSignal.id} from ${processedSignal.source}`);
        return processedSignal;
    }

    public getRecentSignals() {
        return this.signals;
    }
}

export const signalManager = new SignalManager();
