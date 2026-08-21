> **STATUS: RECONSTRUCTED** — everything before "# NPC Simulation" was rebuilt from context
> (class names cross-referenced in docs/15, /30, /36). The `SpawnCustomer/DespawnCustomer/
> AssignService/UpdateSimulation` method list and the Analytics subsystem at the end are the
> original source text.

# AI BankVerse — Core C++ Architecture

Mirrors the module layout in docs/30_UNREAL_PROJECT_STRUCTURE.md. One primary class/interface
per bullet; naming follows the `BV` (BankVerse) prefix used throughout docs/36.

---

# Player

```
ABVPlayerCharacter
  Walk() / Run() / Interact() / Talk()

ABVPlayerCameraManager
```

---

# Interaction

```
IBVInteractable
  CanInteract()
  GetInteractionPrompt()
  ExecuteInteraction()

UBVInteractionComponent
```

---

# Agents

```
ABVBankAgentCharacter (base)
  ReceiveTask() / StartTask() / CompleteTask()
  Speak() / Listen() / LookAtPlayer()
  PerformWorkAnimation()

ABVReceptionAgent : ABVBankAgentCharacter
ABVCreditAgent    : ABVBankAgentCharacter
ABVPaymentAgent   : ABVBankAgentCharacter
ABVDepositAgent   : ABVBankAgentCharacter
```

---

# AI Orchestration Client

```
IBVAIProvider
  SendMessage() / StreamMessage()
  ClassifyIntent() / GenerateStructuredOutput()

UBVAIOrchestratorSubsystem
  RouteIntent() / DispatchToAgent()
```

---

# Banking

```
IBVBankingProvider

UBVBankingServiceSubsystem
  GetBalance() / GetTransactions()
  PrepareUtilityPayment() / ConfirmUtilityPayment()
  GetCreditProducts() / CalculateCredit()
```

---

# Voice

```
IBVSTTProvider
  StartRecognition() / StopRecognition() / Transcribe()

IBVTTSProvider
  Synthesize() / StreamSpeech() / StopSpeech()
```

---

# NPC Simulation

```
UBVNPCSimulationSubsystem

Methods:

SpawnCustomer()

DespawnCustomer()

AssignService()

UpdateSimulation()
```

---

# Analytics

```
UBVAnalyticsSubsystem

Methods:

TrackEvent()

TrackLatency()

TrackTransaction()

TrackAIRequest()
```
