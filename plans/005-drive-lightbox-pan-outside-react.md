# 005 — Drive lightbox panning outside React

- **Commit:** 1fbaf58
- **Severity:** MEDIUM
- **Category:** Performance
- **Estimated scope:** 1 file, ~24 lines

## Problem

The image lightbox calls `setTranslate` for every pointer-move while panning. Each event re-renders the dialog before rebuilding an inline transform string, which can make a direct-manipulation gesture lag on large images. Gesture position should update a motion value directly and the image should track the pointer 1:1.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `components/writing/image-lightbox.tsx` | 3–4 | React and Framer Motion imports. |
| `components/writing/image-lightbox.tsx` | 24–30 | React translation state and ref. |
| `components/writing/image-lightbox.tsx` | 122–155 | Pointer handlers that update React state on every move. |
| `components/writing/image-lightbox.tsx` | 232–257 | Inline transform string built from React state. |

### Current code

```tsx
// components/writing/image-lightbox.tsx:141
if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
  const newTranslate = clampTranslate(
    translateStart.current.x + dx,
    translateStart.current.y + dy,
    scale
  )
  setTranslate(newTranslate)
}

// components/writing/image-lightbox.tsx:233
<div
  style={{
    transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
    transition: isDragging ? "none" : "transform 0.2s ease-out",
  }}
>
```

## Target

Import `useMotionValue` from `framer-motion`, retain React state only for discrete `scale` and `isDragging` changes, and use direct `x`/`y` motion values for panning.

```tsx
import { motion, useMotionValue, useReducedMotion } from "framer-motion"

const translateX = useMotionValue(0)
const translateY = useMotionValue(0)
const translateStart = useRef({ x: 0, y: 0 })

// Pointer down
translateStart.current = { x: translateX.get(), y: translateY.get() }

// Pointer move after the existing 3px threshold
translateX.set(newTranslate.x)
translateY.set(newTranslate.y)

<motion.div
  style={{ x: translateX, y: translateY, scale }}
  transition={{ type: "tween", duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
>
```

Set both motion values to `0` in every existing reset path: `resetZoom`, wheel zoom reaching scale `1`, and any source-change reset. During active dragging, keep the existing `isDragging` state only to choose a zero-duration transition; do not call React state setters for x/y values.

**Why these values:** direct motion values avoid React renders at pointer frequency; `0.2s` with the project's existing lightbox ease-out preserves the current settle behavior when panning stops; x/y are composited transforms and track the gesture directly while dragging.

## Conventions to follow

- `components/pokemon-cards.tsx:242–251` demonstrates the repository's use of `useMotionValue` for pointer-driven transform state.
- `components/writing/image-lightbox.tsx:166–225` is the local exemplar for the existing `0.2s` lightbox opacity and `0.3s` content entrance curves. Preserve those values.

## Steps

1. Add `useMotionValue` to the Framer Motion import.
2. Replace `translate` React state with `translateX` and `translateY` motion values initialized to zero. Keep `translateStart` as a numeric ref.
3. Update `resetZoom` and the wheel handler's `next <= 1` branch to set both motion values to `0`.
4. On pointer down, capture `translateX.get()` and `translateY.get()` in `translateStart`.
5. On pointer move, retain the 3px drag threshold and clamp calculation, but call `translateX.set(newTranslate.x)` and `translateY.set(newTranslate.y)` instead of `setTranslate`.
6. Replace the inner plain `<div>` with `<motion.div>` using `style={{ x: translateX, y: translateY, scale }}`. Set its transition to `{ duration: isDragging ? 0 : 0.2, ease: [0.25, 0.46, 0.45, 0.94] }`.
7. Ensure React still re-renders only for zoom-step changes, load state, and the boolean drag threshold.

## Out of scope

- Do not change zoom bounds (`1` through `4`), wheel step (`0.5`), click zoom (`2.5`), drag threshold (`3px`), keyboard handling, or focus behavior.
- Do not introduce a spring for pointer tracking; the pan must remain direct.
- Do not change the lightbox overlay or image entrance/exit animations.

## Verification

**Build**

- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.

**Behavior**

- [ ] Click and wheel zoom retain current limits and reset to the centered image at scale `1`.
- [ ] Dragging a zoomed image honors existing bounds and does not trigger a click-to-reset afterwards.
- [ ] Escape, backdrop click, and close button retain their current zoom-reset and close behavior.

**Feel**

- [ ] Record a fast drag across a large image and scrub frame by frame. The image should remain under the pointer, without catching up after it.
- [ ] Profile a continuous drag: React should not render the dialog once per pointer-move event.
- [ ] Test touch panning on a real device and confirm the 200ms settle only occurs after release.

## Notes

Motion's x/y values compose transforms with its scale value. Confirm visually that the resulting transform order preserves the current pan bounds; if it differs, retain the existing mathematical division by scale when writing x/y values, but still keep the updates outside React.
