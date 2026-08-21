# AI BankVerse — Testing Strategy

## 1. Testing Layers

Unit Tests

Integration Tests

AI Tests

Gameplay Tests

Voice Tests

Banking Tests

Performance Tests

UX Tests

---

# 2. AI Tests

Test:

Intent recognition

Agent routing

Tool selection

Confirmation logic

Failure handling

Prompt injection resistance

---

# 3. Voice Tests

Examples:

"Elektrga to'lov qil."

"Elektr energiyasini to'lab ber."

"Elektr uchun pul o'tkazmoqchiman."

All should resolve to:

UTILITY_PAYMENT

---

# 4. Banking Tests

Test:

Valid payment

Invalid account

Insufficient funds

Duplicate payment

Timeout

Backend failure

---

# 5. Critical Safety Test

AI says:

"Payment completed."

This is ONLY valid if:

backend.status == SUCCESS

---

# 6. Gameplay Tests

Player must be able to:

enter bank

walk

run

interact

talk

open service

complete transaction

exit

---

# 7. NPC Tests

NPC:

spawn

navigate

queue

interact

complete

exit

---

# 8. Performance

Test:

10 NPCs

25 NPCs

50 NPCs

100 NPCs

200 NPCs

Measure:

FPS

CPU

GPU

Memory

Animation cost

AI cost

---

# 9. Acceptance

The vertical slice is complete when:

Player enters bank.

Player speaks to reception.

Reception understands request.

Correct service opens.

User confirms.

Mock backend executes transaction.

AI reports successful transaction.

All while the player remains inside the 3D bank environment.
