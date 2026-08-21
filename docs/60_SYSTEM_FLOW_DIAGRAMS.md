> **STATUS: COMPILED** — these two diagrams were pasted standalone, without a numbered
> document wrapper, at two points in the original specification. They are reproduced here
> verbatim as a dedicated document so they stay indexed and linkable.

# AI BankVerse — System Flow Diagrams

## 1. User Interaction Flow

```
                USER
                  │
                  ▼
          ┌───────────────┐
          │ VIRTUAL BANK  │
          └───────┬───────┘
                  │
             VOICE / WALK
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
   WALK & EXPLORE      SPEAK DIRECTLY
        │                   │
        ▼                   ▼
   AI EMPLOYEE         RECEPTION AI
        │                   │
        └─────────┬─────────┘
                  ▼
            AI ORCHESTRATOR
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
     CREDIT    PAYMENT    DEPOSIT
      AGENT      AGENT      AGENT
        │         │         │
        └─────────┼─────────┘
                  ▼
           BANKING SERVICE
                  │
                  ▼
          CONTEXTUAL UI
                  │
                  ▼
          USER CONFIRMATION
                  │
                  ▼
           TRANSACTION
                  │
                  ▼
              RECEIPT
```

---

## 2. Development / Runtime Separation

```
                    YOU
                     │
                     ▼
                CLAUDE CLI
                     │
                     │
             DEVELOPMENT ONLY
                     │
                     ▼
              AI BANKVERSE CODE
                     │
        ┌────────────┼─────────────┐
        ▼            ▼             ▼
      UE 5.8       Backend       Docs
        │            │
        ▼            ▼
   3D BANK       Banking API
        │            │
        └──────┬─────┘
               ▼
        BANKVERSE RUNTIME
               │
       ┌───────┴────────┐
       ▼                ▼
   MOCK AI          PRODUCTION AI
   (MVP)            (later)
```

See docs/47_CLAUDE_CLI_DEVELOPMENT_STRATEGY.md and
docs/48_RUNTIME_AI_PROVIDER_ARCHITECTURE.md for the rules behind this separation.
