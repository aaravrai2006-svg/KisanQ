# KISANQ / KISANSETU — DATABASE SPECIFICATION

## 1. Relational Entity Relationship Diagram

```text
  [users] 1───1 [farmer_profiles]
     │
     ├───* [procurement_requests] *───1 [procurement_centres]
     │           │                               │
     │           ├───1 [tokens]                  ├───* [slots]
     │           ├───1 [quality_checks]          └───* [procurement_schedules]
     │           └───1 [payments]
     │
     └───* [notifications]

  [crops] 1───* [procurement_requests]
     │
     └───* [market_prices]
```

## 2. Table Schemas

### `users`
* `id` VARCHAR(36) PRIMARY KEY (UUID)
* `full_name` VARCHAR(120) NOT NULL
* `email` VARCHAR(150) UNIQUE NULL
* `phone` VARCHAR(20) UNIQUE NOT NULL
* `role` VARCHAR(30) NOT NULL DEFAULT 'FARMER' (`FARMER`, `CENTRE_OPERATOR`, `ADMIN`, `SUPER_ADMIN`)
* `hashed_password` VARCHAR(255) NOT NULL
* `is_active` BOOLEAN DEFAULT TRUE
* `created_at` DATETIME NOT NULL
* `updated_at` DATETIME NOT NULL

### `farmer_profiles`
* `id` VARCHAR(36) PRIMARY KEY
* `user_id` VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE
* `farmer_code` VARCHAR(30) UNIQUE NOT NULL (e.g. `KS-2491`)
* `village` VARCHAR(100) NOT NULL
* `tehsil` VARCHAR(100) NOT NULL
* `district` VARCHAR(80) NOT NULL (e.g. `Bhopal`, `Sehore`)
* `state` VARCHAR(80) NOT NULL DEFAULT 'Madhya Pradesh'
* `total_land_acres` FLOAT DEFAULT 0.0
* `bank_name` VARCHAR(100) NOT NULL
* `bank_account_mask` VARCHAR(30) NOT NULL
* `ifsc_code` VARCHAR(20) NOT NULL
* `preferred_language` VARCHAR(10) DEFAULT 'hi'
* `created_at` DATETIME NOT NULL

### `crops`
* `id` VARCHAR(36) PRIMARY KEY
* `code` VARCHAR(30) UNIQUE NOT NULL (e.g. `crop-wheat`, `crop-soyabean`)
* `name_en` VARCHAR(100) NOT NULL
* `name_hi` VARCHAR(100) NOT NULL
* `category` VARCHAR(30) NOT NULL (`Rabi`, `Kharif`, `Zaid`)
* `msp_rate` FLOAT NOT NULL
* `unit` VARCHAR(20) DEFAULT 'Quintal'
* `moisture_limit_pct` FLOAT NOT NULL DEFAULT 12.0
* `created_at` DATETIME NOT NULL

### `procurement_centres`
* `id` VARCHAR(36) PRIMARY KEY
* `code` VARCHAR(30) UNIQUE NOT NULL (e.g. `BPL-MND-01`, `SEH-MND-01`)
* `name` VARCHAR(150) NOT NULL
* `district` VARCHAR(80) NOT NULL
* `tehsil` VARCHAR(100) NOT NULL
* `address` TEXT NOT NULL
* `latitude` FLOAT NOT NULL
* `longitude` FLOAT NOT NULL
* `contact_phone` VARCHAR(30) NOT NULL
* `manager_name` VARCHAR(100) NOT NULL
* `total_capacity_mt` INT NOT NULL
* `current_stock_mt` INT NOT NULL DEFAULT 0
* `today_intake_mt` INT NOT NULL DEFAULT 0
* `active_bridges` INT NOT NULL DEFAULT 2
* `total_bridges` INT NOT NULL DEFAULT 3
* `queue_count` INT NOT NULL DEFAULT 0
* `status` VARCHAR(30) DEFAULT 'Open' (`Open`, `Peak Queue`, `Closed`)
* `same_day_intake_available` BOOLEAN DEFAULT TRUE
* `source` VARCHAR(100) NOT NULL DEFAULT 'MP Mandi Board'
* `source_url` VARCHAR(255) NULL
* `verification_status` VARCHAR(30) NOT NULL DEFAULT 'VERIFIED'
* `last_verified_at` DATETIME NOT NULL

### `slots`
* `id` VARCHAR(36) PRIMARY KEY
* `centre_id` VARCHAR(36) NOT NULL REFERENCES procurement_centres(id)
* `slot_date` DATE NOT NULL
* `time_window` VARCHAR(50) NOT NULL (e.g. `09:00 AM - 11:00 AM`)
* `capacity_quintals` FLOAT NOT NULL
* `booked_quintals` FLOAT NOT NULL DEFAULT 0.0
* `status` VARCHAR(30) DEFAULT 'AVAILABLE' (`AVAILABLE`, `LIMITED`, `FULL`, `CLOSED`)

### `procurement_requests`
* `id` VARCHAR(36) PRIMARY KEY
* `farmer_id` VARCHAR(36) NOT NULL REFERENCES users(id)
* `crop_id` VARCHAR(36) NOT NULL REFERENCES crops(id)
* `centre_id` VARCHAR(36) NOT NULL REFERENCES procurement_centres(id)
* `slot_id` VARCHAR(36) NULL REFERENCES slots(id)
* `quantity_quintals` FLOAT NOT NULL
* `vehicle_number` VARCHAR(30) NOT NULL
* `gross_weight_kg` FLOAT NULL
* `tare_weight_kg` FLOAT NULL
* `net_weight_quintals` FLOAT NULL
* `status` VARCHAR(40) NOT NULL DEFAULT 'REQUESTED'
* `created_at` DATETIME NOT NULL
* `updated_at` DATETIME NOT NULL

### `tokens`
* `id` VARCHAR(36) PRIMARY KEY
* `token_number` VARCHAR(30) UNIQUE NOT NULL (e.g. `BPL-2026-1042`)
* `request_id` VARCHAR(36) NOT NULL REFERENCES procurement_requests(id)
* `centre_id` VARCHAR(36) NOT NULL REFERENCES procurement_centres(id)
* `farmer_id` VARCHAR(36) NOT NULL REFERENCES users(id)
* `counter_window` VARCHAR(50) DEFAULT 'Window 01'
* `queue_sequence` INT NOT NULL
* `status` VARCHAR(30) DEFAULT 'ACTIVE' (`ACTIVE`, `SERVING`, `COMPLETED`, `CANCELLED`)
* `issued_at` DATETIME NOT NULL
* `served_at` DATETIME NULL

### `quality_checks`
* `id` VARCHAR(36) PRIMARY KEY
* `request_id` VARCHAR(36) NOT NULL REFERENCES procurement_requests(id)
* `moisture_pct` FLOAT NOT NULL
* `foreign_matter_pct` FLOAT NOT NULL
* `grade` VARCHAR(30) NOT NULL (`Grade A`, `Grade B`, `FAQ`)
* `verified_by` VARCHAR(100) NOT NULL
* `passed` BOOLEAN NOT NULL DEFAULT TRUE
* `notes` TEXT NULL
* `inspected_at` DATETIME NOT NULL

### `payments`
* `id` VARCHAR(36) PRIMARY KEY
* `dbt_ref` VARCHAR(50) UNIQUE NOT NULL (e.g. `DBT-2026-MP-0914`)
* `request_id` VARCHAR(36) NOT NULL REFERENCES procurement_requests(id)
* `farmer_id` VARCHAR(36) NOT NULL REFERENCES users(id)
* `crop_name` VARCHAR(100) NOT NULL
* `quintals` FLOAT NOT NULL
* `msp_rate` FLOAT NOT NULL
* `gross_amount` FLOAT NOT NULL
* `net_amount` FLOAT NOT NULL
* `bank_name` VARCHAR(100) NOT NULL
* `account_mask` VARCHAR(30) NOT NULL
* `ifsc` VARCHAR(20) NOT NULL
* `status` VARCHAR(30) NOT NULL DEFAULT 'PROCESSING' (`PENDING`, `PROCESSING`, `DISBURSED`, `FLAGGED`)
* `utr_number` VARCHAR(50) NULL
* `initiated_at` DATETIME NOT NULL
* `completed_at` DATETIME NULL
* `is_simulated` BOOLEAN DEFAULT TRUE

### `market_prices`
* `id` VARCHAR(36) PRIMARY KEY
* `crop_id` VARCHAR(36) NOT NULL REFERENCES crops(id)
* `crop_name` VARCHAR(100) NOT NULL
* `market_name` VARCHAR(100) NOT NULL
* `district` VARCHAR(80) NOT NULL
* `state` VARCHAR(80) NOT NULL DEFAULT 'Madhya Pradesh'
* `min_price` FLOAT NOT NULL
* `max_price` FLOAT NOT NULL
* `modal_price` FLOAT NOT NULL
* `unit` VARCHAR(20) DEFAULT '₹/Quintal'
* `price_date` DATE NOT NULL
* `source` VARCHAR(100) NOT NULL DEFAULT 'Agmarknet'
* `source_url` VARCHAR(255) NULL
* `is_stale` BOOLEAN DEFAULT FALSE
* `created_at` DATETIME NOT NULL

### `notifications`
* `id` VARCHAR(36) PRIMARY KEY
* `user_id` VARCHAR(36) NOT NULL REFERENCES users(id)
* `title` VARCHAR(150) NOT NULL
* `message` TEXT NOT NULL
* `category` VARCHAR(50) NOT NULL DEFAULT 'queue' (`queue`, `payment`, `market`, `centre`)
* `is_read` BOOLEAN DEFAULT FALSE
* `created_at` DATETIME NOT NULL

### `audit_logs`
* `id` VARCHAR(36) PRIMARY KEY
* `user_id` VARCHAR(36) NULL
* `action` VARCHAR(100) NOT NULL
* `resource_type` VARCHAR(50) NOT NULL
* `resource_id` VARCHAR(50) NULL
* `details` TEXT NULL
* `ip_address` VARCHAR(50) NULL
* `created_at` DATETIME NOT NULL
