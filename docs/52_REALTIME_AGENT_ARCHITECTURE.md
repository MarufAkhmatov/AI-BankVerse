# AI BankVerse — Real-Time Agent Architecture

## 1. Goal

AI employees must appear alive.

Their AI state and physical state must remain synchronized.

---

# 2. Agent State

Agent has:

location

department

availability

workload

conversation

currentTask

animationState

voiceState

---

# 3. Example

Payment Agent:

availability = BUSY

currentTask = PAYMENT_123

animation = TYPING

voice = SILENT

---

# 4. State Synchronization

```
Backend:

task state

↓

Unreal client:

agent state

↓

Animation system:

physical behavior
```

---

# 5. State Changes

TASK_ASSIGNED

→ agent stops idle behavior

→ begins work

→ animation changes

→ status becomes BUSY

---

# 6. Completion

TASK_COMPLETED

→ animation changes

→ status AVAILABLE

→ agent can accept new customer

---

# 7. Conversation

When player interacts:

Agent state:

LISTENING

Then:

THINKING

Then:

SPEAKING

---

# 8. Movement

If an agent needs to move:

```
task

→ navigation target

→ movement

→ arrival

→ interaction
```

---

# 9. No Teleportation

Agents should not visibly teleport during normal gameplay.

Exceptions:

administrative reset

debug mode

off-screen optimization

---

# 10. Off-Screen Optimization

Distant agents may use simplified simulation.

When player approaches:

full simulation resumes.
