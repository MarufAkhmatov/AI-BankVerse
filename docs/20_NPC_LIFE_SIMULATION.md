# AI BankVerse — NPC Life Simulation

## 1. Objective

The bank must feel alive even when the player is not interacting.

---

# 2. Customer Lifecycle

```
SPAWN

↓

ENTER

↓

LOOK_AROUND

↓

RECEPTION

↓

SERVICE_SELECTION

↓

WALK_TO_DEPARTMENT

↓

WAIT

↓

INTERACT

↓

SERVICE_COMPLETED

↓

EXIT
```

---

# 3. Customer Types

Everyday Customer

Premium Customer

Business Customer

Young Customer

Senior Customer

Family Customer

---

# 4. Customer Needs

NPCs should have intents.

Examples:

UTILITY_PAYMENT

CARD_SERVICE

CREDIT

DEPOSIT

TRANSFER

INFORMATION

---

# 5. Queue System

Each department maintains a queue.

Queue variables:

QueueLength

AverageWait

Priority

AvailableAgents

---

# 6. Agent Workload

Example:

Credit Agent:

Current workload = 85%

System can recommend another agent.

---

# 7. Manager Gameplay

Player can see:

```
Credit:
85%

Payments:
42%

Cards:
31%

Deposits:
67%
```

---

# 8. Dynamic Assignment

Player:

"To'lov bo'limida navbat ko'payib ketdi."

Manager AI:

"Ikki bo'sh agentni to'lov bo'limiga yo'naltirishni tavsiya qilaman."

Player:

"Qil."

System:

Agents reassigned.

---

# 9. Ambient Behavior

Customers may:

- check phone
- look at screen
- talk
- sit
- stand
- walk
- leave

---

# 10. Performance

NPC simulation must scale.

Use:

- actor pooling
- distance-based simulation
- simplified AI for distant NPCs
- animation sharing
- event-driven behavior

---

# 11. World Density

The bank should never appear unnaturally empty.

But NPC density must adapt to performance.
