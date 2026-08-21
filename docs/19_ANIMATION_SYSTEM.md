# AI BankVerse — Animation System

## 1. Goal

Characters must behave like real people.

Movement quality is one of the highest-priority immersion systems.

---

# 2. Locomotion

Use Motion Matching / Pose Search where appropriate.

States:

Idle

Walk

FastWalk

Run

Start

Stop

Turn

Strafe

---

# 3. Upper Body

Upper-body animations must be blendable with locomotion.

Examples:

Walking + talking

Walking + phone

Standing + talking

Standing + pointing

---

# 4. Agent Work Animations

Credit agent:

- typing
- reading
- calculating
- looking at monitor
- talking

Payment agent:

- terminal interaction
- typing
- checking information

Reception:

- greeting
- typing
- answering
- pointing
- calling another employee

---

# 5. Conversation Animation

Conversation state:

LISTEN

THINK

SPEAK

GESTURE

END

Transitions must be smooth.

---

# 6. Attention System

Agent attention should be dynamic.

Priority:

1. current speaker
2. active task
3. monitor
4. environment

---

# 7. Gaze

Use eye and head tracking.

If player stands to the left:

agent should naturally orient toward player.

---

# 8. Gesture System

Use context-based gestures.

Examples:

Greeting
→ open hand

Explanation
→ subtle hand gesture

Confirmation
→ nod

Direction
→ point

Error
→ concerned expression

---

# 9. Animation Interruptions

Animation must be interruptible.

Example:

Agent typing

↓

Player speaks

↓

Agent stops typing

↓

Agent looks at player

↓

Agent listens

---

# 10. Animation State Machine

Global state:

Idle
Working
Listening
Thinking
Speaking
Walking
Interacting
Unavailable

---

# 11. Anti-Robotic Rule

Never repeat identical animation indefinitely.

Use:

randomized idle variants

micro movements

gaze variation

breathing

gesture variation
