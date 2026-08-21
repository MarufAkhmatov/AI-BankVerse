# AI BankVerse — Unreal Engine Implementation

## Target Engine

Unreal Engine 5.8.

The project should prioritize modern UE rendering and animation systems.

---

# Rendering

## Lumen

Use Lumen for:

- Global Illumination
- Reflections
- dynamic lighting

Epic documents Lumen as a dynamic GI/reflection system integrated with Nanite and World Partition.

---

## Nanite

Use Nanite for appropriate:

- architecture
- environment geometry
- high-detail assets
- static environment meshes

---

## World Partition

Use World Partition for the large bank environment and future expansion.

---

## Virtual Shadow Maps

Use Virtual Shadow Maps where appropriate for high-quality dynamic shadows.

---

# Character

Use MetaHuman for:

- player prototype
- AI employees
- selected customer NPCs

MetaHuman Creator in UE provides character creation, body/head editing, materials, hair/clothing and assembly workflows.

---

# Animation

Use:

- Motion Matching
- Pose Search
- Control Rig
- IK Rig
- Animation Blueprints

---

# AI

Use Unreal AI systems for:

- navigation
- movement
- behavior
- perception

AI Agent intelligence is handled separately by the backend AI orchestration system.

---

# Navigation

Use:

NavMesh

Behavior Trees where useful

State Trees where useful

Smart Objects for:

- desks
- chairs
- reception
- computers
- kiosks
- waiting areas

---

# Interaction

Create a unified interaction system.

Interface:

IInteractable

Functions:

CanInteract()

GetInteractionPrompt()

ExecuteInteraction()

---

# Voice

Pipeline:

```
Microphone

↓

Speech-to-Text

↓

Intent / AI Orchestrator

↓

Agent

↓

Banking Tool

↓

Response

↓

Text-to-Speech

↓

Facial Animation
```

---

# Performance

Target:

60 FPS on high-end PC.

Architecture must support scalability.

Quality tiers:

Cinematic
Epic
High
Medium
Low

---

# Important

Do NOT build the entire final game before validating the core loop.

First build:

1. one bank lobby
2. one player
3. one reception agent
4. one credit agent
5. one payment agent
6. one customer
7. voice interaction
8. one payment workflow

Only after this works should the environment expand.
