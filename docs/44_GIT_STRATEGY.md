# AI BankVerse — Git Strategy

## 1. Repository

Git repository:

ai-bankverse

---

# 2. Branches

main

develop

feature/*

fix/*

experiment/*

---

# 3. Main

Must always be stable.

No experimental changes directly on main.

---

# 4. Feature Example

feature/voice-reception

feature/payment-agent

feature/npc-simulation

feature/motion-matching

---

# 5. Commit Convention

feat:

fix:

refactor:

docs:

test:

chore:

---

# 6. Example

feat: add reception agent interaction

feat: implement electricity payment flow

fix: prevent duplicate payment execution

docs: add voice pipeline specification

---

# 7. Commit Rule

Claude Code must commit after a meaningful completed unit.

Do not create one giant commit for the entire project.

---

# 8. Before Commit

Run:

build

tests

lint where applicable

validation

---

# 9. Generated Files

Do not commit:

API keys

local secrets

temporary build output

IDE caches

large generated binaries unless explicitly required

---

# 10. Unreal Specific

Use appropriate .gitignore for Unreal Engine.

Track source assets required for the project.

Use Git LFS for large binary assets if needed.
