# AI BankVerse — Data & API Specification

## User

```json
{
  "id": "user_001",
  "name": "Maruf",
  "preferredLanguage": "uz",
  "voiceEnabled": true
}
```

---

## Agent

```json
{
  "id": "agent_credit_001",
  "name": "Aziza",
  "role": "Credit Specialist",
  "department": "credit",
  "status": "available"
}
```

---

## Task

```json
{
  "id": "task_001",
  "agentId": "agent_credit_001",
  "type": "customer_assistance",
  "priority": "normal",
  "status": "pending"
}
```

---

## Service

```json
{
  "id": "utility_electricity",
  "category": "payment",
  "name": "Electricity Payment",
  "requiresConfirmation": true
}
```

---

## Transaction

```json
{
  "id": "txn_001",
  "type": "utility_payment",
  "amount": 185000,
  "currency": "UZS",
  "status": "completed"
}
```

---

# API Examples

```
GET /api/v1/user/profile

GET /api/v1/accounts

GET /api/v1/transactions

POST /api/v1/payments/utility/prepare

POST /api/v1/payments/utility/confirm

GET /api/v1/credits/products

POST /api/v1/credits/application

POST /api/v1/agents/tasks

GET /api/v1/agents/{id}/status
```

---

# AI Tool

prepare_utility_payment()

Input:

provider
accountNumber
amount

Output:

paymentId
customer
amount
currency
confirmationRequired

---

# Security

Every transaction API must validate:

authentication
authorization
session
request integrity
idempotency
limits
confirmation
audit
