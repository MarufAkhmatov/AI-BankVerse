# AI BankVerse — Claude Code Efficiency Protocol

## Objective

Minimize unnecessary Claude Code context consumption.

---

# 1. Do Not Read Everything

Claude Code must not repeatedly read the entire repository.

Read only relevant files.

---

# 2. Documentation Hierarchy

For most tasks:

First:

CLAUDE.md

Then:

relevant specification

Then:

relevant source files

---

# 3. Avoid Duplicate Analysis

Do not repeatedly analyze unchanged architecture.

Use:

ARCHITECTURE.md

SESSION_HANDOFF.md

IMPLEMENTATION_PLAN.md

---

# 4. Small Tasks

Prefer:

one subsystem

one feature

one bug

one test

per session.

---

# 5. Compilation

Compile after logical changes.

Do not repeatedly compile after every single line.

---

# 6. Debugging

When build fails:

Read the exact error.

Inspect only affected files.

Fix root cause.

Do not regenerate the entire system.

---

# 7. Code Generation

Do not replace entire files unless necessary.

Prefer targeted modifications.

---

# 8. Documentation

Update documentation only when:

architecture changes

API changes

behavior changes

new subsystem introduced

---

# 9. Context Handoff

At session end:

SESSION_HANDOFF.md

must contain current state.

---

# 10. Avoid Infinite Loops

If same error occurs three times:

STOP

diagnose root cause

change strategy.

---

# 11. No Blind Refactoring

Do not refactor unrelated code during feature implementation.

---

# 12. Priority

1. Build
2. Correctness
3. Security
4. Core UX
5. Performance
6. Visual polish
7. Refactoring
