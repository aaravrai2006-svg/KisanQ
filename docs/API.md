# KISANQ / KISANSETU — REST API SPECIFICATION

**Base URL**: `http://localhost:8000/api` (or configured via `NEXT_PUBLIC_API_URL`)  
**Swagger UI**: `http://localhost:8000/docs`  
**ReDoc**: `http://localhost:8000/redoc`

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
Register a new farmer or admin account.
* **Body**:
  ```json
  {
    "full_name": "Ramesh Kumar",
    "phone": "9876543210",
    "email": "ramesh@kisanq.gov.in",
    "password": "securepassword123",
    "role": "FARMER",
    "village": "Karond Khurd",
    "tehsil": "Huzur",
    "district": "Bhopal"
  }
  ```
* **Response (201)**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": "uuid-...",
      "full_name": "Ramesh Kumar",
      "phone": "9876543210",
      "role": "FARMER",
      "farmer_code": "KS-2491"
    }
  }
  ```

### `POST /api/auth/login`
Authenticate with phone/email and password.
* **Body**:
  ```json
  {
    "identifier": "9876543210",
    "password": "securepassword123"
  }
  ```
* **Response (200)**: Token response with user profile.

### `GET /api/auth/me`
Retrieve currently authenticated user profile.
* **Headers**: `Authorization: Bearer <token>`

---

## 2. Procurement Centres (`/api/centres`)

### `GET /api/centres`
List verified procurement centres with optional filters.
* **Query Params**:
  * `district`: `Bhopal` | `Sehore`
  * `status`: `Open` | `Peak Queue` | `Closed`
  * `crop`: `Wheat` | `Soyabean` | `Mustard`
  * `search`: string keyword
* **Response (200)**:
  ```json
  [
    {
      "id": "ctr-karond",
      "code": "BPL-MND-01",
      "name": "Krishi Upaj Mandi Samiti Karond, Bhopal",
      "district": "Bhopal",
      "tehsil": "Huzur",
      "address": "Berasia Road, Karond, Bhopal, MP",
      "latitude": 23.2974,
      "longitude": 77.4046,
      "contact_phone": "+91 755-2735100",
      "manager_name": "Rajesh Sharma",
      "total_capacity_mt": 15000,
      "current_stock_mt": 9200,
      "active_bridges": 4,
      "total_bridges": 4,
      "queue_count": 18,
      "status": "Open",
      "same_day_intake_available": true,
      "source": "MP State Agricultural Marketing Board",
      "verification_status": "VERIFIED",
      "last_verified_at": "2026-09-23T10:00:00Z"
    }
  ]
  ```

---

## 3. Slots & Token Generation (`/api/slots`, `/api/tokens`)

### `GET /api/slots/available`
Find available booking slots for a given centre and date.

### `POST /api/tokens/generate`
Book harvest consignment slot and generate unique token.
* **Body**:
  ```json
  {
    "centre_id": "ctr-karond",
    "crop_id": "crop-wheat",
    "quantity_quintals": 48.5,
    "vehicle_number": "MP-04-AB-1823",
    "slot_id": "slot-01"
  }
  ```
* **Response (201)**:
  ```json
  {
    "token_number": "BPL-2026-1042",
    "centre_name": "Krishi Upaj Mandi Samiti Karond, Bhopal",
    "queue_sequence": 14,
    "farmers_ahead": 13,
    "estimated_wait_minutes": 25,
    "arrival_window": "10:30 AM - 11:30 AM",
    "counter_window": "Window 02",
    "status": "ACTIVE"
  }
  ```

---

## 4. Live Queue Tracker (`/api/queue/{centre_id}`)

### `GET /api/queue/{centre_id}`
Real-time queue analytics and current serving token.
* **Response (200)**:
  ```json
  {
    "centre_id": "ctr-karond",
    "now_serving": "BPL-2026-1038",
    "current_wait_minutes": 20,
    "total_in_queue": 18,
    "active_scales": 3,
    "last_updated": "2026-09-23T10:28:00Z"
  }
  ```

---

## 5. Market Prices (`/api/market-prices`)

### `GET /api/market-prices`
List real-time daily APMC market prices.
* **Query Params**: `district=Bhopal`, `crop=Wheat`
* **Response (200)**:
  ```json
  [
    {
      "crop_name": "Wheat (Sharbati)",
      "market_name": "Karond Mandi, Bhopal",
      "district": "Bhopal",
      "min_price": 2425,
      "max_price": 3100,
      "modal_price": 2780,
      "unit": "₹/Quintal",
      "source": "Agmarknet / MP Mandi Board",
      "price_date": "2026-09-23",
      "is_stale": false,
      "last_updated": "2026-09-23T09:30:00Z"
    }
  ]
  ```

### `GET /api/market-prices/history`
Multi-year price history with CACP cost benchmark.

---

## 6. AI Assistant (`/api/ai/chat`)

### `POST /api/ai/chat`
Ask question to KisanSetu Saathi bot with authenticated context.
* **Body**:
  ```json
  {
    "query": "Bhopal mein wheat ka price kya hai?",
    "language": "hi",
    "current_token": "BPL-2026-1042"
  }
  ```
* **Response (200)**:
  ```json
  {
    "response": "आज करोंद मंडी (भोपाल) में गेहूं का मॉडल भाव ₹2,780/क्विंटल है (न्यूनतम ₹2,425, अधिकतम ₹3,100)। स्रोत: Agmarknet / MP Mandi Board (अद्यतन: 23 सितंबर 2026).",
    "suggestions": ["मेरी कतार स्थिति क्या है?", "आज ही बेचने का विकल्प"],
    "action_link": { "label": "भाव इतिहास देखें", "view": "price-history" }
  }
  ```

---

## 7. Admin Operations (`/api/admin`)

* `POST /api/admin/queue/call-next`: Advance the queue to next waiting token.
* `PATCH /api/admin/centres/{id}/status`: Toggle centre status or capacity.
* `POST /api/admin/payments/approve-batch`: Batch process approved DBT payouts.
* `GET /api/admin/sync-status`: Health and last sync status of external market feeds.
