# AI BankVerse — Game / Experience Design Document

## 1. Experience Type

AI BankVerse is a 3D interactive banking simulation and digital banking experience.

It combines:

- third-person exploration
- simulation
- AI interaction
- conversational banking
- service execution
- environmental storytelling

It is not a traditional combat game.

There are no weapons.

There are no enemies.

There is no traditional health system.

The primary gameplay loop is:

EXPLORE → INTERACT → ASSIGN → EXECUTE → COMPLETE

---

## 2. Player Character

The player controls a human bank employee / manager.

Third-person camera follows the player.

Camera characteristics:

- over-the-shoulder
- smooth follow
- collision-aware
- adjustable distance
- cinematic transitions
- indoor/outdoor adaptation

---

## 3. Player Abilities

Player can:

- walk
- run
- rotate
- interact
- talk
- listen
- issue AI commands
- inspect objects
- enter departments
- sit at desk
- access workstation
- communicate with AI employees

---

## 4. AI Employees

AI employees are visible human-like characters.

Every employee has:

- name
- role
- department
- appearance
- personality
- voice
- animation profile
- knowledge domain
- task queue
- status
- workload
- performance metrics

Example:

Name:
Aziza Karimova

Role:
Credit Specialist

Department:
Credit

Personality:
Professional, calm, concise

Capabilities:

- credit consultation
- loan eligibility analysis
- document checklist
- application preparation
- customer communication

---

## 5. Customer NPCs

Virtual customers populate the bank.

Customers:

- enter
- look around
- approach reception
- wait
- walk to departments
- speak with agents
- complete services
- leave

Their behavior must be autonomous.

---

## 6. Dynamic Bank Environment

The environment should feel alive.

Examples:

- customers walking
- employees typing
- employees talking
- employees standing
- reception answering customers
- screens displaying information
- elevators opening
- doors opening
- waiting customers
- employees moving between desks

---

## 7. AI Agent Task System

Player can approach an AI employee.

Interaction:

Player:

"Bugun kredit navbatini qisqartirishga e'tibor ber."

Agent:

"Tushunarli. Kredit bo'limidagi navbatni tahlil qilaman."

Agent executes task.

Agent returns:

"Navbat 18% ga kamaytirildi."

---

## 8. Customer Service Gameplay

Customer can interact with:

- reception
- service agents
- digital kiosks
- virtual screens
- ATMs
- payment terminals

---

## 9. Example Scenario

Customer enters.

Reception:

"Assalomu alaykum. Sizga qanday yordam berishim mumkin?"

Customer:

"Elektr energiyasiga to'lov qilmoqchiman."

System detects:

Intent = Utility Payment
Provider = Electricity

Reception opens:

Electricity Payment Interface

Customer enters:

- account number
- amount

System displays:

- customer name
- outstanding amount
- payment amount

Customer confirms.

Transaction completes.

Reception:

"To'lov muvaffaqiyatli amalga oshirildi."

---

## 10. Immersion vs Efficiency

Every service must support two routes.

### Spatial Route

Physically visit department.

### Direct Route

Use voice command.

Both routes must reach the same backend service.

---

## 11. No Dead Ends

The user must never become stuck.

If AI cannot understand:

"Men sizga yordam beraman. Siz kredit, to'lov, karta yoki boshqa xizmatlardan qaysi birini nazarda tutdingiz?"

---

## 12. Core Experience Loop

PLAYER:

Enter bank

↓

Observe environment

↓

Reception interaction

↓

Choose:

Explore
OR
Speak

↓

AI determines intent

↓

AI agent/service interface

↓

Transaction

↓

Confirmation

↓

Return to environment
