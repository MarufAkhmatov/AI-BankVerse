> **STATUS: RECONSTRUCTED** — sections 1–7 below were rebuilt from context (endpoint list in
> docs/11_DATA_AND_API_SPECIFICATION.md and the service contract in docs/05). Sections 8–14
> are the original source text.

# AI BankVerse — OpenAPI Specification

## 1. Overview

Base URL: `/api/v1`

All financial POST endpoints require an `Authorization` header and support an
`Idempotency-Key` header (see §13).

---

# 2. Authentication

```
GET  /auth/session
POST /auth/refresh
```

Authentication is external to the AI layer — see docs/49_AUTHENTICATION_AND_AUTHORIZATION.md.

---

# 3. Accounts

```
GET /accounts
GET /accounts/{accountId}
```

---

# 4. Transactions

```
GET /transactions
GET /transactions/{transactionId}
```

---

# 5. Payments — Utility

```
POST /payments/utility/prepare
POST /payments/utility/confirm
```

---

# 6. Cards

```
GET  /cards
POST /cards/{cardId}/block
POST /cards/{cardId}/replace
```

---

# 7. Credit

```
GET  /credits/products
POST /credits/calculate
POST /credits/application
```

---

# 8. Deposits

```
GET  /deposits/products
POST /deposits/calculate
POST /deposits/open
```

---

# 9. AI

```
POST /ai/intent
POST /ai/chat
POST /ai/agent/route
POST /ai/tool/execute
```

---

# 10. Voice

```
POST /voice/transcribe
POST /voice/synthesize
```

---

# 11. Example

POST /payments/utility/prepare

Request:

```json
{
  "provider": "electricity",
  "accountNumber": "45879201",
  "amount": 185000
}
```

Response:

```json
{
  "paymentId": "pay_123",
  "customerName": "Demo Customer",
  "amount": 185000,
  "currency": "UZS",
  "requiresConfirmation": true
}
```

---

# 12. Confirmation

POST /payments/utility/confirm

Request:

```json
{
  "paymentId": "pay_123",
  "confirmation": true
}
```

Response:

```json
{
  "transactionId": "txn_123",
  "status": "SUCCESS"
}
```

---

# 13. Idempotency

Financial POST operations must support:

Idempotency-Key

Duplicate requests must never create duplicate transactions.

---

# 14. Error Format

```json
{
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Insufficient funds",
    "traceId": "TRACE-123"
  }
}
```
