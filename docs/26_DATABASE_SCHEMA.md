> **STATUS: RECONSTRUCTED** — sections 1–10 below were rebuilt from context (the relationships
> in §12 and the service/transaction models in docs/05, /11, /21). Sections 11–13 are the
> original source text. Review before treating table definitions as final.

# AI BankVerse — Database Schema

## 1. Users

Table: `users`

Fields:

```
id                  UUID PRIMARY KEY
external_auth_id    VARCHAR(255)
display_name        VARCHAR(150)
preferred_language  VARCHAR(10)
voice_enabled       BOOLEAN
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

# 2. Accounts

Table: `accounts`

Fields:

```
id               UUID PRIMARY KEY
user_id          UUID REFERENCES users(id)
account_number   VARCHAR(50)
currency         VARCHAR(10)
balance          NUMERIC(18,2)
status           VARCHAR(30)
created_at       TIMESTAMP
```

---

# 3. Departments

Table: `departments`

Fields:

```
id           UUID PRIMARY KEY
code         VARCHAR(50)
name         VARCHAR(150)
floor        VARCHAR(30)
position     JSONB
```

---

# 4. Agents

Table: `agents`

Fields:

```
id             UUID PRIMARY KEY
department_id  UUID REFERENCES departments(id)
name           VARCHAR(150)
role           VARCHAR(100)
status         VARCHAR(30)
personality    JSONB
voice_profile  VARCHAR(100)
created_at     TIMESTAMP
```

---

# 5. Agent Tasks

Table: `agent_tasks`

Fields:

```
id             UUID PRIMARY KEY
agent_id       UUID REFERENCES agents(id)
type           VARCHAR(100)
description    TEXT
priority       VARCHAR(20)
status         VARCHAR(30)
created_at     TIMESTAMP
completed_at   TIMESTAMP
```

---

# 6. Services

Table: `services`

Fields:

```
id                       UUID PRIMARY KEY
service_id               VARCHAR(100)
category                 VARCHAR(50)
name                     VARCHAR(150)
requires_confirmation    BOOLEAN
input_schema             JSONB
```

---

# 7. Customer Sessions

Table: `customer_sessions`

Fields:

```
id                    UUID PRIMARY KEY
user_id               UUID REFERENCES users(id)
authentication_state  VARCHAR(30)
device_context        JSONB
created_at            TIMESTAMP
expires_at            TIMESTAMP
```

---

# 8. Conversations

Table: `conversations`

Fields:

```
id                   UUID PRIMARY KEY
customer_session_id  UUID REFERENCES customer_sessions(id)
agent_id             UUID REFERENCES agents(id)
state                VARCHAR(30)
started_at           TIMESTAMP
ended_at             TIMESTAMP
```

---

# 9. Conversation Messages

Table: `conversation_messages`

Fields:

```
id                UUID PRIMARY KEY
conversation_id   UUID REFERENCES conversations(id)
role              VARCHAR(20)
text              TEXT
intent            VARCHAR(100)
created_at        TIMESTAMP
```

---

# 10. Transactions

Table: `transactions`

Fields:

```
id             UUID PRIMARY KEY
account_id     UUID REFERENCES accounts(id)
type           VARCHAR(50)
amount         NUMERIC(18,2)
currency       VARCHAR(10)
provider       VARCHAR(150)
status         VARCHAR(50)
created_at     TIMESTAMP
completed_at   TIMESTAMP
metadata       JSONB
```

---

# 11. Audit Events

Table: `audit_events`

Fields:

```
id                 UUID PRIMARY KEY
trace_id           VARCHAR(100)
user_id            UUID
agent_id           UUID
event_type         VARCHAR(100)
service            VARCHAR(100)
request_metadata   JSONB
result_metadata    JSONB
created_at         TIMESTAMP
```

---

# 12. Relationships

```
users
→ customer_sessions

users
→ accounts

users
→ transactions

agents
→ agent_tasks

departments
→ agents

customer_sessions
→ conversations

conversations
→ conversation_messages
```

---

# 13. Security

Sensitive financial information must not be stored in plain text unless required.

Logs must use masked identifiers.

Example:

860012******1234

NOT:

8600123456781234
