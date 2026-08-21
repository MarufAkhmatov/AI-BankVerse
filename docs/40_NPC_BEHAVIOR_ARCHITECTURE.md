# AI BankVerse — NPC Behavior Architecture

## 1. Customer Behavior Tree

```
ROOT

├── IsEmergency?

├── HasServiceNeed?

│
└── NormalCustomer

    ├── EnterBank

    ├── FindReception

    ├── SpeakToReception

    ├── SelectService

    ├── FindDepartment

    ├── JoinQueue

    ├── Wait

    ├── ReceiveService

    ├── Confirm

    ├── Complete

    └── ExitBank
```

---

# 2. Idle Behavior

When idle:

Selector:

CheckPhone

LookAround

Sit

Stand

TalkToNPC

ReadScreen

---

# 3. Navigation

Use NavMesh.

For important interactive locations use:

Smart Objects.

Examples:

ReceptionDesk

AgentDesk

WaitingChair

ATM

PaymentTerminal

---

# 4. Queue

Queue system must dynamically assign:

queue position

waiting location

estimated wait

---

# 5. Queue Movement

Customers move forward when:

agent becomes available.

Movement must be smooth.

---

# 6. Service

When customer reaches agent:

Agent notices customer.

Agent turns toward customer.

Greeting animation.

Conversation starts.

---

# 7. Completion

After successful service:

Customer:

receives confirmation

shows satisfied response

leaves department

walks to exit

---

# 8. Failed Service

Customer should not silently disappear.

Possible outcomes:

Retry

Alternative service

Support

Exit

---

# 9. Background Simulation

Distant customers do not require full conversational AI.

Use lightweight simulation.

Only activate full AI when:

player is nearby

customer enters relevant interaction zone

customer becomes part of visible gameplay
