# AI BankVerse — Authentication & Authorization

## 1. Authentication

Authentication is handled outside the AI model.

Possible future mechanisms:

OAuth 2.0

OpenID Connect

Bank SSO

Mobile banking session

Device authentication

Biometric authentication

---

# 2. AI Is Not Authentication

The following is NEVER allowed:

User:
"Men Marufman."

AI:
"Mayli, hisobingizni ochaman."

Identity must come from an authenticated session.

---

# 3. Authorization

Authorization must be enforced by backend services.

Example:

User requests:

"Hisobimdan 5 million o'tkaz."

Backend checks:

authenticated

authorized

account ownership

transaction limits

risk controls

---

# 4. Session

Session contains:

sessionId

userId

authenticationState

permissions

deviceContext

createdAt

expiresAt

---

# 5. Financial Confirmation

High-risk action:

User identity

+

authorization

+

transaction preparation

+

explicit confirmation

---

# 6. Confirmation Binding

Confirmation must be bound to:

user

session

paymentId

amount

currency

timestamp

---

# 7. Replay Protection

A previous confirmation must not authorize a different transaction.

---

# 8. Session Expiration

When session expires:

financial operations must stop.

User must re-authenticate.

---

# 9. AI Context

AI may receive:

authorized context

but not unrestricted account data.

---

# 10. Principle

AI interprets intent.

Backend verifies authority.
