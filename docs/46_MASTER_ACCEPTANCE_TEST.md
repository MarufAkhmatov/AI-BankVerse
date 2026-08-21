# AI BankVerse — Master Acceptance Test

## Scenario 001 — Enter Bank

Given:

application is running

When:

player starts session

Then:

player appears at bank entrance.

---

## Scenario 002 — Reception

Given:

player approaches reception

When:

player enters interaction range

Then:

reception notices player.

Reception turns toward player.

Reception greets player.

---

## Scenario 003 — Voice

Given:

reception is listening

When:

player says:

"Elektr energiyasiga to'lov qilmoqchiman."

Then:

system detects:

UTILITY_PAYMENT

---

## Scenario 004 — Direct Service

System opens:

Electricity Payment

without requiring player to walk to payment department.

---

## Scenario 005 — Payment Preparation

System retrieves:

customer

account

outstanding amount

currency

---

## Scenario 006 — Confirmation

System asks:

"185,000 UZS to'lovni tasdiqlaysizmi?"

---

## Scenario 007 — Execution

User confirms.

Backend returns:

SUCCESS

---

## Scenario 008 — Result

AI says:

"To'lov muvaffaqiyatli amalga oshirildi."

---

## Scenario 009 — Receipt

Receipt appears.

---

## Scenario 010 — Immersion

Player remains physically inside bank.

NPCs continue moving.

Employees continue working.

Environment remains active.

---

# FAILURE CASE

If backend returns:

FAILED

AI must NOT say:

"To'lov amalga oshirildi."

AI must explain actual failure.

---

# FINAL QUALITY TEST

A reviewer unfamiliar with the project should be able to enter the prototype and understand:

"This is a virtual bank."

within the first 30 seconds.

Within 2 minutes the reviewer should be able to:

speak to an AI employee

and complete a banking service.
