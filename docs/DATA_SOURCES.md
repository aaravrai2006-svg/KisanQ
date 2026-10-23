# KISANQ / KISANSETU — DATA SOURCES & TRANSPARENCY SPECIFICATION

## 1. Overview
KisanQ adheres to a strict data transparency doctrine: **No fabricated mandi locations, fake government data, or ungrounded commodity prices.** Every dataset displayed on the frontend carries source attribution, last-verified timestamps, and verification status.

## 2. Procurement Centres & Mandis (Bhopal & Sehore, MP)

| Centre Name | District | Category | Source Agency | Verification |
| :--- | :--- | :--- | :--- | :--- |
| **Karond Mandi, Bhopal** | Bhopal | Principal APMC Yard | MP State Agricultural Marketing Board | `VERIFIED` |
| **Berasia Mandi, Bhopal** | Bhopal | Sub-Division Mandi | MP State Agricultural Marketing Board | `VERIFIED` |
| **Fanda Silo Depot, Bhopal** | Bhopal | Bulk Steel Silo | MPSCSC / FCI | `VERIFIED` |
| **Nazirabad PACS Centre** | Bhopal | Cooperative Society | MP e-Uparjan Portal | `VERIFIED` |
| **Sehore Mandi (Shyampur Rd)** | Sehore | Principal APMC Yard | MP State Agricultural Marketing Board | `VERIFIED` |
| **Ashta Mandi, Sehore** | Sehore | Major APMC Yard | MP State Agricultural Marketing Board | `VERIFIED` |
| **Ichhawar Mandi, Sehore** | Sehore | Sub-Division Mandi | MP State Agricultural Marketing Board | `VERIFIED` |
| **Bhairunda / Nasrullaganj** | Sehore | Regional APMC Yard | MP State Agricultural Marketing Board | `VERIFIED` |
| **Shyampur Mandi, Sehore** | Sehore | Regional APMC Yard | MP State Agricultural Marketing Board | `VERIFIED` |
| **Jawar Sub-Yard, Sehore** | Sehore | Sub-Division Mandi | MP State Agricultural Marketing Board | `VERIFIED` |

## 3. Real-Time Market Price Providers

### Provider 1: Open Government Data (OGD) / Agmarknet API
* **Base URL**: `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070`
* **Protocol**: HTTPS GET
* **Auth**: API Key query parameter (`api-key=...`)
* **Coverage**: Daily APMC arrivals and minimum, maximum, modal prices across India.
* **Format**: JSON / CSV.

### Provider 2: CEDA (Centre for Economic Data and Analysis) Agmarknet API
* **Base URL**: `https://api.ceda.ashoka.edu.in/v1/agmarknet`
* **Protocol**: HTTPS GET / POST
* **Documentation**: `https://api.ceda.ashoka.edu.in/v1`
* **Coverage**: Structured daily and monthly mandi prices for commodities.

### Provider 3: Verified Historical & Seasonal Baseline Provider
* **Source**: CACP (Commission for Agricultural Costs and Prices) Price Policy Reports & Agmarknet seasonal records.
* **Role**: Provides comprehensive 3-year historical trends (2023–2026), cost of cultivation (Cost A2+FL), and seasonal peak selling analysis.
* **Attribution**: "Source: CACP & Agmarknet Historical Benchmark".

## 4. Staleness & Degraded Network Policy
* **Live Status**: If an API record was refreshed within the last 6 hours, it displays a green `● LIVE` badge.
* **Delayed Status**: If the latest available record is older than 6 hours (e.g. mandi closed on weekends, or network outage), it displays an amber tag: `⚠ Data may be delayed · Last verified: [Date/Time]`.
* **Demo Flag**: In local or demonstration environments, any mock or simulated records are explicitly marked with `[DEMO / SIMULATED]`.
