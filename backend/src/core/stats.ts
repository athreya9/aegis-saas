export interface ChannelStats {
    source: string;
    total_signals: number;
    success_rate: number; // 0-1
    avg_quality: number; // 0-100
    hit_rate: number; // 0-1 (Wins / Total) - NEW
    avg_pnl_points: number; // Avg points captured - NEW
    sl_frequency: number; // 0-1 (SL Hits / Total) - NEW
    last_updated: number;
}

const STATS_DB: Record<string, ChannelStats> = {
    // Seed Data
    'TELEGRAM:@Options_Banknifty_Share_Market': {
        source: '@Options_Banknifty_Share_Market',
        total_signals: 142,
        success_rate: 0.72,
        avg_quality: 85,
        hit_rate: 0.68,
        avg_pnl_points: 45.5,
        sl_frequency: 0.15,
        last_updated: Date.now()
    },
    'TELEGRAM:@Messy_Channel': {
        source: '@Messy_Channel',
        total_signals: 12,
        success_rate: 0.30,
        avg_quality: 45,
        hit_rate: 0.25,
        avg_pnl_points: -12.0,
        sl_frequency: 0.60,
        last_updated: Date.now()
    }
};

export class SignalStats {
    public static getStats(sourceKey: string): ChannelStats {
        // Strip prefix if needed
        const key = sourceKey.startsWith('TELEGRAM:') ? sourceKey : `TELEGRAM:${sourceKey}`;

        return STATS_DB[key] || {
            source: sourceKey,
            total_signals: 0,
            success_rate: 0.5, // Neutral start
            avg_quality: 50,
            hit_rate: 0.5,
            avg_pnl_points: 0,
            sl_frequency: 0.5,
            last_updated: Date.now()
        };
    }

    public static recordOutcome(sourceKey: string, success: boolean, pnl: number = 0) {
        // Mock method for updating stats
        const stats = this.getStats(sourceKey);
        stats.total_signals++;
        // EWMA update
        stats.success_rate = (stats.success_rate * 0.9) + (success ? 0.1 : 0);
        stats.hit_rate = (stats.hit_rate * 0.95) + (success ? 0.05 : 0);
        stats.avg_pnl_points = (stats.avg_pnl_points * 0.9) + (pnl * 0.1);

        if (pnl < 0) {
            stats.sl_frequency = (stats.sl_frequency * 0.95) + 0.05;
        } else {
            stats.sl_frequency = (stats.sl_frequency * 0.95);
        }

        STATS_DB[sourceKey] = stats;
    }
}
