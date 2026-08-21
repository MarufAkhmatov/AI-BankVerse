> **STATUS: RECONSTRUCTED** — §1–§8 below were rebuilt from context, consolidating the class
> names already established in docs/30 and docs/31. §9 onward (UI widgets, Data structs,
> Interfaces, Design Rule, Configuration) is the original source text.

# AI BankVerse — Unreal Implementation Map

## 1. Purpose

Concrete mapping from the module layout (docs/30) and class architecture (docs/31) to actual
Unreal Engine object types (Actor, Component, Subsystem, Widget, Struct, Interface).

---

# 2. Core

```
UBVGameInstance
UBVConfigSubsystem
UBVLoggingSubsystem
```

---

# 3. Player

```
ABVPlayerCharacter
ABVPlayerCameraManager
UBVPlayerInputConfig (Enhanced Input)
```

---

# 4. Camera

```
UBVCameraComponent
  ShoulderOffset / CollisionTrace / DynamicZoom
```

---

# 5. Agents

```
ABVBankAgentCharacter
ABVReceptionAgent
ABVCreditAgent
ABVPaymentAgent
ABVDepositAgent
```

---

# 6. AI Orchestration Client

```
UBVAIOrchestratorSubsystem
UBVMockAIProvider : IBVAIProvider
```

---

# 7. Banking Client

```
UBVBankingServiceSubsystem
UBVMockBankingProvider : IBVBankingProvider
```

---

# 8. Interaction / Interactables

```
UBVInteractionComponent

BVDoorInteractable
BVInformationScreenInteractable
```

---

# 9. UI

UBVConversationWidget

UBVServicePanelWidget

UBVConfirmationWidget

UBVTransactionResultWidget

UBVAgentStatusWidget

UBVInteractionPromptWidget

---

# 10. Data

Use USTRUCT for runtime data.

Examples:

FBVAgentData

FBVTaskData

FBVIntentResult

FBVPaymentData

FBVTransactionResult

FBVConversationMessage

---

# 11. Interfaces

IBVAIProvider

IBVSTTProvider

IBVTTSProvider

IBVBankingProvider

IBVInteractable

---

# 12. Design Rule

Gameplay classes must depend on interfaces.

Do not directly depend on:

OpenAI SDK

Anthropic SDK

specific banking vendor

specific STT vendor

specific TTS vendor

---

# 13. Configuration

Use Data Assets or configuration objects.

Do not hardcode:

agent names

department positions

AI prompts

API URLs

voice configuration

banking products
