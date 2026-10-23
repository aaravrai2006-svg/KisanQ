# KISANSETU / KISANQ — PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Product Vision
KisanSetu / KisanQ is a mission-critical digital public infrastructure platform empowering Indian farmers with transparent crop procurement, real-time APMC mandi market intelligence, smart queue scheduling, digital tokens, and electronic weighment verification. It bridges the gap between registered farmers, procurement centres (mandis & modern silos), and administration.

## 2. Target Personas
1. **Registered Farmer**: Wants to check today's real mandi prices, find nearby operating procurement centres, book verified harvest slots, avoid long gate queues via digital tokens, track procurement status from gate-inward to DBT bank credit, and receive support in Hindi or English.
2. **Centre Manager / Weighbridge Operator**: Manages daily intake capacity, verifies arriving farmer tokens, records quality parameters (moisture, foreign matter), logs gross and tare weights, and calls the next vehicle in line.
3. **District / State Admin**: Monitors district-wide intake tonnage, silo storage occupancy, live queue bottlenecks, market price movements, and approves Direct Benefit Transfer (DBT) payment batches.

## 3. Core Features & Capabilities

### 3.1 Farmer Portal
* **Bilingual Experience**: Full switchable Hindi (`hi`) and English (`en`) interface.
* **Authentication**: Mobile number / Farmer ID login with secure credentials.
* **Live Mandi Intelligence**:
  * Real-time prices for major crops (Wheat, Soyabean, Chana, Mustard, Paddy, Maize).
  * Minimum, Maximum, and Modal rates from Agmarknet / MP Mandi Board.
  * Freshness timestamps and transparency badges ("Updated 12 min ago · Official Agmarknet").
* **Smart Slot & Token Engine**:
  * Select crop, estimated quantity, and procurement centre.
  * Dynamic slot availability (`Available`, `Limited`, `Full`, `Closed`).
  * Backend-generated alphanumeric tokens (`BPL-2026-xxxx`, `SEH-2026-xxxx`).
  * Live queue tracker showing current serving token, farmers ahead, and estimated wait.
* **Procurement Consignment Tracker**:
  * 9-stage lifecycle: `REQUESTED` -> `SLOT_BOOKED` -> `ARRIVED` -> `QUALITY_CHECK` -> `ACCEPTED` -> `PROCURED` -> `PAYMENT_PROCESSING` -> `PAID`.
  * Electronic Mandi Weighment Slip generation with printable Form J layout.
* **Sell Today (Aaj Hi Bechein)**:
  * Transparent comparison of standard open market rate vs immediate same-day DBT payout offer for urgent cash needs.
* **3-Year Historical Price Analysis**:
  * Interactive SVG trends covering 2023–2026 with CACP Cost of Cultivation (A2+FL) baseline and peak realization analysis.
* **KisanSetu Saathi AI Assistant**:
  * Context-aware chatbot connected to live APIs for tokens, queue, and market prices, with local bilingual speech support.

### 3.2 Admin Command Console
* **Throughput Dashboard**: Daily intake tonnage, active vehicles in queue, average wait times.
* **Live Queue Manager**: Call Next Farmer button, status update per consignment lane.
* **Centre Operations**: Toggle operating status (`Open`, `Peak Queue`, `Closed`), adjust daily capacity, manage weighbridges.
* **DBT Ledger**: Batch payout processing, NPCI/PFMS tracking, UTR generation.
* **Market Data Sync Monitor**: Real-time health check on external data feeds (Agmarknet, CEDA).

## 4. Non-Functional Requirements
* **Data Integrity**: Never invent coordinates or fabricated mandi names. Grounded in Bhopal & Sehore, MP.
* **Reliability & Offline Gracefulness**: Works smoothly even with network latency; caches non-sensitive data, offers retry mechanisms, and provides fallback SVGs when maps or external APIs are unavailable.
* **Security**: Password hashing with bcrypt, role-based authorization, JWT expiration, CORS policy, zero hardcoded secrets.
