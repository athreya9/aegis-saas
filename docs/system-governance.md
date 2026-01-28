# Aegis System Governance: The Rule of Law

> **Purpose**: This document defines the non-negotiable standards for "Done", deployment, and system configuration. It serves as the primary defense against feature drift and unverified changes.

---

## 1. The Single Source of Truth
Configuration is strictly hierarchical. **Frontend never defines policy.**

1.  **Backend (SystemConfig)**: The absolute authority. Defined in `src/core/config.ts` and Database rules.
2.  **API Layer**: Exposes sanctioned config via `/api/v1/control/config-meta`.
3.  **Frontend Context**: Consumes API config on load via `ConfigProvider`. Adapts UI availability based on response.

### Anti-Drift Rule
- **NEVER** hardcode limits (e.g., "Max Risk: 5000") in Frontend components.
- **ALWAYS** reference `useSystemConfig().plans[PLAN].maxDailyRisk`.

---

## 2. Release Checklist
A feature is **NOT DONE** until it passes the verified release path.

### Pre-Deployment
- [ ] **Code Review**: No logic changes without strict type safety checks.
- [ ] **Lint & Build**: `npm run build` must pass with zero errors.
- [ ] **Database Audit**: Schema changes must be additive or strictly backward compatible.

### Deployment (VPS)
- [ ] **Pull & Install**: `git pull` && `npm install --production`.
- [ ] **Database Migration**: Run migration scripts if schema changed.
- [ ] **Process Restart**: `pm2 reload all`.

### Post-Deployment Verification
- [ ] **Health Check**: `curl https://api.aegis.local/health` returns 200 OK.
- [ ] **Config Verify**: `/api/v1/control/config-meta` returns expected feature flags.
- [ ] **Live Smoke Test**: Login as Admin -> Verify Dashboard loads without red "Offline" banners.

---

## 3. Governance Rules

### Rule #1: The "No Ghost Features" Policy
If a feature is not in `FEATURE_FLAGS` (Backend), it does not exist. Frontend must strictly hide/disable UI elements for inactive flags.

### Rule #2: Admin Actions are ETERNAL
Any action taken by an Admin (Force Kill, Force Re-auth, Risk Override) must be:
1.  Logged to `system_audit_logs` (future phase).
2.  Irreversible by the User (User cannot "un-kill" themselves).

### Rule #3: The Kill Switch is Supreme
If `ENABLE_LIVE_TRADING` is set to `FALSE` in Backend Config:
- All `placeOrder` calls must reject immediately.
- Frontend must display global "Maintenance Mode" banner.
- No new sessions can be authorized.
