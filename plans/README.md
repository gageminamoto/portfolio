# Animation execution plans

Audited at commit `1fbaf58`.

| Plan | Status | Execute after | Rationale |
| --- | --- | --- | --- |
| [001 — Scope shared button transitions](001-scope-shared-button-transitions.md) | DONE | None | Removes unsafe shared `transition-all` behavior. |
| [002 — Make accordion expansion interruptible](002-make-accordion-interruptible.md) | DONE | None | Replaces restart-prone accordion keyframes. |
| [003 — Remove layout animation from word switching](003-remove-word-width-animation.md) | DONE | None | Removes per-frame width layout work on a prominent interaction. |
| [004 — Replace the global reduced-motion reset](004-replace-global-motion-reset.md) | DONE | 002 | Makes each surface responsible for meaningful reduced motion. |
| [005 — Drive lightbox panning outside React](005-drive-lightbox-pan-outside-react.md) | DONE | None | Keeps direct image dragging out of React's render path. |
| [006 — Fix sidebar state transitions](006-fix-sidebar-state-transitions.md) | DONE | 001 | Applies explicit-property and responsive easing rules to the sidebar. |
| [007 — Speed up sheet entry](007-speed-up-sheet-entry.md) | DONE | 004 | Gives sheets a responsive entry and a fade-only reduced-motion state. |
| [008 — Stop idle cursor-trail frames](008-stop-idle-cursor-trail-frames.md) | DONE | None | Stops invisible canvas work after the cursor trail fades. |
| [009 — Add Pokémon card reduced-motion behavior](009-add-pokemon-reduced-motion.md) | DONE | 004 | Makes the motion-heavy hobby interaction safe under reduced motion. |
| [010 — Simplify the Tools page entrance](010-simplify-tools-page-entrance.md) | DONE | None | Removes stacked parent, child, and row entrances. |
| [011 — Provide a static hover-video fallback](011-provide-static-hover-video.md) | DONE | 004 | Replaces reduced-motion autoplay video with a static preview. |
| [012 — Add press feedback to primary cards](012-add-press-feedback-to-primary-cards.md) | DONE | 001 | Adds subtle press confirmation using the shared button convention. |
| [013 — Connect thumbnails to their viewers](013-connect-thumbnail-and-card-viewers.md) | DONE | 005, 009 | Restores object continuity when images and cards open into viewers. |
| [014 — Use explicit hover-animation easing](014-use-explicit-hover-easing.md) | DONE | None | Aligns the pot-lid hover effect with the project easing convention. |

Recommended execution order: 001, 002, 003, 005, 008, 010, 012, 014, then 004, 006, 007, 009, 011, and 013. Plan 004 depends on plan 002 because the accordion needs an opacity-only reduced-motion variant before the universal reset is removed.

Run lint and production build after each plan. Perform the plan-specific interaction and real-device feel checks before marking its status `DONE`.
