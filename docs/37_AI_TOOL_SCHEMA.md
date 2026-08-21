# AI BankVerse — AI Tool Schema

## 1. Purpose

AI agents interact with banking capabilities through typed tools.

---

# 2. Tool Structure

Every tool must define:

name

description

input schema

output schema

authorization

confirmation requirement

audit event

---

# 3. Account Balance

Tool:

get_account_balance

Input:

accountId

Output:

accountId

availableBalance

currency

timestamp

---

# 4. Transaction History

Tool:

get_transaction_history

Input:

accountId

fromDate

toDate

limit

Output:

transactions[]

---

# 5. Electricity Payment Preparation

Tool:

prepare_electricity_payment

Input:

accountNumber

amount

Output:

paymentId

provider

customerName

amount

currency

status

requiresConfirmation

---

# 6. Electricity Payment Confirmation

Tool:

confirm_electricity_payment

Input:

paymentId

confirmed

Output:

transactionId

status

receiptId

---

# 7. Credit Products

Tool:

get_credit_products

Input:

customerContext

Output:

products[]

---

# 8. Credit Calculation

Tool:

calculate_credit

Input:

productId

amount

term

Output:

monthlyPayment

totalPayment

interest

currency

---

# 9. Deposit Products

Tool:

get_deposit_products

Input:

currency

term

amount

Output:

products[]

---

# 10. Agent Task

Tool:

create_agent_task

Input:

agentId

taskType

description

priority

Output:

taskId

status

---

# 11. Agent Status

Tool:

get_agent_status

Input:

agentId

Output:

status

currentTask

queueLength

workload

---

# 12. Security

Tools must validate authorization server-side.

The AI model cannot decide whether a user has permission.

---

# 13. Tool Failure

Tool failures return structured errors.

Example:

```json
{
  "success": false,
  "errorCode": "SERVICE_UNAVAILABLE",
  "message": "Payment provider unavailable"
}
```

The AI must never convert failure into success.
