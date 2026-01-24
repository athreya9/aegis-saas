# Aegis SaaS Architecture

## Overview
The Aegis SaaS platform provides user-facing dashboards and administrative tools for managing trading sandboxes and signal intelligence.

## Components

### 1. Backend (Express.js)
- Manages user sandboxes and state.
- Exposes REST API on port 4100.
- Connects to local PostgreSQL database.

### 2. Frontend (Next.js)
- User Dashboard and Signals Terminal.
- Port 3100.

### 3. Admin UI (Next.js)
- Infrastructure monitoring and user management.
- Port 3101.

### 4. Database (PostgreSQL)
- Persists user data, subscriptions, and sandbox state.
- Port 5432.

## Security & Isolation
- The backend operates in **Mock/Paper Mode** only.
- No direct execution logic is included in the SaaS backend.
- Core Trading System is treated as an external, untouched system.
