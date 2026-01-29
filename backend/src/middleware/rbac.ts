import { Request, Response, NextFunction } from 'express';
import { db } from '../db/pg-client';

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    TRADER = 'TRADER',
    VIEW_ONLY = 'VIEW_ONLY'
}

// Extend Express Request
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role?: UserRole;
                plan?: string;
                brokerConnected?: boolean;
            };
        }
    }
}

export const requireRole = (requiredRole: UserRole) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Headers mock for now, but will be JWT based in production
        const userRole = (req.headers['x-user-role'] as UserRole) || UserRole.VIEW_ONLY;

        const rolesHierarchy = [UserRole.VIEW_ONLY, UserRole.TRADER, UserRole.ADMIN, UserRole.SUPER_ADMIN];
        const userLevel = rolesHierarchy.indexOf(userRole);
        const requiredLevel = rolesHierarchy.indexOf(requiredRole);

        if (userLevel < requiredLevel) {
            return res.status(403).json({
                status: 'error',
                error: 'FORBIDDEN',
                message: `Insufficient permissions. Required: ${requiredRole}`
            });
        }
        next();
    };
};

export const requireBrokerConnection = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.headers['x-user-id'] as string;

        if (!userId) {
            return res.status(401).json({ error: 'UNAUTHORIZED' });
        }

        try {
            const result = await db.query(
                `SELECT status FROM user_brokers WHERE user_id = $1`,
                [userId]
            );

            if (result.rows.length === 0 || result.rows[0].status !== 'ACTIVE') {
                return res.status(403).json({
                    status: 'error',
                    error: 'BROKER_REQUIRED',
                    message: 'Active broker connection required for this action.'
                });
            }
            next();
        } catch (e) {
            console.error("Broker Check Error:", e);
            return res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    };
};
