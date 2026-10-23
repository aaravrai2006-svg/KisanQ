# KISANQ / KISANSETU — SYSTEM ARCHITECTURE

## 1. High-Level Architecture

```text
                        ┌───────────────────────────────┐
                        │        CLIENT BROWSER         │
                        │    (Next.js 16.3 + React 19)  │
                        └───────────────┬───────────────┘
                                        │ HTTPS / WSS
                                        ▼
                        ┌───────────────────────────────┐
                        │      FASTAPI REST SERVER      │
                        │   (Python 3.14 + Uvicorn)     │
                        └───────┬───────────────┬───────┘
                                │               │
                ┌───────────────┘               └───────────────┐
                ▼                                               ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│     SQLAlchemy ORM (Async)    │               │     MARKET DATA ADAPTER       │
│  (PostgreSQL / SQLite Engine) │               │   - Data.gov.in Agmarknet API │
└───────────────┬───────────────┘               │   - CEDA Ashoka Mandi API     │
                │                               │   - Verified Historical Feeds │
                ▼                               └───────────────────────────────┘
┌───────────────────────────────┐
│       NORMALIZED SCHEMA       │
│  - users & farmer_profiles    │
│  - crops, centres, schedules  │
│  - slots, requests, tokens    │
│  - quality_checks, payments   │
│  - market_prices, audit_logs  │
└───────────────────────────────┘
```

## 2. Directory Structure

```text
kisanq/
├── app/                  # Next.js App Router (Farmer, Admin, Auth, API redirects)
├── components/           # UI Components (Map, Chatbot, Price-History, Sell-Today, UI)
├── lib/                  # State, Contexts, Types, Client Utilities
├── services/             # Frontend Typed API Service Layer
├── docs/                 # PRD, Architecture, Database, Data Sources, Implementation Status
├── backend/              # Python FastAPI Application
│   ├── app/
│   │   ├── api/          # Routers (auth, farmers, crops, centres, slots, queue, payments, ai)
│   │   ├── core/         # Config, Database, Security, JWT
│   │   ├── models/       # SQLAlchemy 2.0 ORM Models
│   │   ├── schemas/      # Pydantic v2 validation models
│   │   ├── services/     # Business logic (MarketData, QueueEngine, AI Assistant)
│   │   └── main.py       # FastAPI application entrypoint
│   ├── seed/             # Seeding script for verified Bhopal/Sehore centres & market data
│   ├── tests/            # Automated pytest suites
│   └── requirements.txt
├── .env.example          # Environment variables template
└── README.md
```

## 3. Key Design Decisions

1. **Database Flexibility**:
   * Uses standard SQLAlchemy connection strings configured through `DATABASE_URL`.
   * Defaults to high-performance async SQLite (`sqlite+aiosqlite:///./kisanq.db`) in local environments where PostgreSQL server is not locally installed, and seamlessly uses PostgreSQL (`postgresql+psycopg://...`) in staging and production environments without changing any schema definition.
2. **Security & Authorization**:
   * JWT tokens signed with SHA-256 (`HS256`).
   * Passwords hashed with `bcrypt`.
   * Role hierarchy: `FARMER` (can manage their own crops, slots, tokens) and `ADMIN` / `CENTRE_OPERATOR` (can manage all centres, queue calls, payments).
3. **Market Data Provider Pattern**:
   * Abstract `MarketDataProvider` isolates external API variability.
   * If an external API is down or throttled, the system serves the latest verified cached records with an explicit `is_stale: true` and last-verified timestamp.
