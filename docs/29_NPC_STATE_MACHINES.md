> **STATUS: RECONSTRUCTED** — §1 and most of §2 were rebuilt from context (the customer
> lifecycle in docs/20_NPC_LIFE_SIMULATION.md §2). §3 onward is the original source text.

# AI BankVerse — NPC State Machines

## 1. Purpose

This document defines the discrete state machines for customer NPCs and employee NPCs,
complementing the behavior-tree description in docs/40_NPC_BEHAVIOR_ARCHITECTURE.md.
Behavior trees decide *what to do*; these state machines record *what state the actor is in*.

---

# 2. Customer State Machine

```
IDLE

↓

ENTERING

↓

SEEKING_SERVICE

↓

ROUTING

↓

RETURN_TO_IDLE
```

`SEEKING_SERVICE` covers reception interaction and department navigation from
docs/20 §2. `ROUTING` is entered once an intent is resolved and the customer is being
directed to an agent or queue slot. `RETURN_TO_IDLE` covers post-service ambient
behavior before `EXITING` (not shown — see docs/40 for the full behavior tree).

---

# 3. Employee State Machine

```
IDLE
WORKING
LISTENING
THINKING
SPEAKING
INTERACTING
WALKING
UNAVAILABLE
```

---

# 4. Agent Work State

```
AVAILABLE

↓

TASK_RECEIVED

↓

TASK_ACCEPTED

↓

PROCESSING

↓

WAITING_FOR_TOOL

↓

COMPLETED

↓

AVAILABLE
```

---

# 5. Failure State

```
PROCESSING

↓

FAILED

↓

RECOVERING

↓

RETRY

OR

ESCALATE
```

---

# 6. Customer Priority

NORMAL

PREMIUM

URGENT

ACCESSIBILITY_PRIORITY

Priority must never violate legal/compliance rules.
