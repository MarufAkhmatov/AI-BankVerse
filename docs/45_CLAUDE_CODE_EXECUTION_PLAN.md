# AI BankVerse — Claude Code Execution Plan

## IMPORTANT

Do not attempt to build all systems simultaneously.

Build vertically.

---

# STAGE 0 — REPOSITORY AUDIT

Claude Code must:

1. inspect repository
2. identify Unreal version
3. inspect existing files
4. inspect plugins
5. inspect source
6. inspect content
7. identify missing systems

Output:

AUDIT.md

---

# STAGE 1 — PROJECT FOUNDATION

Implement:

- project settings
- modules
- base GameInstance
- subsystems
- configuration
- logging

Acceptance:

Project compiles.

---

# STAGE 2 — PLAYER

Implement:

- PlayerCharacter
- camera
- Enhanced Input
- movement
- interaction

Acceptance:

Player can walk around a test environment.

---

# STAGE 3 — BANK LOBBY

Implement:

- entrance
- reception
- waiting area
- one department
- lighting
- navigation

Acceptance:

The environment visually reads as a modern bank.

---

# STAGE 4 — RECEPTION AGENT

Implement:

- human character
- idle animation
- work animation
- attention
- interaction
- conversation

Acceptance:

Player approaches receptionist.

Reception looks at player.

Reception greets player.

---

# STAGE 5 — VOICE

Implement:

Microphone

STT

AI Provider

TTS

Conversation

Acceptance:

Player can say:

"Salom."

Reception responds.

---

# STAGE 6 — INTENT

Implement:

intent detection

agent routing

context

Acceptance:

"Elektr energiyasiga to'lov qilmoqchiman."

→ UTILITY_PAYMENT

---

# STAGE 7 — PAYMENT

Implement:

PaymentAgent

MockBankingProvider

Payment UI

Confirmation

Transaction

Receipt

Acceptance:

Complete electricity payment from voice.

---

# STAGE 8 — CUSTOMER NPC

Implement:

NPC spawning

navigation

reception

queue

service

exit

Acceptance:

Bank contains autonomous customers.

---

# STAGE 9 — SECOND AGENT

Implement:

CreditAgent.

Acceptance:

User can ask:

"Kredit haqida ma'lumot ber."

System routes to CreditAgent.

---

# STAGE 10 — AGENT MANAGEMENT

Implement:

agent status

tasks

workload

manager commands

Acceptance:

Player can tell an agent:

"Bugun kredit navbatiga e'tibor ber."

Agent accepts task.

---

# STAGE 11 — VISUAL QUALITY

Upgrade:

characters

materials

lighting

animation

facial

audio

environment

---

# STAGE 12 — PERFORMANCE

Test:

10 NPC

25 NPC

50 NPC

100 NPC

---

# STAGE 13 — POLISH

Add:

ambient sound

micro animations

camera polish

UI transitions

voice interruption

error handling

---

# STAGE 14 — PRODUCTION ADAPTERS

Replace:

MockAI

MockVoice

MockBanking

with production adapters.

---

# FINAL VERTICAL SLICE

The following must work:

```
PLAYER ENTERS BANK

↓

RECEPTION GREETS

↓

PLAYER SPEAKS

↓

AI UNDERSTANDS

↓

AGENT ROUTES

↓

SERVICE UI OPENS

↓

USER CONFIRMS

↓

BANKING BACKEND EXECUTES

↓

AI SPEAKS RESULT

↓

CHARACTER ANIMATES

↓

RECEIPT DISPLAYED

↓

PLAYER REMAINS IN 3D BANK
```

This is the definition of MVP success.
