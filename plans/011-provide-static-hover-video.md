# 011 — Provide a static hover-video fallback

- **Commit:** 1fbaf58
- **Severity:** MEDIUM
- **Category:** Accessibility
- **Estimated scope:** 2 files, ~15 lines

## Problem

`HoverLink` autoplays looping MP4 previews at `components/hover-link.tsx:69–77`, including the Mizen preview selected by `components/bio-section.tsx:89–95`. There is no reduced-motion path.

## Target

Add optional `previewFallbackImage?: string` to `HoverLinkProps`; call `useReducedMotion()`. When `previewIsVideo && prefersReducedMotion`, render Next `Image` with `src={previewFallbackImage}` instead of `<video>`. For Mizen, pass `previewFallbackImage="/projects/mizen.png"` from `BioSection`. Keep the same 256×144 size, `alt=""`, and classes. Do not autoplay, loop, or render video under reduced motion.

## Conventions to follow

- `components/writing/image-lightbox.tsx:18–19` is the local `useReducedMotion` import pattern.
- `HoverLink` image preview at `components/hover-link.tsx:80–86` is the exact static-preview markup to copy.

## Steps

1. Add the prop and hook.
2. Branch the video preview as specified, using the existing image markup for the fallback.
3. Pass the Mizen fallback from `BioSection`.

## Out of scope

- Do not alter non-video previews or desktop no-preference video behavior.

## Verification

- [ ] Lint and build pass.
- [ ] Mizen preview loops on no-preference desktop hover.
- [ ] With reduced motion, Mizen shows `/projects/mizen.png` and no video request/autoplay occurs.
