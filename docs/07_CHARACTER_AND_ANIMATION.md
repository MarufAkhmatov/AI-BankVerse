# AI BankVerse — Character & Animation Specification

## 1. Character Quality

Characters must look like modern AAA digital humans.

Target:

- realistic skin
- realistic hair
- realistic clothing
- facial animation
- eye movement
- lip synchronization
- natural body motion

MetaHuman can be used as a technical foundation for high-fidelity digital humans. MetaHuman Creator is integrated into Unreal Engine from UE 5.6 onward.

---

## 2. Player Animation

Required:

- idle
- walk
- fast walk
- run
- start
- stop
- turn
- strafe
- sit
- stand
- interact
- talk
- listen
- point
- use computer
- use phone

---

## 3. AI Employee Animation

Required:

- typing
- reading
- writing
- talking
- listening
- thinking
- looking at monitor
- looking at customer
- standing
- sitting
- greeting
- pointing
- gesturing

---

## 4. Motion Matching

Use Motion Matching for high-quality locomotion.

The system should use:

- walking
- running
- turning
- stopping
- directional movement

Motion Matching should be implemented through Unreal Engine's Pose Search system.

---

## 5. Facial Animation

Facial system must support:

- speech
- eye movement
- blinking
- emotions
- attention
- micro expressions

---

## 6. Lip Sync

Voice audio must drive facial animation.

Target:

speech → phoneme/viseme → facial movement

---

## 7. Agent Attention

AI employee should look at the current speaker.

If player moves:

agent can turn head/eyes toward player.

---

## 8. Character LOD

High-quality close characters use high-detail LOD.

Background characters use optimized LOD.

MetaHuman supports multiple LOD levels and Epic recommends lower complexity for background characters to reduce performance cost.
