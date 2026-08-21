# AI BANKVERSE — FINAL CLAUDE CODE MASTER INSTRUCTION

You are building AI BankVerse.

This is an immersive 3D AI banking experience.

Read the complete /docs directory before making major architectural decisions.

---

# CRITICAL ARCHITECTURAL DECISION

THE BANK IS STRICTLY ONE FLOOR.

This is non-negotiable.

There must be:

NO second floor.

NO mezzanine.

NO balcony level.

NO upper banking area.

NO multi-story customer circulation.

The entire bank exists inside ONE enormous monumental banking hall.

The ceiling is extremely high:

14–18 meters.

---

# ARCHITECTURAL SCALE

Target:

45–60 meters long

25–35 meters wide

14–18 meters ceiling

---

# ARCHITECTURAL STYLE

Create an original architectural language inspired by:

historic Grand Central-scale monumental interiors

early 20th-century banking halls

Beaux-Arts

Renaissance

Neo-Gothic details

European private banking

luxury financial institutions

James Bond-level cinematic sophistication

BUT:

DO NOT COPY ANY EXISTING BUILDING.

---

# VISUAL TARGET

The final visual target is:

MODERN 2020s AAA 3D.

Not:

1990s

early 2000s

PS2

PS3

retro

low-poly

generic mobile 3D

---

# ENVIRONMENT

The main hall must contain:

marble floor

marble walls

large columns

arches

vaulted ceiling

ornamental ceiling

7–9 chandeliers

large windows

velvet curtains

dark walnut

emerald leather

antique brass

aged bronze

crystal

---

# CENTRAL COMPOSITION

```
Entrance

→ Reception

→ Open central customer area

→ Banker stations

→ Private banking perimeter

→ Rear monumental architecture
```

Everything remains on ONE FLOOR.

---

# BANKER STATIONS

16–24 stations.

Each banker is a visible human AI agent.

Agents must:

sit

type

read

look at screens

look at customers

stand

walk

speak

listen

gesture

---

# PLAYER

Third-person character.

The player physically walks through the bank.

Movement must be modern and natural.

Use Motion Matching / Pose Search where appropriate.

---

# AI AGENTS

Required first agents:

ReceptionAgent

PaymentAgent

CreditAgent

DepositAgent

---

# VOICE

Voice is a primary interaction method.

Example:

User:

"Elektr energiyasiga to'lov qilmoqchiman."

System:

Reception understands.

Payment service opens.

User does NOT need to physically walk to Payment.

---

# TWO UX PATHS

PATH A:

Immersive

User walks through bank.

PATH B:

Fast Service

User speaks.

System opens the required service immediately.

Both must use the same banking domain services.

---

# BANKING

MVP uses:

MockBankingProvider.

Services:

balance

transactions

electricity payment

credit

deposits

---

# SECURITY

AI does not directly access banking databases.

Correct:

```
AI

→ Tool

→ Banking Service

→ Backend
```

Incorrect:

```
AI

→ Database
```

---

# CLAUDE CLI

Claude Code / Claude CLI is the development tool.

Do NOT require an Anthropic API key inside the project.

Do NOT place Claude credentials into:

source

.env

Unreal config

Git

Blueprints

The project must be independent of Claude CLI at runtime.

---

# RUNTIME AI

Use:

MockAIProvider

for the MVP.

Runtime AI must use:

IBVAIProvider

and remain provider-independent.

---

# DEVELOPMENT STRATEGY

DO NOT BUILD EVERYTHING AT ONCE.

Build a vertical slice.

---

# FIRST DEMO

The first demo must contain:

ONE FLOOR BANK

PLAYER

RECEPTION

PAYMENT AGENT

CREDIT AGENT

CUSTOMER NPCS

VOICE

ELECTRICITY PAYMENT

CONFIRMATION

MOCK TRANSACTION

RECEIPT

---

# VISUAL DEMO REQUIREMENT

The first demo must already communicate:

"financial cathedral"

not:

"game prototype"

Greybox is acceptable during internal development.

It is NOT acceptable for the final vertical-slice presentation.

---

# DEVELOPMENT LOOP

Inspect

Plan

Implement

Compile

Test

Fix

Document

Commit

---

# SESSION MANAGEMENT

Read:

SESSION_HANDOFF.md

before continuing previous work.

At the end of every significant session:

update SESSION_HANDOFF.md.

---

# COST CONTROL

Do not repeatedly read the entire repository.

Read only relevant files.

Do not regenerate complete files unnecessarily.

Do not refactor unrelated systems.

Do not repeatedly analyze unchanged architecture.

---

# FINAL PRODUCT EXPERIENCE

The player enters the bank.

The doors open.

A monumental financial hall appears.

Warm sunlight enters through enormous windows.

Chandeliers illuminate marble.

AI bankers work naturally.

Customers walk through the hall.

The reception agent notices the player.

The player says:

"Elektr energiyasiga to'lov qilmoqchiman."

The receptionist responds.

The payment interface appears.

The user confirms.

The payment completes.

The receipt appears.

Meanwhile:

employees continue working

customers continue moving

lights continue changing

the environment remains alive.

The player should feel:

"I am inside a living digital bank."

NOT:

"I am opening a banking app."

NOT:

"I am playing a retro game."

NOT:

"I am looking at a chatbot."

---

# FINAL PRINCIPLE

THE WORLD IS THE INTERFACE.

AI AGENTS ARE THE EMPLOYEES.

VOICE IS THE NATURAL LANGUAGE.

BANKING SERVICES ARE THE OPERATIONS.

THE 3D ENVIRONMENT IS THE EXPERIENCE.

CLAUDE CODE IS THE DEVELOPMENT ASSISTANT.

THE PRODUCT MUST STAND ON ITS OWN.
