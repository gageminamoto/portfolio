# 007 — Speed up sheet entry

- **Commit:** 1fbaf58
- **Severity:** MEDIUM
- **Category:** Easing & duration
- **Estimated scope:** 1 file, ~2 lines

## Problem

A tapped sheet uses `ease-in-out` and a 500ms opening transition. A symmetric slow start reads as input lag on a user-triggered panel.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `components/ui/sheet.tsx` | 61–69 | Shared Radix sheet classes. |

### Current code

```tsx
'... shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500'
```

## Target

Replace that portion with:

```tsx
'... shadow-lg transition [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:duration-200 data-[state=open]:duration-350 motion-reduce:transition-opacity motion-reduce:duration-150'
```

**Why these values:** 350ms allows a full-height sheet to travel while the Vaul curve front-loads movement; 200ms exit respects a completed dismissal; reduced motion keeps opacity feedback for 150ms.

## Conventions to follow

- `lib/animations.ts:41–45` keeps product entrances under 300ms with a strong ease-out; this sheet is larger and needs 350ms.

## Steps

1. Replace only the sheet transition utilities with the Target string.
2. Under reduced motion, remove every `slide-*` class using `motion-reduce:transform-none`; retain fade classes.

## Out of scope

- Do not change sheet sides, dimensions, overlay, focus behavior, or close button.

## Verification

- [ ] Lint and build pass.
- [ ] Open and close every sheet side; opening responds immediately and closing is visibly shorter.
- [ ] With reduced motion, the sheet fades without travel.
- [ ] Test repeated open-close and a real touch device.
