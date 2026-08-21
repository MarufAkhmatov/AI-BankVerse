# AI BankVerse — UI/UX System

## Design Principle

The 3D environment is the primary interface.

Traditional UI is contextual.

---

## UI Layers

### Layer 1 — World

Bank environment.

### Layer 2 — Character

AI employee interaction.

### Layer 3 — Voice

Natural language.

### Layer 4 — Contextual UI

Service panel.

### Layer 5 — System UI

Notifications, profile, settings.

---

## Contextual Service Window

Example:

Electricity Payment

```
--------------------------------
Electricity Provider

Account:
123456789

Customer:
Maruf Akhmatov

Outstanding:
185,000 UZS

Amount:
[ 185,000 UZS ]

[ Cancel ] [ Continue ]
--------------------------------
```

After Continue:

"185,000 UZS hisobingizdan yechiladi."

[ Confirm Payment ]

---

## World UI

AI employees may have subtle indicators:

AVAILABLE
BUSY
IN MEETING
PROCESSING
OFFLINE

Do not use excessive floating labels.

---

## Navigation

Navigation must support:

Voice
Keyboard
Mouse
Controller
Touch

---

## Mobile

Mobile UI should preserve the concept:

3D bank
+
voice
+
contextual service panel

but dynamically reduce environment complexity.
