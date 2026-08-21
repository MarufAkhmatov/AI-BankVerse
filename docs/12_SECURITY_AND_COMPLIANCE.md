# AI BankVerse — Security Specification

## Principle

The AI layer must never become a privileged banking backdoor.

---

## AI Cannot

- bypass authentication
- change permissions
- access arbitrary accounts
- execute unrestricted SQL
- fabricate transaction results
- approve its own high-risk actions

---

## Financial Operation

Every sensitive operation:

```
AUTHENTICATE

↓

AUTHORIZE

↓

VALIDATE

↓

PREPARE

↓

DISPLAY

↓

USER CONFIRMATION

↓

EXECUTE

↓

AUDIT
```

---

## Audit

Record:

userId
agentId
action
timestamp
service
request
result
status

---

## Prompt Injection

External text must be treated as untrusted.

Customer messages must never override:

- system policies
- banking rules
- authorization
- tool permissions

---

## PII

Minimize storage.

Do not send unnecessary personal data to AI models.

Mask sensitive information in logs.

---

## Failure

AI failure must fail safely.

Never:

"Payment completed."

unless backend confirms:

status = SUCCESS
