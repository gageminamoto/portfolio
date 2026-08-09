# 003 — Remove layout animation from word switching

- **Commit:** 1fbaf58
- **Severity:** HIGH
- **Category:** Performance
- **Estimated scope:** 1 file, ~12 lines removed

## Problem

The home-page word switcher drives its wrapper's `width` through Motion on every selection. Width is a layout property, so this turns a small, frequent interaction into per-frame layout work. The word itself already has a composite-friendly opacity, transform, and low-blur transition, so the wrapper can resize immediately.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `components/word-switcher.tsx` | 146–167 | A `motion.span` animates width before the word presence transition. |
| `components/word-switcher.tsx` | 42–47 | `p.widthDuration` only supplies that layout animation. |

### Current code

```tsx
// components/word-switcher.tsx:146
<motion.span
  className="inline-flex overflow-hidden"
  animate={{ width: currentWidth || "auto" }}
  transition={{
    duration: effectsDisabled ? 0 : p.widthDuration,
    ease: [0.4, 0, 0.2, 1],
  }}
>
  <AnimatePresence mode="wait" initial={false}>
```

## Target

Remove the width animation and its unused measurement state. Keep the visual word transition exactly as it is.

```tsx
const p = {
  duration: 0.24,
  yOffset: 6,
  blur: 4,
}

<span className="inline-flex overflow-hidden">
  <AnimatePresence mode="wait" initial={false}>
```

Delete `useLayoutEffect`, `measureRef`, `widths`, and `currentWidth`, then delete the hidden measurement `<span>` block. Remove `useLayoutEffect` from the React import.

**Why these values:** the content width changes instantaneously, eliminating layout animation; the retained 240ms `cubic-bezier(0.23, 1, 0.32, 1)` word transition is already within the small state-change budget and animates opacity, transform, and only a 4px blur.

## Conventions to follow

- `components/copy-feedback-icon.tsx:28` uses Motion for a small visual state transition without measuring or animating layout.
- Preserve the existing `effectsDisabled` branch from this component, which already disables movement for reduced-motion users and when shaders are off.

## Steps

1. Delete `useLayoutEffect` from the React import.
2. Delete `widthDuration` from `p`.
3. Delete the measurement ref, width state, `useLayoutEffect`, and `currentWidth` declaration.
4. Delete the hidden measurement markup at the start of the returned fragment.
5. Replace the outer `motion.span` with a plain `<span className="inline-flex overflow-hidden">`, and remove its `animate` and `transition` props.
6. Keep `AnimatePresence mode="wait"`, the word's initial/animate/exit values, and the underline timer unchanged.

## Out of scope

- Do not change the selected-word timing, blur amount, vertical offset, 5-second timer, click sound, or underline progress.
- Do not change `AnimatePresence mode="wait"`; its responsiveness is a separate easing finding.
- Do not add CSS width transitions, `layout` props, or another layout-animation technique.

## Verification

**Build**

- [ ] `npm run lint` passes with no unused imports or variables.
- [ ] `npm run build` passes.

**Behavior**

- [ ] The button cycles through every option by click and continues its desktop auto-cycle.
- [ ] The inline layout immediately adopts each word's natural width; the word still enters and exits correctly within its clipped wrapper.
- [ ] In browser performance tooling, clicking no longer produces an animation timeline for `width`.
- [ ] With reduced motion enabled, selection changes immediately as before.

**Feel**

- [ ] Record several consecutive clicks and scrub frame by frame. The text change should feel immediate, with only the word's intended visual transition remaining.
- [ ] Check narrow mobile widths and a late-loading web font; no clipped text or width snap should remain.

## Notes

The immediate wrapper-width change is intentional. If it feels visually abrupt in the surrounding sentence, validate an alternate static-width layout separately, but do not reintroduce an animated layout property.
