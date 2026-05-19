# Design Document: Petify Marketplace

## Overview

Petify is a pet marketplace with a React frontend and a PHP (no framework) backend API. The frontend is a Vite + React SPA. The backend is a set of plain PHP scripts that expose a REST JSON API, backed by a MySQL database. Communication between frontend and backend is via `fetch()` calls to the PHP API.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              React SPA (Vite + React)                │
│  pages/  │  components/  │  hooks/  │  api/         │
└────────────────────────┬────────────────────────────┘
                         │ HTTP JSON (fetch)
┌────────────────────────▼────────────────────────────┐
│           PHP REST API (no framework)                │
│  api/auth/  │  api/listings/  │  api/orders/        │
└────────────────────────┬────────────────────────────┘
                         │ PDO / MySQLi
┌────────────────────────▼────────────────────────────┐
│                   MySQL Database                     │
│  users  │  listings  │  orders  │  sessions         │
└─────────────────────────────────────────────────────┘
```

### Directory Structure

```
petify/
├── frontend/                  # React (Vite) SPA
│   ├── src/
│   │   ├── api/               # fetch wrappers for each PHP endpoint
│   │   ├── components/        # shared UI components (Navbar, ListingCard, etc.)
│   │   ├── pages/             # route-level components
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── PetDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── OrderHistory.jsx
│   │   ├── context/           # AuthContext (session state)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
└── backend/                   # PHP API
    ├── config/
    │   └── db.php             # PDO connection
    ├── api/
    │   ├── auth/
    │   │   ├── register.php
    │   │   ├── login.php
    │   │   └── logout.php
    │   ├── listings/
    │   │   ├── index.php      # GET all / POST create
    │   │   └── [id].php       # GET one / PUT update / DELETE
    │   └── orders/
    │       ├── index.php      # POST create / GET by buyer
    │       └── seller.php     # GET by seller
    ├── middleware/
    │   └── auth.php           # session/token check helper
    └── utils/
        └── response.php       # json_response() helper
```

---

## Data Models

### MySQL Schema

```sql
CREATE TABLE users (
  id         CHAR(36) PRIMARY KEY,
  full_name  VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,  -- bcrypt hash
  role       ENUM('buyer','seller') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listings (
  id          CHAR(36) PRIMARY KEY,
  seller_id   CHAR(36) NOT NULL REFERENCES users(id),
  name        VARCHAR(255) NOT NULL,
  species     VARCHAR(100) NOT NULL,
  breed       VARCHAR(100) NOT NULL,
  age_months  INT NOT NULL,
  price_usd   DECIMAL(10,2) NOT NULL,
  description TEXT,
  photo_url   VARCHAR(500),
  status      ENUM('active','sold','deleted') DEFAULT 'active',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id          CHAR(36) PRIMARY KEY,
  buyer_id    CHAR(36) NOT NULL REFERENCES users(id),
  seller_id   CHAR(36) NOT NULL REFERENCES users(id),
  listing_id  CHAR(36) NOT NULL REFERENCES listings(id),
  pet_name    VARCHAR(255) NOT NULL,
  price_usd   DECIMAL(10,2) NOT NULL,
  status      ENUM('confirmed','cancelled') DEFAULT 'confirmed',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register.php` | Register new user |
| POST | `/api/auth/login.php` | Login, start PHP session |
| POST | `/api/auth/logout.php` | Destroy session |
| GET | `/api/listings/index.php` | Get listings (supports `?search=&species=&min_price=&max_price=`) |
| POST | `/api/listings/index.php` | Create listing (seller only) |
| GET | `/api/listings/[id].php?id=` | Get single listing |
| PUT | `/api/listings/[id].php?id=` | Update listing (owner only) |
| DELETE | `/api/listings/[id].php?id=` | Delete listing (owner only) |
| POST | `/api/orders/index.php` | Create order + mock payment |
| GET | `/api/orders/index.php` | Get buyer's orders |
| GET | `/api/orders/seller.php` | Get seller's orders |

All endpoints return `Content-Type: application/json`. Auth is via PHP sessions (`session_start()`).

---

## Frontend API Layer (`src/api/`)

```js
// auth.js
export const register(data)   // POST /api/auth/register.php
export const login(data)       // POST /api/auth/login.php
export const logout()          // POST /api/auth/logout.php

// listings.js
export const getListings(filters)      // GET /api/listings/index.php
export const getListing(id)            // GET /api/listings/[id].php
export const createListing(data)       // POST /api/listings/index.php
export const updateListing(id, data)   // PUT /api/listings/[id].php
export const deleteListing(id)         // DELETE /api/listings/[id].php

// orders.js
export const createOrder(listingId)    // POST /api/orders/index.php
export const getBuyerOrders()          // GET /api/orders/index.php
export const getSellerOrders()         // GET /api/orders/seller.php
```

---

## Auth Flow

- PHP sessions: `session_start()` on every protected endpoint
- `$_SESSION['user_id']` and `$_SESSION['role']` set on login
- Frontend stores current user in React `AuthContext` (populated from a `/api/auth/me.php` call on app load)
- Protected React routes redirect to `/login` if `AuthContext.user` is null

---

## Correctness Properties

### Property 1: Registration round-trip
Register with valid data → login with same credentials → response contains matching userId.
**Validates: Req 1.2, 2.2**

### Property 2: Duplicate email rejection
Register same email twice → second call returns HTTP 409 and user count unchanged.
**Validates: Req 1.3**

### Property 3: Invalid registration input rejection
Password < 8 chars or malformed email → register returns HTTP 422, no user created.
**Validates: Req 1.4, 1.5**

### Property 4: Invalid credentials rejection
Login with wrong password → HTTP 401, no session created.
**Validates: Req 2.3**

### Property 5: Listing creation round-trip
POST valid listing → GET listing by id → fields match submitted payload.
**Validates: Req 3.3**

### Property 6: Listing ownership enforcement
Attempt PUT/DELETE on listing owned by another seller → HTTP 403, listing unchanged.
**Validates: Req 4.4**

### Property 7: Filter correctness (search and species)
GET listings with search/species filter → every result matches filter, no qualifying listing omitted.
**Validates: Req 5.2, 5.3**

### Property 8: Price filter correctness
GET listings with min/max price → every result within range, none omitted.
**Validates: Req 5.4**

### Property 9: Order creation atomically marks listing sold
POST order (success) → order status "confirmed" + listing status "sold"; payment failure → no order + listing still "active".
**Validates: Req 7.3, 7.4**

### Property 10: Order history completeness
Create N orders → GET buyer/seller orders → all N present with correct fields.
**Validates: Req 8.1, 8.2**

---

## Error Handling

| Scenario | HTTP Status | Response |
|---|---|---|
| Duplicate email on register | 409 | `{ error: "Email already in use" }` |
| Invalid input on register | 422 | `{ errors: { field: "message" } }` |
| Wrong credentials on login | 401 | `{ error: "Invalid email or password" }` |
| Unauthenticated request | 401 | `{ error: "Unauthenticated" }` |
| Unauthorized listing edit/delete | 403 | `{ error: "Forbidden" }` |
| Listing not found | 404 | `{ error: "Not found" }` |
| Payment failure (mock) | 200 | `{ ok: false, error: "Payment failed" }` |
| Validation error on listing | 422 | `{ errors: { field: "message" } }` |
