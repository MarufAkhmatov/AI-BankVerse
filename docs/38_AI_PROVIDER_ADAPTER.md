# AI BankVerse — AI Provider Adapter

## 1. Goal

AI BankVerse must remain provider-independent.

---

# 2. Interface

IBVAIProvider

Methods:

SendMessage()

StreamMessage()

ClassifyIntent()

GenerateStructuredOutput()

ExecuteToolCall()

---

# 3. Implementations

MockAIProvider

OpenAIProvider

AnthropicProvider

LocalAIProvider

---

# 4. Configuration

Provider:

AI_PROVIDER

API endpoint:

AI_API_BASE_URL

Model:

AI_MODEL

API key:

AI_API_KEY

Secrets must come from environment variables or secure secret storage.

Never commit API keys.

---

# 5. Structured Output

AI responses must be parsed into typed structures.

Example:

```json
{
  "intent": "UTILITY_PAYMENT",
  "confidence": 0.98,
  "agent": "payment",
  "response": "Elektr energiyasi to'lovini tayyorlayman."
}
```

---

# 6. Streaming

For natural conversation, support token/audio streaming where possible.

Do not wait unnecessarily for the complete response.

---

# 7. Timeout

AI requests must have configurable timeout.

Example:

AI_REQUEST_TIMEOUT_MS=10000

---

# 8. Retry

Retry only safe operations.

Never blindly retry financial execution.

---

# 9. Provider Failure

If AI provider unavailable:

Fallback to:

- predefined responses
- traditional service navigation
- service menus
- human support

The bank must not become unusable because AI is unavailable.
