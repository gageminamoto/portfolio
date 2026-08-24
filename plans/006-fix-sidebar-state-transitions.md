# 006 — Fix sidebar state transitions

- **Commit:** 1fbaf58
- **Severity:** HIGH
- **Category:** Easing & duration
- **Estimated scope:** 1 file, ~6 lines

## Problem

The sidebar collapses with `ease-linear`, and its rail uses `transition-all`. Linear easing makes a user-triggered state change feel mechanical, while `transition-all` can animate unintended properties.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `components/ui/sidebar.tsx` | 221, 232, 294 | Width/position state changes use `ease-linear`; rail uses `transition-all`. |

### Current code

```tsx
'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear'
'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex'
'... -translate-x-1/2 transition-all ease-linear ...'
```

## Target

Use `duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]` for the two sidebar state transitions. Replace the rail's `transition-all ease-linear` with `transition-[background-color,transform] duration-150 ease`.

**Why these values:** 200ms suits a panel state change, and the strong ease-out responds immediately; 150ms `ease` is appropriate for rail hover feedback.

## Conventions to follow

- `components/timeline-accordion.tsx:225–235` uses the project’s 200ms strong ease-out for a state change.
- `components/writing/article-footer.tsx:33` scopes hover transition properties explicitly.

## Steps

1. Replace both `ease-linear` utilities at lines 221 and 232 with the exact 200ms cubic-bezier utility above.
2. Replace the rail utility exactly as specified; retain all state and positioning classes.
3. Add `motion-reduce:transition-none` to all three elements, since sidebar collapse moves spatially.

## Out of scope

- Do not change sidebar dimensions, placement, Radix state, or breakpoint behavior.
- Do not replace width/left/right transitions in this plan.

## Verification

- [ ] `npm run lint` and `npm run build` pass.
- [ ] Toggle left and right sidebars repeatedly: each state responds promptly and reverses without an unintended property animating.
- [ ] With reduced motion, collapse is immediate.
- [ ] Record a toggle sequence; entry should be fast at the start and settle calmly.
