# 010 — Simplify the Tools page entrance

- **Commit:** 1fbaf58
- **Severity:** MEDIUM
- **Category:** Cohesion, hierarchy & spatial consistency
- **Estimated scope:** 2 files, ~25 lines

## Problem

`app/tools/page.tsx:238–291` applies an entrance to the search/filter/list container, then a second entrance to each child, then a row stagger. This stacks multiple entrances and delays readable tools content.

## Target

Retain the page-level `item` entrance and use exactly one Tools-block entrance: `toolsPanelEnter` at `lib/animations.ts:36–48` should be `{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.26, ease: [0.215, 0.61, 0.355, 1] } } }`. In `app/tools/page.tsx`, retain `variants={toolsPanelParent}` only on line 239 and remove `variants={toolsPanelPiece}` from search, filters, and loading/error content. Remove `toolRowStagger` and `toolRowItem` variants from initial rendering; rows render with the parent already visible.

## Conventions to follow

- `lib/animations.ts:16–25` is the simple one-element fade reference.

## Steps

1. Remove `staggerChildren` and `delayChildren` from `toolsPanelEnter`.
2. Remove child and row variant assignments and unused imports/constants from `app/tools/page.tsx`.
3. Preserve no-motion behavior when `shouldReduceMotion` is true.

## Out of scope

- Do not change search, filters, data loading, card/list layout, or no-preference curve/duration.

## Verification

- [ ] Lint and build pass.
- [ ] On first load, the entire Tools block enters once; rows are immediately readable and interactive.
- [ ] Reduced-motion behavior remains static.
- [ ] Record page load and confirm no stagger wave remains.
