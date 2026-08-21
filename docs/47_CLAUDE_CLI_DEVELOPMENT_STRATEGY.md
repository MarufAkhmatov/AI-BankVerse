# AI BankVerse — Claude CLI Development Strategy

## 1. Critical Requirement

AI BankVerse development must NOT depend on an Anthropic API key embedded
in the project.

Claude Code / Claude CLI is the primary AI-assisted development tool.

---

# 2. Claude CLI Role

Claude CLI is used for:

- repository analysis
- architecture implementation
- Unreal Engine code generation
- Blueprint planning
- C++ implementation
- debugging
- test generation
- documentation
- refactoring
- code review
- Git operations
- implementation planning

---

# 3. Important Separation

Claude Code used by the developer
is NOT the same thing as
the AI Agent runtime inside AI BankVerse.

These are two separate systems.

---

## DEVELOPMENT AI

Claude CLI

Purpose:

build the project.

---

## PRODUCT AI

AI BankVerse runtime AI

Purpose:

interact with customers.

---

# 4. No Anthropic API Key in Repository

The following is prohibited:

ANTHROPIC_API_KEY=...

inside:

.env

source code

Config files

Unreal assets

Blueprints

Git repository

documentation containing real secrets

---

# 5. Development Authentication

Claude Code authentication must be handled by the developer's
Claude Code / CLI environment.

The project itself must not depend on the developer's Claude session.

---

# 6. Production AI Abstraction

AI BankVerse must expose:

IBVAIProvider

The implementation can later connect to an approved production AI provider.

Possible providers:

OpenAI

Anthropic

Google

Local Model

Enterprise AI Gateway

---

# 7. MVP

The MVP does NOT require Anthropic API integration.

Use:

MockAIProvider

for automated development.

The Claude CLI is used to build and maintain the project.

---

# 8. Why

This separation prevents:

- developer credentials entering production
- API key leakage
- coupling the game to one AI vendor
- unexpected API costs
- architecture dependency on Claude Code

---

# 9. Claude Code Instruction

When implementing AI BankVerse:

DO NOT ask the developer to provide an Anthropic API key
unless explicitly required for a separately approved runtime integration.

For MVP AI functionality, use MockAIProvider.

For development assistance, continue using Claude Code.

---

# 10. Final Principle

Claude builds AI BankVerse.

AI BankVerse does not depend on Claude Code being installed
on the customer's device.
