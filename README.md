<div align="center">

# 🌾 KisanQ (KisanSetu)

### AI-Powered Smart Agriculture, Mandi Market Intelligence & Procurement Token Infrastructure

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Gemini API](https://img.shields.io/badge/Gemini_API-Saathi_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<p align="center">
  <b>Bridging the gap between registered farmers, APMC Mandis, modern silos, and state administration with real-time market pricing, dynamic queue scheduling, electronic weighment verification, and conversational GenAI advisory.</b>
</p>

</div>

---

## 📖 Overview

In traditional Indian agricultural markets (APMC Mandis), farmers face severe bottlenecks: opaque broker intermediaries, unpredictable gate lines causing multi-day vehicle queues, paper register errors, and delayed Direct Benefit Transfer (DBT) payments.

**KisanQ** transforms this manual pipeline into a high-throughput, transparent digital public infrastructure. It provides real-time mandi price discovery, algorithmic token scheduling, a 9-stage consignment lifecycle tracker, electronic weighment slip generation (Form J), and **KisanSetu Saathi**—an in-app AI assistant powered by Google Gemini supporting natural language agricultural inquiries.

---

## 🏛️ System Architecture

```text
                        ┌────────────────────────────────────────┐
                        │        CLIENT APPLICATION              │
                        │    (Next.js 15 + React 19 + Tailwind)  │
                        └───────────────────┬────────────────────┘
                                            │ HTTPS / JSON API
                                            ▼
                        ┌────────────────────────────────────────┐
                        │      FASTAPI ASYNC REST SERVER         │
                        │   (Python 3.12+ · Uvicorn · Pydantic)  │
                        └─────────┬────────────────────┬─────────┘
                                  │                    │
                  ┌───────────────┘                    └────────────────┐
                  ▼                                                     ▼
  ┌───────────────────────────────┐                     ┌───────────────────────────────┐
  │     SQLAlchemy ORM (Async)    │                     │      EXTERNAL INTEGRATIONS    │
  │  (PostgreSQL / SQLite Engine) │                     │  • Agmarknet / MP Mandi Board │
  └───────────────┬───────────────┘                     │  • Google Gemini API (LLM)    │
                  │                                     │  • PFMS / DBT Payout Mock     │
                  ▼                                     └───────────────────────────────┘
  ┌───────────────────────────────┐
  │       NORMALIZED SCHEMA       │
  │  • Users & Farmer Profiles    │
  │  • Mandis, Silos & Schedules  │
  │  • Real-Time Queue & Tokens   │
  │  • Quality Checks & Weights   │
  │  • Market Prices & Audits     │
  └───────────────────────────────┘
```

---

## ✨ Key Capabilities & Modules

### 1. 👨‍🌾 Farmer Command Portal (Bilingual Hindi/English)
- **Real-Time Mandi Intelligence**: Live Modal, Min, and Max market rates for Wheat, Soyabean, Chana, Mustard, Paddy, and Maize sourced from official Agmarknet channels.
- **Smart Queue & Dynamic Token Engine**: Farmers reserve verified harvest delivery slots and receive algorithmic tokens (e.g., `BPL-2026-0142`) with real-time wait estimation, preventing physical mandi congestion.
- **9-Stage Consignment Lifecycle**:
  End-to-end transparent state machine tracking every agricultural consignment from booking to direct bank settlement:

```mermaid
flowchart LR
    A["1. REQUESTED"] --> B["2. SLOT BOOKED"]
    B --> C["3. ARRIVED"]
    C --> D["4. QUALITY CHECK"]
    D --> E["5. ACCEPTED"]
    E --> F["6. PROCURED"]
    F --> G["7. INVOICED"]
    G --> H["8. PROCESSING"]
    H --> I["9. PAID"]
```

  > `1. REQUESTED` ➔ `2. SLOT_BOOKED` ➔ `3. ARRIVED` ➔ `4. QUALITY_CHECK` ➔ `5. ACCEPTED` ➔ `6. PROCURED` ➔ `7. INVOICED` ➔ `8. PAYMENT_PROCESSING` ➔ `9. PAID`
- **Electronic Form J Weighment Slip**: Automated generation of digital weighment and procurement slips with moisture content, foreign matter deduction, and gross/tare metrics.
- **Aaj Hi Bechein (Instant Liquidity)**: Direct comparison between standard open-mandi auction rates versus expedited same-day DBT settlement offers.

### 2. 🤖 KisanSetu Saathi — GenAI Agricultural Assistant
- Grounded conversational assistant powered by **Google Gemini API**.
- Speaks and answers inquiries in plain, colloquial Hindi and English regarding MSP rates, weather advisories, slot booking status, and mandi gate protocols.
- Built-in prompt guardrails ensure responses strictly adhere to authorized agricultural domains.

### 3. 🏢 Admin & Mandi Centre Console
- **Throughput Telemetry**: Live metric cards displaying daily intake tonnage, active vehicles in queue, and silo occupancy percentages.
- **Weighbridge Queue Manager**: One-click "Call Next Vehicle", electronic gate pass validation, and automated lane distribution.
- **DBT Ledger Reconciliation**: Batch payout processing with NPCI/PFMS transaction reference tracking and audit logs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | Python 3.12+, FastAPI, Uvicorn, Pydantic v2 |
| **Database & ORM** | PostgreSQL 16 (Production) / Async SQLite (Local Dev), SQLAlchemy 2.0 Async |
| **Generative AI** | Google Gemini API (gemini-1.5-flash / Pro) |
| **Security** | JWT Authentication (HS256), Bcrypt password hashing, CORS protection |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ and pnpm / npm
- Python 3.11+
- PostgreSQL (or local SQLite fallback)
- Google Gemini API Key

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and GEMINI_API_KEY

# Seed initial verified Mandi data (Bhopal & Sehore region)
python -m app.seed.seed_data

# Launch the FastAPI server
uvicorn app.main:app --reload --port 8000
```
*Backend Swagger Docs will be live at `http://localhost:8000/docs`.*

### 2. Frontend Setup

```bash
# In the project root
npm install   # or pnpm install

# Configure environment
cp .env.example .env.local
# Ensure NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Run Next.js development server
npm run dev
```
*Frontend will be running at `http://localhost:3000`.*

---

## 📡 Core API Specification

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register farmer or admin account |
| `/api/auth/login` | `POST` | Public | Authenticate and obtain JWT bearer token |
| `/api/centres` | `GET` | Authenticated | List procurement centres and real-time capacity |
| `/api/slots/available` | `GET` | Authenticated | Fetch open delivery slots by date & crop |
| `/api/queue/book` | `POST` | Farmer | Reserve delivery slot & generate digital token |
| `/api/queue/live/{centre_id}` | `GET` | Public | Live queue status and current serving token |
| `/api/quality-checks` | `POST` | Admin | Log moisture & foreign matter analysis |
| `/api/payments/batches` | `POST` | Admin | Execute Direct Benefit Transfer (DBT) batch |
| `/api/ai/chat` | `POST` | Authenticated | Query Gemini-powered KisanSetu Saathi assistant |

---

## 📜 Documentation

Detailed architectural blueprints, database entity-relationship models, and technical PRDs are available in the [`docs/`](./docs) directory:
- 📄 [Product Requirements Document (PRD)](./docs/PRD.md)
- 🏗️ [System Architecture Blueprint](./docs/ARCHITECTURE.md)
- 🗄️ [Database Entity & Schema Spec](./docs/DATABASE.md)
- 🔌 [Complete REST API Reference](./docs/API.md)

---

## 👨‍💻 Author

**Aarav Rai**
- GitHub: [@aaravrai2006-svg](https://github.com/aaravrai2006-svg)
- Email: [aarav.rai2006@gmail.com](mailto:aarav.rai2006@gmail.com)

