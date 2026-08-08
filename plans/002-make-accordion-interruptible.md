# 002 — Make accordion expansion interruptible

- **Commit:** 1fbaf58
- **Severity:** HIGH
- **Category:** Interruptibility & springs
- **Estimated scope:** 1 file, ~8 lines

## Problem

The shared accordion maps open and closed state to CSS keyframes. When a user toggles it again before the first transition ends, a keyframe restarts from its first frame instead of retargeting from its current state. Accordion content should be reversible and interruptible.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `components/ui/accordion.tsx` | 50–62 | Radix content using `animate-accordion-up` and `animate-accordion-down`. |

### Current code

```tsx
// components/ui/accordion.tsx:56
<AccordionPrimitive.Content
  data-slot="accordion-content"
  className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
  {...props}
>
  <div className={cn('pt-0 pb-4', className)}>{children}</div>
</AccordionPrimitive.Content>
```

## Target

Use a CSS grid-row transition, which retargets from its current computed value. Replace the content class and add `min-h-0` to its inner wrapper.

```tsx
<AccordionPrimitive.Content
  data-slot="accordion-content"
  className="grid overflow-hidden text-sm transition-[grid-template-rows,opacity] duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] data-[state=closed]:grid-rows-[0fr] data-[state=closed]:opacity-0 data-[state=open]:grid-rows-[1fr] data-[state=open]:opacity-100 motion-reduce:transition-opacity motion-reduce:duration-150"
  {...props}
>
  <div className={cn('min-h-0 pt-0 pb-4', className)}>{children}</div>
</AccordionPrimitive.Content>
```

**Why these values:** `200ms` is appropriate for an accordion; `cubic-bezier(0.23, 1, 0.32, 1)` is the repo's strong ease-out used for expanding UI; `0fr` to `1fr` reveals natural content height without keyframes; reduced motion retains a 150ms opacity indication and removes the height movement.

## Conventions to follow

- `components/timeline-accordion.tsx:225` is the existing product-specific accordion reference for 200ms height and 150ms opacity timing.
- `components/ui/button.tsx:8` demonstrates existing `motion-reduce:` utility use is acceptable in shared primitives.

## Steps

1. Replace the `animate-accordion-up/down` class string with the exact target class string.
2. Add `min-h-0` to the inner content `<div>` so the `0fr` closed grid row can collapse.
3. Do not change `AccordionTrigger`; its chevron remains a separate 200ms transform transition.

## Out of scope

- Do not change Radix accordion state management or install a motion package.
- Do not alter padding, typography, trigger layout, or chevron rotation.
- Do not modify the product-specific timeline accordion.

## Verification

**Build**

- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.

**Behavior**

- [ ] Opening reveals all content and closing removes it from layout.
- [ ] Toggle the same item rapidly five times: its height reverses from the in-flight position, without a jump to fully closed or open.
- [ ] With `prefers-reduced-motion: reduce`, height changes immediately while opacity communicates the state over 150ms.

**Feel**

- [ ] Record a rapid open-close-open sequence and scrub it frame by frame. The content should track the reversal continuously and settle cleanly.
- [ ] Check a long accordion body and a one-line body at desktop and mobile widths.

## Notes

Confirm browser support for grid-template-row interpolation in the project's supported browsers. If a supported browser fails it, use a measured CSS `height` transition that preserves the same 200ms curve and interruptibility.
