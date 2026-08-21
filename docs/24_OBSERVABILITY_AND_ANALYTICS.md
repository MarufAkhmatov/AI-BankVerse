# AI BankVerse — Observability & Analytics

## 1. Objective

Every important interaction should be measurable.

---

# 2. Product Metrics

Track:

SessionDuration

BankEntryRate

VoiceUsageRate

ServiceCompletionRate

ServiceFailureRate

AverageTransactionTime

AIResolutionRate

HumanEscalationRate

NavigationUsage

DirectVoiceUsage

---

# 3. AI Metrics

IntentAccuracy

AgentRoutingAccuracy

ToolSuccessRate

AIResponseLatency

STTLatency

TTSLatency

BackendLatency

---

# 4. Experience Metrics

Measure:

Time to First Interaction

Time to Service

Navigation Distance

Number of Interactions

Number of Clarifications

---

# 5. Important Metric

Time To Banking Service

Definition:

time from user intent

to

service interface ready.

Target:

< 3 seconds for common requests under normal conditions.

---

# 6. Logging

Logs must not contain unnecessary PII.

Use:

userId hash

sessionId

agentId

intent

service

latency

result

---

# 7. AI Trace

Each request should have:

traceId

Example:

TRACE-8F91A2

This allows:

Voice

→ AI

→ Agent

→ Tool

→ Backend

to be traced end-to-end.
