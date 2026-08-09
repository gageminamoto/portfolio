# 009 — Add Pokémon card reduced-motion behavior

- **Commit:** 1fbaf58
- **Severity:** MEDIUM
- **Category:** Accessibility
- **Estimated scope:** 1 file, ~35 lines

## Problem

The Pokémon fan, full-screen modal, card flip, tilt, and drag remain motion-heavy under `prefers-reduced-motion: reduce`. `components/pokemon-cards.tsx:561–645` imports no reduced-motion hook.

## Target

Import `useReducedMotion` and derive `const shouldReduceMotion = useReducedMotion()`. Thread this boolean into `Card3DModal`. Under reduction: render fan cards immediately at their final rotate/x/y/opacity/scale state with no spring or hover/tap transforms; modal overlay and card use only `{ opacity: 0 }` to `{ opacity: 1 }` over `150ms` with `[0.25, 0.46, 0.45, 0.94]`; hide the moving hint; disable tilt/drag and the 3D flip, but retain a semantic card view and close action.

## Conventions to follow

- `components/word-switcher.tsx:35,158–161` removes travel and blur through a local Motion hook.
- `components/writing/image-lightbox.tsx:199–212` keeps a static opacity indication under reduction.

## Steps

1. Add `useReducedMotion` and branch fan `initial`, `animate`, `exit`, `transition`, `whileHover`, and `whileTap` props using the exact values above.
2. Add the boolean prop to `Card3DModal` and use it to remove pointer handlers, springs, 3D transforms, and hint entrance.
3. Preserve card selection, image alt text, close behavior, and touch detection.

## Out of scope

- Do not alter no-preference spring personality, card data, fan geometry, or image assets.

## Verification

- [ ] Lint and build pass.
- [ ] No-preference fan, tilt, drag, and flip remain unchanged.
- [ ] Under reduced motion no card translates, rotates, scales, springs, or loops; opening remains understandable through a 150ms fade.
- [ ] Test with the system reduced-motion setting on mobile.
