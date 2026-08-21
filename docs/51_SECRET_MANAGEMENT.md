# AI BankVerse — Secret Management

## 1. Golden Rule

No secrets in source code.

---

# 2. Never Commit

API keys

private keys

JWT secrets

database passwords

bank credentials

production tokens

---

# 3. Development

Use local environment configuration.

Example:

local configuration

or

developer machine secret store.

---

# 4. Claude CLI

Claude Code authentication is external to the project.

The repository must not contain Claude authentication credentials.

---

# 5. Unreal

Unreal configuration must not contain production secrets.

---

# 6. Backend

Production secrets should be provided through:

environment variables

secret manager

deployment platform secret store

---

# 7. Logging

Never log:

API keys

access tokens

passwords

full card numbers

full account numbers

---

# 8. Error Messages

Do not expose infrastructure secrets.

Incorrect:

"Database password X failed."

Correct:

"Service temporarily unavailable."

---

# 9. Git Protection

Add secret scanning.

Recommended checks:

pre-commit

CI secret scanning

repository scanning

---

# 10. Incident

If a secret is accidentally committed:

1. revoke it
2. rotate it
3. remove it
4. inspect repository history
5. investigate usage
