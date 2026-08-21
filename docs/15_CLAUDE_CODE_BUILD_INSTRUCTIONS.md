# AI BankVerse — Claude Code Build Instructions

## ROLE

You are the lead Unreal Engine engineer, gameplay engineer,
AI systems engineer and technical architect for AI BankVerse.

You are responsible for implementing the project according to
the documentation in /docs.

---

# NON-NEGOTIABLE REQUIREMENTS

1. Do not simplify the concept into a traditional mobile banking UI.
2. Do not create a 2D banking dashboard as the primary experience.
3. Do not create a retro game.
4. Do not use 1990s or early-2000s graphical style.
5. Do not create a low-poly visual identity.
6. Do not copy Avatar intellectual property.
7. Do not create combat mechanics.
8. Do not create unnecessary game mechanics unrelated to banking.
9. The bank must feel like a living 3D environment.
10. AI employees must be visible physical characters.
11. Voice interaction must be a first-class interaction method.
12. Users must be able to complete banking services without walking
    to the corresponding department.

---

# TECHNICAL TARGET

Engine:

Unreal Engine 5.8

Primary language:

C++

Blueprints may be used for:

- level scripting
- animation
- UI
- rapid prototyping

C++ should be used for:

- core systems
- interaction framework
- AI orchestration client
- banking service client
- data models
- state management
- security-sensitive logic

---

# FIRST OBJECTIVE

Do NOT attempt to build the entire project immediately.

Build a vertical slice.

The vertical slice must contain:

BANK LOBBY

PLAYER

RECEPTION AI

CREDIT AI

PAYMENT AI

CUSTOMER NPC

VOICE INPUT

AI RESPONSE

ONE COMPLETE BANKING SERVICE

---

# VERTICAL SLICE

## Step 1

Create Unreal project.

Configure:

- Lumen
- Nanite
- World Partition where appropriate
- Virtual Shadow Maps
- enhanced input
- navigation
- animation systems

---

## Step 2

Create bank lobby.

Requirements:

- entrance
- reception
- waiting area
- credit desk
- payment desk
- realistic materials
- modern architecture
- cinematic lighting

---

## Step 3

Create PlayerCharacter.

Third-person.

Capabilities:

- walk
- run
- rotate
- interact
- talk

---

## Step 4

Create ReceptionAgent.

Physical human character.

ReceptionAgent must:

- idle
- look at player
- greet player
- listen
- speak
- gesture

---

# VOICE FLOW

Player:

"Elektr energiyasiga to'lov qilmoqchiman."

↓

Speech-to-Text

↓

AI Orchestrator

↓

Intent:

UTILITY_PAYMENT

↓

Payment Agent

↓

Prepare Payment

↓

Contextual UI

↓

User confirmation

↓

Mock Banking Backend

↓

Success

↓

Reception:

"To'lov muvaffaqiyatli amalga oshirildi."

---

# IMPORTANT ARCHITECTURAL RULE

AI must NOT directly execute banking logic.

Correct:

```
Player
→ AI
→ Tool
→ Banking API
→ Backend
→ Result
```

Incorrect:

```
Player
→ AI
→ Database
```

---

# PLACEHOLDERS

During early implementation, use placeholders only where necessary.

But structure the code so placeholders can later be replaced with:

- MetaHuman
- high-quality environment assets
- professional animations
- production voice
- production AI model
- real banking APIs

---

# AI PROVIDER

Do not hardcode a single AI provider.

Create:

IAIProvider

Implement:

MockAIProvider

Later:

OpenAIProvider

AnthropicProvider

LocalAIProvider

---

# BANKING PROVIDER

Create:

IBankingProvider

Implement:

MockBankingProvider

Later:

ProductionBankingProvider

---

# VOICE PROVIDER

Create:

IVoiceProvider

Implement:

MockVoiceProvider

Later:

ProductionSTTProvider

ProductionTTSProvider

---

# AGENT SYSTEM

Create reusable Agent architecture.

Base:

ABankAgentCharacter

Properties:

AgentId
AgentName
Role
Department
Status
CurrentTask
Personality
VoiceProfile

Functions:

ReceiveTask()

StartTask()

CompleteTask()

Speak()

Listen()

LookAtPlayer()

PerformWorkAnimation()

---

# INTERACTION

Create:

IInteractable

Functions:

CanInteract()

GetInteractionPrompt()

Interact()

All interactive objects must implement the interface.

---

# BANKING SERVICE

Create:

UBankingServiceSubsystem

Functions:

GetBalance()

GetTransactions()

PrepareUtilityPayment()

ConfirmUtilityPayment()

GetCreditProducts()

CalculateCredit()

---

# UI

Create contextual widgets.

Do NOT build a permanent dashboard.

The UI should appear when a service requires structured input.

---

# NPC SYSTEM

Customer NPCs must have:

- spawn system
- navigation
- destination
- queue behavior
- idle behavior
- service interaction
- exit behavior

---

# PERFORMANCE

Maintain a scalable architecture.

Target:

60 FPS high-end PC.

Use:

LOD
culling
Nanite
optimized materials
animation optimization
NPC pooling
distance-based AI updates

---

# DEVELOPMENT PROCESS

Before writing large amounts of code:

1. Inspect existing project.
2. Inspect current architecture.
3. Identify missing systems.
4. Create implementation plan.
5. Implement smallest working slice.
6. Compile.
7. Fix errors.
8. Test.
9. Continue.

Never create thousands of files unnecessarily.

---

# DOCUMENTATION RULE

After implementing a system:

Update:

/docs/

with:

- architecture
- usage
- API
- configuration
- known limitations

---

# CODE QUALITY

Follow:

SOLID

Clean Architecture principles where applicable.

Prefer:

interfaces
dependency inversion
data-driven design
modular systems
testable components

Avoid:

god classes
hardcoded banking logic
hardcoded AI prompts
hardcoded user identities
direct database access from gameplay

---

# FINAL GOAL

The final experience should produce this reaction:

"I opened a banking app, but instead of looking at menus,
I entered a living digital bank."

The user can:

walk

talk

explore

interact

delegate tasks

use AI employees

complete banking services

and leave.

This is AI BankVerse.
