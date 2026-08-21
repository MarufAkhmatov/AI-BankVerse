# AI BankVerse — Motion Matching Setup

## 1. Objective

Movement must look natural and modern.

Avoid robotic animation state transitions.

---

# 2. Required Motion Data

Walking:

forward

backward

left

right

diagonal

---

Running:

forward

turning

stopping

starting

---

# 3. Pose Search

Use Pose Search / Motion Matching where appropriate.

---

# 4. Locomotion Variables

Speed

Direction

Acceleration

RotationRate

GroundSpeed

MovementIntent

---

# 5. Transitions

The system should automatically select appropriate motion.

Example:

Player runs forward.

User changes direction 45°.

System selects an appropriate directional transition.

---

# 6. Start / Stop

Do not instantly switch:

Idle → Run

Use appropriate start animation.

Run → Idle

Use appropriate stop animation.

---

# 7. Turning

Character must support:

90°

180°

small direction changes

---

# 8. Indoor Movement

Reduce run speed indoors.

Support:

tight turns

short stopping distance

---

# 9. Agent Movement

AI employees use the same locomotion framework.

---

# 10. Quality Rule

Movement is considered unacceptable if:

feet visibly slide

character snaps direction

turning is robotic

hands intersect body

animation repeatedly loops identically
