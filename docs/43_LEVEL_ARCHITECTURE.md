> **STATUS: SUPERSEDED** — this document's sublevel list (docs/06 era) implies a multi-floor
> back-office/department split. The bank hall itself is single-floor per
> [61_FLAGSHIP_BANK_ARCHITECTURE.md](61_FLAGSHIP_BANK_ARCHITECTURE.md) and
> [62_BANK_FLOOR_PLAN.md](62_BANK_FLOOR_PLAN.md). Treat department sublevels below as
> logical streaming boundaries within the same floor, not as vertical levels.

# AI BankVerse — Level Architecture

## 1. Main Level

LV_Bank_Main

---

# 2. Sublevels

LV_Bank_Exterior

LV_Bank_Lobby

LV_Bank_Reception

LV_Bank_Credit

LV_Bank_Payments

LV_Bank_Deposits

LV_Bank_Cards

LV_Bank_Premium

LV_Bank_BackOffice

---

# 3. World Partition

Use World Partition when environment size justifies it.

The first MVP may remain a compact single-level environment.

Do not introduce unnecessary complexity.

---

# 4. Data Layers

Possible:

BusinessHours

AfterHours

HighTraffic

LowTraffic

SpecialEvent

---

# 5. Dynamic Environment

Business hours can affect:

NPC density

lighting

department availability

agent availability

---

# 6. Interior

Bank must feel physically connected.

No artificial loading screen between normal departments.

---

# 7. Elevators

Optional for MVP.

Future:

physical elevator interaction

floor transition

dynamic NPC use

---

# 8. Doors

Doors can use:

Smart Object

Interactive Component

Animation Blueprint

---

# 9. Streaming

Environment streaming must not interrupt conversation.
