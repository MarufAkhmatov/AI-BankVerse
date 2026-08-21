# AI BankVerse — AI Orchestration Architecture

## 1. Purpose

AI Orchestrator is the central intelligence layer connecting:

```
User
→ Voice
→ Intent
→ AI Agent
→ Banking Tools
→ UI
→ Result
```

The orchestrator must NOT contain banking business rules.

---

# 2. Request Lifecycle

```
USER SPEECH

↓

Speech-to-Text

↓

Conversation Manager

↓

Intent Detection

↓

Context Resolver

↓

Agent Router

↓

Selected AI Agent

↓

Tool Selection

↓

Authorization Check

↓

Banking Service

↓

Result

↓

Response Generator

↓

Text-to-Speech

↓

Character Animation
```

---

# 3. Intent Model

Every user request must be transformed into a structured intent.

Example:

```json
{
  "intent": "UTILITY_PAYMENT",
  "service": "ELECTRICITY",
  "confidence": 0.97,
  "requires_confirmation": true
}
```

---

# 4. Intent Categories

ACCOUNT_BALANCE

TRANSACTION_HISTORY

UTILITY_PAYMENT

CARD_SERVICE

CARD_BLOCK

CARD_REPLACEMENT

CREDIT_INFORMATION

CREDIT_APPLICATION

DEPOSIT_INFORMATION

DEPOSIT_OPENING

TRANSFER

FX

CUSTOMER_SUPPORT

HUMAN_ESCALATION

UNKNOWN

---

# 5. Agent Router

The router selects the appropriate agent.

Example:

```
UTILITY_PAYMENT
→ PaymentAgent

CREDIT_APPLICATION
→ CreditAgent

DEPOSIT_INFORMATION
→ DepositAgent

CARD_BLOCK
→ CardAgent

UNKNOWN
→ ReceptionAgent
```

---

# 6. Context

The AI must understand conversation context.

Example:

User:

"Kredit olmoqchiman."

Agent:

"Qancha miqdorda kredit kerak?"

User:

"50 million."

The second request must inherit:

intent = CREDIT_APPLICATION

---

# 7. Conversation State

Possible states:

IDLE

LISTENING

THINKING

ROUTING

PROCESSING

WAITING_CONFIRMATION

EXECUTING

COMPLETED

FAILED

ESCALATED

---

# 8. Confirmation Policy

Low-risk:

Information lookup
→ no confirmation

Medium-risk:

Prepare application
→ confirmation may be required

High-risk:

Financial transaction
→ explicit confirmation required

---

# 9. Hallucination Protection

AI must never invent:

- account balances
- interest rates
- transaction IDs
- payment status
- eligibility
- customer information

If backend does not provide information:

AI must say that information is unavailable.

---

# 10. Agent Response

Every agent response should contain:

text
emotion
animation
next_action

Example:

```json
{
  "text": "To'lov tayyor.",
  "emotion": "professional_positive",
  "animation": "confirm_gesture",
  "next_action": "OPEN_PAYMENT_CONFIRMATION"
}
```

---

# 11. Agent Handoff

Example:

Reception:

"Bu masalani kredit mutaxassisimiz ko'rib chiqadi."

↓

CreditAgent becomes active.

CreditAgent:

"Assalomu alaykum. Kredit bo'yicha yordam beraman."

The transition must feel continuous.

---

# 12. Timeout

If AI response exceeds acceptable latency:

show subtle loading state.

Do not freeze the player.

Player can continue observing the environment.

---

# 13. Failure Recovery

If AI fails:

1. Retry safely.
2. Preserve conversation context.
3. Explain failure.
4. Offer alternative.
5. Escalate when necessary.

---

# 14. AI Provider Abstraction

Interface:

IAIProvider

Methods:

GenerateResponse()
ClassifyIntent()
GenerateStructuredOutput()
StreamResponse()

Implementations:

MockAIProvider

OpenAIProvider

AnthropicProvider

LocalAIProvider

---

# 15. Prompt Architecture

Prompts must be externalized.

Do NOT hardcode long prompts inside gameplay classes.

Structure:

```
/ai/prompts/

reception.system.md

credit.system.md

payment.system.md

deposit.system.md

support.system.md
```

---

# 16. Tool Calling

Tools must be strongly typed.

Example:

prepareElectricityPayment()

Inputs:

accountNumber
amount

Outputs:

paymentId
customerName
amount
currency
status

---

# 17. AI Safety Boundary

AI decides:

WHAT THE USER WANTS

Backend decides:

WHAT THE USER IS ALLOWED TO DO

Backend decides:

WHAT ACTUALLY HAPPENED
