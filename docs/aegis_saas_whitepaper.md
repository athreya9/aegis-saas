# Aegis SaaS Whitepaper

## 1. Executive Summary
**Aegis SaaS** is the commercial cockpit for the Aegis Algorithmic TradingOS. While the OS acts as the high-performance execution engine (Port 8080), the SaaS Platform (Ports 3100/3101/4100) provides the governance, monetization, and user management layer required to deliver the OS as a scalable product.

> **"The OS is the aircraft engine. The SaaS is the cockpit. Cockpits do not fly planes. They request."**

## 2. Platform Architecture
### Why SaaS ≠ Trading Engine
- **Trading Engine (OS)**: Deterministic, low-latency, stateful, single-tenant focus. Handles direct broker I/O and signal processing.
- **SaaS Platform**: Scalable, multi-tenant, stateless (mostly). Handles auth, billing, historical data, and permission envelopes.

### Responsibilities
| Component | Responsibilities |
| :--- | :--- |
| **SaaS Frontend** | User Dashboard, Signal Visualization, Subscription Management. |
| **SaaS Admin** | User Oversight, Global Kill-Switch, System Health Monitoring. |
| **SaaS Backend** | Authentication, RBAC Enforcement, Plan Quotas, Audit Logging. |
| **Aegis OS** | Order Execution, Risk Checks (Real-time), Broker Connectivity, Signal Ingestion. |

### Data Flow Diagram
```mermaid
graph TD
    User[User] -->|HTTPS| UI[SaaS UI (3100)]
    UI -->|REST| API[SaaS Backend (4100)]
    
    subgraph Governance Layer
        API -->|1. Auth| JWT[JWT Validator]
        API -->|2. Authorize| RBAC[RBAC Guard]
        API -->|3. Quota| Bill[Quota Manager]
    end
    
    API -->|4. Safe Request| OS[Aegis OS (8080)]
    OS -->|5. Execution State| API
    API -->|6. Audit Log| DB[(PostgreSQL)]
```

## 3. Governance Model

### RBAC (Role-Based Access Control)
The SaaS layer enforces permissions before any command touches the OS.

| SaaS Role | Description | OS Permission Envelope |
| :--- | :--- | :--- |
| **SUPER_ADMIN** | Platform Owner. Full system access. | `ROOT` (All commands) |
| **ADMIN** | Support/Ops. Can manage users & emergencies. | `CONTROL` (Kill-Switch, User Status) |
| **TRADER** | Paid User. Can view signals & manage own bot. | `READ` + `SIGNAL_VIEW` + `ARM/DISARM` (Self) |
| **VIEWER** | Unpaid/Guest. Read-only access. | `READ_ONLY` |

### Billing & Risk Enforcement
Subscription tiers dictate the "physics" of the user's trading sandbox.

| Plan | Max Trades/Day | Max Risk/Trade | Execution Mode | Instruments |
| :--- | :--- | :--- | :--- | :--- |
| **FREE** | 0 | N/A | `PAPER_ONLY` | None (View Only) |
| **BASIC** | 5 | 0.25% | `LIVE` | NIFTY Only |
| **PRO** | Unlimited | 1.0% | `LIVE` | ALL |

## 4. SaaS-OS Contract
The SaaS Platform guarantees:
1.  **Authentication**: No anonymous requests reach the OS.
2.  **Authorization**: Users can only control their own Sandbox.
3.  **Sanitization**: All inputs are validated before forwarding.
4.  **Isolation**: OS failure does not take down SaaS (cached state serving).

## 5. Infrastructure

| Service | Port | Description |
| :--- | :--- | :--- |
| **Frontend** | 3100 | User Dashboard (Next.js) |
| **Admin UI** | 3101 | Control Plane (Next.js) |
| **Backend API** | 4100 | SaaS Logic (Node.js/Express) |
| **OS Read Source** | 8080 | Execution Kernel (Aegis Core) |

## 6. Emergency Protocol (Kill-Switch)

In the event of a catastrophic market event or algorithmic anomaly, the **Global Kill-Switch** protocol is activated.

1.  **Initiation**:
    *   **Actor**: SUPER_ADMIN (via Admin UI).
    *   **Action**: Clicks "EMERGENCY PANIC".
2.  **SaaS Validation**:
    *   Checks `x-user-role: SUPER_ADMIN`.
    *   Logs event to Audit Trail (`user_id`, `timestamp`, `reason`, `source_ip`).
3.  **OS Execution**:
    *   SaaS calls `POST /api/os/panic` on Port 8080.
    *   OS Kernel immediately:
        *   Cancels all open orders.
        *   Flattens all positions (Market Exit).
        *   Sets `ENGINE_STATE = EMERGENCY_STOP`.
        *   Rejects all future signals until manual reset.
4.  **Notification**:
    *   System broadcasts "SYSTEM LOCKDOWN" to all connected Frontends.
    *   Admin notified via email/Slack (Future).

## 7. Failure Handling Policy

### Scenario A: OS Core Down (Port 8080 Unreachable)
*   **SaaS Behavior**:
    *   Serves cached "Last Known State" (Status: `OFFLINE`).
    *   Admin UI shows "KERNEL DISCONNECTED" warning.
    *   User commands (e.g., "Start Bot") rejected with `503 Service Unavailable`.
*   **Recovery**:
    *   SaaS continues polling.
    *   Once OS comes online, SaaS syncs state automatically.

### Scenario B: SaaS Backend Down (Port 4100 Unreachable)
*   **OS Behavior**:
    *   OS continues running last accepted parameters (Autonomous Mode).
    *   **Risk**: No new user commands can reach OS.
    *   **Mitigation**: OS has internal risk limits and can be accessed via SSH for manual override if SaaS is completely dead.

## 8. Revenue Model
Aegis SaaS operates on a strict subscription-only model.

### Tiers & Pricing
1.  **FREE (Paper Trading)** - ₹0/mo
    *   Target: Beginners / Testing.
    *   Access: 15-min delayed data, Paper Execution only.
    *   *Strategic Value: Marketing Funnel & Data collection.*

2.  **PRO (Active Trader)** - ₹5,000/mo
    *   Target: Retail Algorithmic Traders.
    *   Access: Real-time Live Trading, Max 10 Trades/Day, 1% Risk Cap.
    *   *Revenue Driver: Mainstream Adoption.*

3.  **ELITE (Institutional)** - ₹15,000/mo
    *   Target: High Net Worth Individuals (HNIs) & Prop Desks.
    *   Access: Priority Execution, Custom Risk Params (up to 2%), API Access.
    *   *Revenue Driver: High Margin Upsell.*

## 9. Regulatory Safety & Compliance
### "Technology Provider" Exemption
Aegis SaaS strictly adheres to the definition of a **Technology Platform**, distinctly separating itself from Investment Advisory services.

*   **No Funds Custody**: We do not accept, hold, or route user funds. All settlements occur directly between the User and their Broker (Zerodha/Fyers).
*   **No Financial Advice**: Signals are generated by mathematical models. Users must manually configure and "Arm" strategies, retaining full agency over execution.
*   **Audit Trail**: Every action (Login, Strategy Activation, Trade) is logged immutably for compliance audits.

## 10. Risk Disclaimers
*   **Algorithmic Risk**: Trading logic may produce losses during anomalous market conditions.
*   **Infrastructure Risk**: Cloud or Broker API outages may prevent order modification.
*   **Liability Cap**: Aegis SaaS liability is strictly limited to the monthly subscription fee.

[(See Architecture Diagram)](file:///Users/datta/.gemini/antigravity/brain/f72cba31-55fd-42f3-92c1-de4b01c9aaff/investor-architecture.mermaid)
