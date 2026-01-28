
import { UserTier } from '../config/user-tier';
import { UserRole } from '../middleware/rbac';

export interface User {
    id: string; // UUID
    email: string;
    role: UserRole;
    tier: UserTier;

    // Auth
    password_hash?: string;
    provider?: string; // 'google', 'credentials'

    // Governance
    is_blocked: boolean;
    block_reason?: string;

    // Risk Quota (Overrides Tier defaults if set)
    risk_quota_max_capital?: number;
    risk_quota_max_risk_per_trade?: number;

    // Meta
    created_at: Date;
    last_login_at?: Date;
}
