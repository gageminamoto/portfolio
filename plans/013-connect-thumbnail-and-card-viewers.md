# 013 — Connect thumbnails to their viewers

- **Commit:** 1fbaf58
- **Severity:** MEDIUM
- **Category:** Cohesion, hierarchy & spatial consistency
- **Estimated scope:** 3 files, ~80 lines

## Problem

An article image opens into a centered lightbox (`components/writing/notion-image.tsx:37–62`; `components/writing/image-lightbox.tsx:221–225`), and a Pokémon fan card opens into a centered modal (`components/pokemon-cards.tsx:568–618, 640–644`). Both lose the originating object’s position, so the viewer appears unrelated to the selected image/card.

## Target

Use Framer Motion shared layout IDs, already available in the repository. On the triggering inline image/card and its matching viewer image/card, assign a deterministic `layoutId`: `lightbox-image-${src}` for article images and `pokemon-card-${card.id}` for Pokémon cards. Wrap the active source and target in `motion` elements, preserve each source’s existing position/size styles, and use one shared transition: `{ type: "tween", duration: 0.3, ease: [0.23, 1, 0.32, 1] }`. Under `useReducedMotion()`, omit `layoutId` and use the existing 150ms opacity-only behavior.

## Conventions to follow

- `components/writing/image-lightbox.tsx:166–225` provides the current overlay and content motion boundary.
- `components/pokemon-cards.tsx:374–400` provides the current modal card motion boundary.

## Steps

1. Thread the inline image source identifier from `NotionImage` to `ImageLightbox`, and apply the same layout ID to the visible image target.
2. In Pokémon cards, add the shared ID to the selected fan card and pass its ID into `Card3DModal`; apply it to the modal card wrapper.
3. Ensure overlay opacity remains independently animated and that source cards/images retain their original transform origins.
4. Branch layout IDs off under reduced motion.

## Out of scope

- Do not change image sizes, modal semantics, zoom/pan behavior, card data, or existing no-preference spring parameters beyond the shared-layout transition.

## Verification

- [ ] Lint and build pass.
- [ ] Opening and closing an article image visibly expands toward/from its source.
- [ ] Selecting and dismissing a Pokémon card preserves its fan-card identity.
- [ ] Rapid selection changes do not leave orphaned layout elements.
- [ ] With reduced motion, viewers use opacity only and no spatial expansion.
- [ ] Record desktop and touch interactions, then scrub transitions frame by frame.

## Notes

Shared-layout continuity must be checked visually because portal stacking and the lightbox image loading state may prevent a direct handoff. If the source unmounts too early, retain an invisible source placeholder until the layout transition completes.
