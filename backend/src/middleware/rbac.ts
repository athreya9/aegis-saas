
import { Request, Response, NextFunction } from 'express';

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    TRADER = 'TRADER',
    VIEWER = 'VIEWER'
}

// Permission Granularity
export type Permission =
    | 'FULL_GOVERNANCE'    // Super Admin: All access
    | 'OS_CONTROL_PANIC'   // Trigger Kill Switch
    | 'OS_CONTROL_TELEGRAM'// Manage Telegram
    | 'USER_MANAGE'        // Manage Users
    | 'SIGNAL_VIEW'        // View Signals & Trade Data
    | 'OS_READ_ONLY';      // View System Status Only

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.SUPER_ADMIN]: ['FULL_GOVERNANCE'],
    [UserRole.ADMIN]: [
        'OS_CONTROL_PANIC',
        'OS_CONTROL_TELEGRAM',
        'USER_MANAGE',
        'SIGNAL_VIEW',
        'OS_READ_ONLY'
    ],
    [UserRole.TRADER]: [
        'SIGNAL_VIEW',
        'OS_READ_ONLY'
    ],
    [UserRole.VIEWER]: [
        'OS_READ_ONLY'
    ]
};

export const hasPermission = (userRole: UserRole, requiredPermission: Permission): boolean => {
    const perms = ROLE_PERMISSIONS[userRole] || [];
    if (perms.includes('FULL_GOVERNANCE')) return true;
    return perms.includes(requiredPermission);
};

// Middleware Factory
export const requireRole = (role: UserRole) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.headers['x-user-role'] as UserRole;

        if (!userRole) {
            res.status(401).json({ status: 'error', message: 'Unauthorized: No role provided' });
            return;
        }

        if (userRole === UserRole.SUPER_ADMIN) {
            next();
            return;
        }

        if (userRole !== role) {
            res.status(403).json({ status: 'error', message: `Forbidden: Requires ${role}` });
            return;
        }

        next();
    };
};

export const requirePermission = (permission: Permission) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.headers['x-user-role'] as UserRole;

        if (!userRole) {
            res.status(401).json({ status: 'error', message: 'Unauthorized: No role provided' });
            return;
        }

        if (!hasPermission(userRole, permission)) {
            res.status(403).json({ status: 'error', message: `Forbidden: Missing permission ${permission}` });
            return;
        }

        next();
    };
};
