# AI BankVerse — STT/TTS Pipeline

## 1. Architecture

```
MICROPHONE

↓

Audio Capture

↓

Voice Activity Detection

↓

Speech-To-Text

↓

AI Orchestrator

↓

Text Response

↓

Text-To-Speech

↓

Audio Playback

↓

Lip Sync
```

---

# 2. Audio Capture

The Unreal client captures microphone audio.

Requirements:

- echo cancellation
- noise reduction
- configurable microphone device
- push-to-talk fallback

---

# 3. VAD

Voice Activity Detection identifies:

speech start

speech end

This prevents unnecessary audio transmission.

---

# 4. STT

Interface:

IBVSTTProvider

Methods:

StartRecognition()

StopRecognition()

Transcribe()

---

# 5. TTS

Interface:

IBVTTSProvider

Methods:

Synthesize()

StreamSpeech()

StopSpeech()

---

# 6. Streaming

Preferred:

STT streaming

AI streaming

TTS streaming

This reduces perceived latency.

---

# 7. Latency Target

Target:

Speech end
→ first AI response

< 1.5 seconds where technically possible.

Speech end
→ first spoken response

< 2.5 seconds target.

---

# 8. Voice State

Listening

Processing

Speaking

Interrupted

Idle

---

# 9. Interruption

User can interrupt TTS.

On interruption:

Stop TTS

Stop facial speech animation

Start new recognition

---

# 10. Error

If STT fails:

"Men sizni yaxshi eshitmadim. Qaytadan aytib bera olasizmi?"

---

# 11. Privacy

Microphone indicator must always show active recording state.

Never record continuously without explicit user permission.
