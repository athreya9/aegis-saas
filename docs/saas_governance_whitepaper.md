# Aegis SaaS Governance Whitepaper

## Overview
This document outlines the governance model for the Aegis SaaS Platform, detailing how Role-Based Access Control (RBAC) and Billing-Driven Risk Quotas are seamlessly integrated to provide a secure and monetizable layer on top of the Aegis Trading OS.

## 1. Role-Based Access Control (RBAC)

The SaaS Backend enforces strict RBAC. The OS Core trusts the SaaS Backend to authorize requests (Future: OS will verify SaaS signatures).

### Roles & Permissions

| Role | SaaS Permissions | OS Permission Mapping | Description |
| :--- | :--- | :--- | :--- |
| **SUPER_ADMIN** | `ALL` | `ROOT` | Full access to System Settings, Billing, Kill-Switch, and Root OS commands. |
| **ADMIN** | `USER_MANAGE`, `SYSTEM_VIEW` | `READ`, `CONTROL` (limited) | Can manage users, view system health, and trigger emergency stops. |
| **TRADER** | `PROFILE`, `BILLING` | `READ`, `SIGNAL_VIEW` | Standard user. Can view signals and their execution stats. |
| **VIEWER** | `PROFILE_READ` | `READ_ONLY` | Read-only access to dashboard. No execution or billing control. |

## 2. Billing & Risk Quota Contract

Billing tiers dictate the operational parameters of the Trading OS for each user ("Sandbox"). Logic resides strictly in SaaS Backend.

### Plan Definitions

#### **FREE**
- **Objective**: Onboarding & Exploration.
- **Execution Mode**: `PAPER_ONLY`
- **Max Trades/Day**: 0 (Live), Unlimited (Paper)
- **Allowed Instruments**: N/A
- **Features**: Real-time Signal Viewing, 15-min delayed charts.

#### **BASIC**
- **Objective**: Retail Trader (Conservative).
- **Execution Mode**: `LIVE`
- **Max Trades/Day**: 5
- **Max Risk Per Trade**: 0.25% of Capital
- **Allowed Instruments**: `NIFTY` only.
- **Features**: Execution Automation, Basic Analytics.

#### **PRO**
- **Objective**: Professional/High-Volume.
- **Execution Mode**: `LIVE`
- **Max Trades/Day**: Unlimited
- **Max Risk Per Trade**: 1.0% of Capital
- **Allowed Instruments**: `ALL` (NIFTY, BANKNIFTY, FINNIFTY).
- **Features**: Advanced Analytics, Priority Execution, API Access.

## 3. Integration Flow

### Data Flow Diagram

```mermaid
graph TD
    User[User / Client] -->|API Request| SaaS[SaaS Backend (Port 4100)]
    
    subgraph SaaS Layer
        SaaS -->|1. Authenticate| Auth[Auth Service]
        SaaS -->|2. Verify Role| RBAC[RBAC Middleware]
        SaaS -->|3. Check Quota| Billing[Quota Manager]
    end
    
    SaaS -->|4. Forward if Valid| OS[Aegis OS Core (Port 8080)]
    OS -->|Response| SaaS
    SaaS -->|5. Audit Log| DB[(PostgreSQL)]
    SaaS -->|Response| User
```

### Security Principles
1.  **Isolation**: Users never interact with Port 8080 directly.
2.  **Envelope**: All OS commands are wrapped in a SaaS "Permission Envelope" (Internal metadata).
3.  **Fail-Close**: If Quota Manager or RBAC fails/errors, the request is blocked.
4.  **Audit**: All OS commands triggered by SaaS are logged with `user_id`, `role`, and `plan_snapshot` for immutability.
