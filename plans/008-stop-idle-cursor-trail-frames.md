# 008 — Stop idle cursor-trail frames

- **Commit:** 1fbaf58
- **Severity:** MEDIUM
- **Category:** Performance
- **Estimated scope:** 1 file, ~20 lines

## Problem

`CursorTrail` schedules `requestAnimationFrame(draw)` unconditionally at `components/cursor-trail.tsx:82`, including after its 800ms idle fade reaches opacity zero. The invisible canvas continues clearing and redrawing forever.

## Target

Add `drawingRef = useRef(false)` and helpers `startDrawing()` and `stopDrawing()`. `startDrawing()` must only schedule a frame when `drawingRef.current` is false; `stopDrawing()` must cancel `rafRef.current`, set it to `0`, and set `drawingRef.current` false. At the end of `draw()`, schedule the next frame only while `fadeRef.current > 0`; otherwise call `stopDrawing()`. In `onPointerMove`, set `fadeRef.current = 1`, set `fadingRef.current = false`, then call `startDrawing()`.

Keep `FADE_AFTER_IDLE_MS = 800`, fade decrement `0.04`, fade-in increment `0.08`, points, colors, and canvas dimensions unchanged.

## Conventions to follow

- `components/cursor-trail.tsx:101–105` already cancels the frame on effect cleanup; extend that exact cleanup behavior.

## Steps

1. Add the boolean ref and helpers inside the current effect, before `draw`.
2. Replace the unconditional initial request and end-of-draw request with `startDrawing()` and the conditional continuation described above.
3. Call `startDrawing()` from pointer movement after inserting the point.
4. Use `stopDrawing()` in cleanup after clearing the timer.

## Out of scope

- Do not change visual trail geometry, colors, touch behavior, or the reduced-motion null render.

## Verification

- [ ] Lint and build pass.
- [ ] The first pointer move after idle immediately restarts the trail.
- [ ] In performance tooling, rAF activity stops after the fade reaches zero and resumes only on movement.
- [ ] Record a fade-out to confirm no visual discontinuity.
