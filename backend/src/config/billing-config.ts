
import { TIER_LIMITS, UserTier } from './user-tier';

export const BILLING_CONFIG = {
    currency: 'USD',
    plans: {
        [UserTier.FREE]: { price: 0, interval: 'month' },
        [UserTier.BASIC]: { price: 29, interval: 'month' },
        [UserTier.PRO]: { price: 99, interval: 'month' },
        [UserTier.ELITE]: { price: 299, interval: 'month' }
    },
    limits: TIER_LIMITS
};
