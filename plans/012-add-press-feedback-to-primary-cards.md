# 012 — Add press feedback to primary cards

- **Commit:** 1fbaf58
- **Severity:** LOW
- **Category:** Missed opportunities
- **Estimated scope:** 2 files, ~4 lines

## Problem

Case-study cards, project cards, and carousel controls have hover feedback but no received-click feedback.

## Target

Add `active:scale-[0.97]` to the pressable anchor/button, never to a hover target that changes its own hitbox. Use the existing 150ms transform transition. Apply it to `components/work-section.tsx:743`, `components/work-section.tsx:792`, `components/work-section.tsx:822`, and the absolute project link at `components/project-card.tsx:110` while moving the parent’s hover lift to `group-hover` so it remains visually coordinated.

## Conventions to follow

- `components/ui/button.tsx:8` and `app/writing/[slug]/article-actions.tsx:34` use the exact `active:scale-[0.97]` value.

## Steps

1. Add the active scale to each direct interactive element.
2. Ensure the card parent has `group` and its hover visual classes use `group-hover:` where necessary.
3. Do not add transition classes if the element already inherits one; otherwise add `transition-transform duration-150 ease`.

## Out of scope

- Do not alter hover lift, card dimensions, carousel navigation logic, or keyboard focus behavior.

## Verification

- [ ] Lint and build pass.
- [ ] Each control contracts only to 0.97 while held, then releases cleanly.
- [ ] Test mouse, keyboard activation, and touch; no hover flicker or layout shift occurs.
