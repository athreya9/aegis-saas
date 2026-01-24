# Aegis SaaS Platform

Independent SaaS platform for automated signal intelligence and sandbox trading.

## Architecture
- **Frontend**: Next.js (Port 3100)
- **Admin UI**: Next.js (Port 3101)
- **Backend**: Express/TypeScript (Port 4100)
- **Database**: PostgreSQL (Port 5432)

## Strict Isolation
The Aegis SaaS platform is built to be completely isolated from the Core Trading Engine. 
- Shared Nothing architecture.
- Communication with Core is prohibited.
- Dedicated VPS folder: `/opt/aegis-saas/`

## Deployment
- **VPS IP**: 91.98.226.5
- **Services**: Managed via PM2.

## Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Admin
cd admin-ui && npm run dev
```
