> **STATUS: RECONSTRUCTED** — §1–§6 below were rebuilt from context (module names referenced
> throughout docs/10, /15, /31, /36). §7 onward is the original source text.

# AI BankVerse — Unreal Project Structure

## 1. Purpose

Top-level `Source/` layout for the future Unreal Engine 5.8 client. This structure exists
so `prototype/unreal/` can be scaffolded consistently once UE is installed (see
IMPLEMENTATION_PLAN.md Stage D) — it is not created until then.

---

# 2. Top-Level Layout

```
Source/AIBankVerse/
├── Core/
├── Player/
├── AI/
├── Agents/
├── Banking/
├── Interaction/
├── UI/
├── Voice/
├── Animation/
├── NPC/
└── World/
```

---

# 3. Core

```
Core/
├── GameInstance
├── Subsystems
├── Configuration
└── Logging
```

---

# 4. Player

```
Player/
├── PlayerCharacter
├── PlayerCameraManager
└── InputConfig (Enhanced Input)
```

---

# 5. AI

```
AI/
├── Providers          (IBVAIProvider implementations)
├── Orchestration       (client-side request/response plumbing)
└── Intent
```

---

# 6. Agents

```
Agents/
├── BankAgentCharacter (base)
├── ReceptionAgent
├── CreditAgent
├── PaymentAgent
└── DepositAgent
```

---

# 7. Banking

```
Banking/
├── Interfaces
├── Models
├── Services
├── Mock
└── Production
```

---

# 8. Interaction

```
Interaction/
├── Interfaces
├── Components
├── Interactables
└── Prompts
```

---

# 9. UI

```
UI/
├── HUD
├── Dialogue
├── ServicePanels
├── Confirmation
├── Notifications
└── Settings
```

---

# 10. Voice

```
Voice/
├── STT
├── TTS
├── AudioCapture
└── VoiceState
```

---

# 11. Animation

```
Animation/
├── Locomotion
├── MotionMatching
├── Facial
├── LipSync
├── Gestures
└── Attention
```

---

# 12. NPC

```
NPC/
├── Customer
├── Navigation
├── Queue
├── Simulation
└── Spawning
```

---

# 13. World

```
World/
├── Bank
├── Departments
├── InteractiveObjects
├── Doors
├── Elevators
└── SmartObjects
```
