# 004 — Replace the global reduced-motion reset

- **Commit:** 1fbaf58
- **Severity:** MEDIUM
- **Category:** Accessibility
- **Estimated scope:** 1 shared stylesheet and each motion surface lacking a local reduced-motion branch, ~12 files

## Problem

The global reduced-motion media query sets every animation and transition to `0.01ms` and forces one iteration. This removes all state feedback, including safe opacity and color changes that help users understand what changed. Reduced motion should remove travel, scale, rotation, and looping motion while retaining a short opacity, color, or background-color indication.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `app/globals.css` | 227–237 | Universal 0.01ms reset for every animation and transition. |
| `components/word-switcher.tsx` | 35, 150–161 | Existing local `useReducedMotion` branch. |
| `components/writing/image-lightbox.tsx` | 18, 199–212 | Existing reduced-motion handling for loading dots. |

### Current code

```css
/* app/globals.css:228 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Target

Replace the universal motion reset with a global scrolling safeguard only:

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

At each moving surface, implement one of these exact reduced-motion variants:

- Framer Motion: branch with `useReducedMotion()` so `x`, `y`, `scale`, `rotate`, and `filter` remain at their final values, while opacity may transition for `150ms` with `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
- Tailwind/CSS: add `motion-reduce:transition-opacity motion-reduce:duration-150`, and use `motion-reduce:transform-none` or an equivalent state class so no movement, scale, or rotation runs.
- Infinite loops: use a representative paused frame, or render a static equivalent. Do not leave an infinite animation running under `reduce`.

**Why these values:** 150ms provides an understandable state change without noticeable delay; the explicit ease-out curve is already used for lightbox opacity; removing transform-like properties addresses vestibular motion without erasing visual feedback.

## Conventions to follow

- `components/word-switcher.tsx:35, 158–161` is the primary Framer Motion exemplar: its reduced-motion branch removes translation and blur.
- `components/writing/image-lightbox.tsx:199–212` shows an infinite loading animation switching to a static opacity state.
- `app/about/page.tsx:39–46` uses `useReducedMotion()` to select `noMotion` variants.

## Steps

1. Replace the current universal block in `app/globals.css` with the exact `html { scroll-behavior: auto; }` reduced-motion rule above.
2. Inventory every local animation in `app/`, `components/`, and `lib/` using `rg -n 'motion\\.|AnimatePresence|animate-|@keyframes|transition-' app components lib`.
3. For each moving application surface, add the exact local behavior described in Target. Preserve a 150ms opacity/color/background-color transition only when it conveys a state change.
4. For shared `components/ui/*` primitives, use Tailwind `motion-reduce:` utilities. Ensure opening overlays, accordion content, sheets, drawers, menus, tooltips, and hover cards have no translate/scale/rotate movement under reduced motion but retain a 150ms opacity transition where the primitive can represent open/closed state.
5. For application-specific Framer surfaces, use `useReducedMotion()` rather than the deleted universal override. At minimum verify word switching, lightbox, timeline accordion, work content swap, hover animations, gradients, Pokémon cards, and page entrances.
6. For `animate-pulse`, spinners, autoplay media, and custom keyframes, pause at a representative static frame or provide static content under reduced motion.
7. Test every state in DevTools with the media feature emulated, then document any third-party animation that cannot be locally controlled.

## Out of scope

- Do not change the no-preference timings, curves, or visual personality.
- Do not replace Framer Motion, Radix, Tailwind, or `tw-animate-css`.
- Do not treat `display: none` or removing all feedback as a reduced-motion implementation.

## Verification

**Build**

- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.

**Behavior**

- [ ] With no preference, all existing effects retain their current behavior.
- [ ] With `prefers-reduced-motion: reduce`, every interactive state remains understandable through opacity, color, background-color, or an immediate key-frame state.
- [ ] No reduced-motion surface translates, scales, rotates, blurs, smooth-scrolls, or loops indefinitely.

**Feel**

- [ ] Record a dialog, menu, accordion, word switch, and page entrance in both modes. Reduced mode should feel calm rather than abruptly broken.
- [ ] Test on a real mobile device with its system motion-reduction setting enabled.

## Notes

This plan deliberately expands beyond the stylesheet because a universal CSS override cannot safely convert unknown transform animations into meaningful opacity-only variants. Treat plan 002 as a dependency for the accordion implementation.
