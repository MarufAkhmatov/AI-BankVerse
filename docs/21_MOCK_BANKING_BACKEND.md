# AI BankVerse — Mock Banking Backend

## Purpose

The prototype must work without a real bank core system.

---

# 1. Services

AccountService

PaymentService

CardService

CreditService

DepositService

TransactionService

CustomerService

---

# 2. Demo User

Use a fictional customer.

Never use real financial data.

Example:

Customer:

Demo Customer

Account:

8600 XXXX XXXX 1234

Balance:

25,000,000 UZS

---

# 3. Utility Payment

Providers:

Electricity

Gas

Water

Internet

Mobile

---

# 4. Payment Flow

```
preparePayment()

↓

validate()

↓

showCustomer()

↓

showAmount()

↓

confirmation

↓

executePayment()

↓

transactionResult
```

---

# 5. Simulated Latency

Backend should simulate realistic latency.

Example:

200–800ms

This allows the UX to be tested under realistic conditions.

---

# 6. Failure Simulation

The backend should support controlled failures.

Examples:

INSUFFICIENT_FUNDS

INVALID_ACCOUNT

SERVICE_UNAVAILABLE

TIMEOUT

UNKNOWN_ERROR

---

# 7. Transaction ID

Every successful transaction receives:

TXN-{timestamp}-{random}

---

# 8. Audit

Every operation creates an audit event.

Example:

```json
{
  "event": "PAYMENT_COMPLETED",
  "transactionId": "TXN-...",
  "timestamp": "...",
  "userId": "demo-user"
}
```

---

# 9. Production Boundary

MockBankingBackend must implement the same interfaces as the future production backend.

The Unreal client must not know whether it is using:

Mock

or

Production.
