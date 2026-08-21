# AI BankVerse — Runtime AI Provider Architecture

## 1. Critical Architecture

Development AI and Runtime AI are separate.

Claude Code:

Developer tool

Runtime AI:

Bank product capability

---

# 2. Runtime Provider Interface

IBVAIProvider

Methods:

ProcessConversation()

DetectIntent()

GenerateResponse()

GenerateStructuredAction()

---

# 3. MVP Provider

MockAIProvider

The MVP must work without external AI API credentials.

---

# 4. Production Provider

Production AI can be connected later.

The provider must be replaceable.

---

# 5. Provider Selection

Configuration:

AI_PROVIDER=mock

Possible future values:

mock

openai

anthropic

google

local

enterprise_gateway

---

# 6. No Provider-Specific Business Logic

Incorrect:

```
if anthropic:
    executePayment()
```

Correct:

```
AI intent

→ domain action

→ authorized tool

→ banking service
```

---

# 7. Offline Development

The following must work without internet:

- player movement
- bank environment
- NPC simulation
- animation
- UI
- mock conversations
- mock banking
- test transactions

External AI is optional for development.

---

# 8. AI Failure

If runtime AI is unavailable:

Bank remains usable.

User can use:

visual navigation

service menu

manual forms

traditional interaction

---

# 9. Product Principle

AI enhances the bank.

AI must not become the single point of failure for the bank.
