> **STATUS: RECONSTRUCTED** — §1–§3 below were rebuilt from context (the contextual-UI
> principle in docs/08_UI_UX_SYSTEM.md and the electricity payment example there). §4 onward
> is the original source text.

# AI BankVerse — UI Component Specification

## 1. Principles

Every widget here is contextual (docs/08 §5) — nothing in this list is a permanently
visible dashboard. Widgets mount when a conversation or service needs them and unmount
when the interaction ends.

---

# 2. Conversation Panel

Must display:

Speaker name and role

Live transcript (current utterance)

Listening / thinking / speaking state indicator

---

# 3. Service Panel

Generic contextual panel shell used by every banking service (docs/05 service contract).
Must display:

Service name

Structured input fields (per service's `INPUT_SCHEMA`)

Cancel / Continue actions

---

# 4. Payment Confirmation

Must display:

Service

Provider

Customer

Amount

Currency

Account

Confirm

Cancel

---

# 5. Notification

Types:

Success

Warning

Error

Information

---

# 6. Agent Status

AVAILABLE

BUSY

PROCESSING

OFFLINE

---

# 7. Manager UI

Optional compact overlay.

Shows:

Active Customers

Queues

Agent Workload

Service Volume

Alerts

---

# 8. World UI

Use minimal floating UI.

Do not cover the environment with labels.

---

# 9. Interaction Prompt

Example:

[ E ] Talk to Aziza

For controller:

[ X ] Talk

For mobile:

Tap to interact
