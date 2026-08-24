# 001 — Scope shared button transitions

- **Commit:** 1fbaf58
- **Severity:** HIGH
- **Category:** Easing & duration
- **Estimated scope:** 1 file, ~3 lines

## Problem

Every shared `Button` currently declares `transition-all`, so unrelated properties can animate whenever a consumer changes them. That can animate layout or paint properties unintentionally. Shared controls are high-frequency surfaces, and the animation rule is to transition only the properties that actually need motion.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `components/ui/button.tsx` | 7–8 | Base CVA class string with `transition-all` and `active:scale-[0.97]`. |

### Current code

```tsx
// components/ui/button.tsx:7
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 ...",
)
```

## Target

Replace only `transition-all` with this explicit Tailwind transition declaration. Keep `active:scale-[0.97]` unchanged.

```tsx
"... font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease active:scale-[0.97] ..."
```

**Why these values:** `150ms` is within the button-press budget; `ease` is appropriate for color/background feedback; `transform` retains the existing press response while the other listed properties cover the current button variants without permitting layout transitions.

## Conventions to follow

- `components/writing/article-footer.tsx:33` uses the same explicit `color,background-color,transform` pattern with `duration-150 ease`.
- Keep the existing Tailwind utility style and single CVA base string.

## Steps

1. In `components/ui/button.tsx`, replace the sole `transition-all` utility in `buttonVariants` with `transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease`.
2. Do not add a transition utility to individual variants. The base class must remain the single source of this shared behavior.
3. Confirm the link variant still overrides press scale with `active:scale-100`.

## Out of scope

- Do not alter colors, dimensions, focus rings, variants, or the `active:scale-[0.97]` value.
- Do not change other `transition-all` occurrences; they require separate audits.
- Do not introduce a new animation library or global token system.

## Verification

**Build**

- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.

**Behavior**

- [ ] Default, outline, secondary, ghost, destructive, and link buttons retain hover colors and focus-ring changes.
- [ ] A pointer press still scales non-link buttons to `0.97`.
- [ ] Inspect the computed `transition-property`: it lists color, background-color, border-color, box-shadow, and transform, never `all`.

**Feel**

- [ ] Record a rapid hover and press on each visual button variant. Color and press feedback should settle within about 150ms without any width, padding, or layout movement.
- [ ] Check with `prefers-reduced-motion: reduce`; this plan must preserve the repository's reduced-motion behavior pending plan 004.

## Notes

The audit cannot determine every downstream consumer's custom class. If a consumer relies on a transition for an unlisted property, add that property only after proving it is visual and safe to animate.
