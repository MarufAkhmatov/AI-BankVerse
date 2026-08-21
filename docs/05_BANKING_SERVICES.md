# AI BankVerse — Banking Service Model

## Phase 1

### Accounts

- balance
- account details
- transaction history

### Payments

- electricity
- gas
- water
- internet
- mobile
- taxes

### Transfers

- internal transfer
- card-to-card
- bank transfer

### Cards

- card information
- card status
- block/unblock
- replacement request

### Deposits

- available deposits
- rate
- maturity
- opening

### Credit

- loan calculator
- product comparison
- eligibility
- application

---

## Phase 2

- mortgage
- business banking
- FX
- investment
- insurance
- premium banking

---

## Service Contract

Every banking service must expose:

SERVICE_ID

NAME

DESCRIPTION

INPUT_SCHEMA

VALIDATION_RULES

AUTHORIZATION_REQUIREMENTS

CONFIRMATION_REQUIREMENTS

EXECUTION_API

RESULT_SCHEMA

ERROR_SCHEMA

AUDIT_EVENT

---

## Example: Electricity Payment

Input:

accountNumber
amount

Validation:

accountNumber required
amount > 0

Flow:

1. Validate account
2. Retrieve bill
3. Show customer
4. Show amount
5. Ask confirmation
6. Execute
7. Generate receipt
8. Store audit event

---

## Receipt

Receipt contains:

transactionId
date
time
service
provider
amount
status

The receipt must be accessible from the contextual UI.
