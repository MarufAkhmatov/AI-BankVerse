# AI BankVerse — AI Agent System

## 1. Architecture

The bank operates as a Multi-Agent System.

Main agents:

1. Reception Agent
2. Customer Service Agent
3. Credit Agent
4. Deposit Agent
5. Payment Agent
6. Card Agent
7. FX Agent
8. Support Agent
9. Risk Agent
10. Manager Agent

---

## 2. Reception Agent

Reception is the orchestration agent.

Responsibilities:

- detect user intent
- classify request
- select appropriate agent
- open UI
- provide response
- maintain conversation context

Example:

User:
"Kredit kerak."

Reception:

Intent:
CREDIT_REQUEST

Route:

Credit Agent

---

## 3. Credit Agent

Capabilities:

- credit products
- eligibility
- payment calculation
- application
- required documents
- status tracking

---

## 4. Deposit Agent

Capabilities:

- deposit products
- interest rates
- term comparison
- maturity calculation
- account opening

---

## 5. Payment Agent

Capabilities:

- utility payments
- mobile payments
- internet
- taxes
- government services
- merchant payments

---

## 6. Agent State

Every agent has:

ID
Name
Role
Department
Position
Availability
CurrentCustomer
CurrentTask
QueueLength
Workload
Personality
Voice
KnowledgeDomain

---

## 7. Agent Memory

Agent memory is separated into:

SHORT_TERM_CONTEXT

CURRENT_CONVERSATION

TASK_MEMORY

USER_CONTEXT

LONG_TERM_BUSINESS_KNOWLEDGE

Sensitive financial information must not be stored unnecessarily.

---

## 8. Tool Calling

AI must not directly execute arbitrary financial operations.

AI calls controlled tools.

Example:

AI:

"Elektr energiyasi uchun to'lovni tayyorlayman."

Tool:

getUtilityAccount()

Tool:

calculatePayment()

Tool:

createPaymentIntent()

User confirmation required.

Tool:

executePayment()

---

## 9. Human Confirmation

Financially sensitive operations require explicit confirmation.

Example:

"Hisobingizdan 185,000 UZS yechiladi. To'lovni tasdiqlaysizmi?"

User:

"Ha."

Only then execute.

---

## 10. Agent-to-Agent Communication

Example:

Reception Agent
→ Credit Agent
→ Risk Agent
→ Customer Service Agent

Every communication must be structured.

Example:

```json
{
  "task_id": "...",
  "source_agent": "reception",
  "target_agent": "credit",
  "intent": "loan_application",
  "priority": "normal"
}
```

---

## 11. Agent Personality

Personality must affect:

- tone
- speed
- wording
- gestures

But personality must never affect:

- financial calculation
- eligibility rules
- compliance
- security
- transaction execution

---

## 12. Agent Failure

If agent fails:

1. Explain briefly.
2. Do not fabricate result.
3. Retry if safe.
4. Escalate if necessary.

Example:

"Ma'lumotni olishda texnik muammo yuz berdi. Sizni operatorga ulayman."

---

## 13. AI Golden Rule

AI may recommend.

AI may explain.

AI may prepare.

AI may execute only through authorized banking tools and after required confirmation.
