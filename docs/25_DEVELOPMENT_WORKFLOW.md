# AI BankVerse — Development Workflow

## 1. Golden Rule

Build the experience incrementally.

Do NOT attempt to generate the complete game in one operation.

---

# Phase 1

Technical foundation.

Deliver:

- Unreal project
- Git repository
- C++ architecture
- basic third-person character
- input
- camera

---

# Phase 2

Environment.

Deliver:

- bank exterior
- entrance
- lobby
- reception
- waiting area
- one department

---

# Phase 3

Characters.

Deliver:

- player
- receptionist
- one banking agent
- customer NPC

---

# Phase 4

Interaction.

Deliver:

- interactable interface
- proximity interaction
- conversation state
- character attention

---

# Phase 5

Voice.

Deliver:

```
Microphone

→ STT

→ AI

→ TTS
```

---

# Phase 6

Banking.

Deliver:

Balance

Transactions

Electricity Payment

---

# Phase 7

AI Employees.

Deliver:

Reception Agent

Payment Agent

Credit Agent

Deposit Agent

---

# Phase 8

Living Bank.

Deliver:

NPC simulation

Queues

Agent workload

Ambient behavior

---

# Phase 9

Visual Polish.

Deliver:

High-quality materials

Lighting

Character quality

Animation

Facial animation

Audio

---

# Phase 10

Optimization.

Deliver:

LOD

NPC optimization

CPU optimization

GPU optimization

Memory optimization

---

# Phase 11

Production Architecture.

Replace:

MockAIProvider

with

ProductionAIProvider

Replace:

MockBankingProvider

with

ProductionBankingProvider

Replace:

MockVoiceProvider

with

ProductionVoiceProvider

---

# Rule for Claude Code

After each phase:

1. Compile.
2. Run.
3. Test.
4. Fix.
5. Document.
6. Commit.

Never move to the next phase with broken compilation.
