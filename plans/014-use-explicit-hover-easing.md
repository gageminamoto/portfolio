# 014 — Use explicit hover-animation easing

- **Commit:** 1fbaf58
- **Severity:** MEDIUM
- **Category:** Easing & duration
- **Estimated scope:** 1 file, ~2 lines

## Problem

The pot-lid portfolio hover effect uses Motion’s named `easeInOut` and `easeOut` values at `components/hover-animations/pot-lid-rattle.tsx:36,60`. The project otherwise uses explicit cubic-bezier values for deliberate motion, making this effect harder to tune consistently.

## Target

Replace `ease: "easeInOut"` with `ease: [0.645, 0.045, 0.355, 1]` and replace `ease: "easeOut"` with `ease: [0.23, 1, 0.32, 1]`. Keep rattle duration `0.5`, steam duration `1.2`, repeat behavior, transforms, delays, and the existing reduced-motion early return unchanged.

**Why these values:** the quart ease-in-out suits on-screen rattle movement; the strong ease-out gives steam a fast launch and gentle settle.

## Conventions to follow

- `lib/hover-constants.ts:4–15` documents the same explicit on-screen quart curve.
- `lib/animations.ts:20–23` uses the project’s `[0.23, 1, 0.32, 1]` ease-out.

## Steps

1. Replace the two named easing strings with the exact numeric arrays.
2. Do not change any other prop.

## Out of scope

- Do not adjust the branded rattle timing, amplitude, steam geometry, or reduced-motion behavior.

## Verification

- [ ] Lint and build pass.
- [ ] Hover in and out repeatedly; rattle remains intentional and steam does not jump.
- [ ] Confirm reduced-motion still renders only static children.
- [ ] Record one hover cycle and compare it at normal and reduced motion.
