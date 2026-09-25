# Agent instructions

This repository is the Negi Studio portfolio site (Next.js). When you open a pull request, follow the shared PR format and writing guidelines below.

## Pull requests

Use [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md) as the structure for PR titles and bodies. GitHub pre-fills the body from that file; **remove the HTML comment and the placeholder line** before submitting.

### Writing guidelines

- **Title:** Short and direct—state what changed.
- **Length:** Keep the description proportional to the change. Small fixes may need only two or three sentences.
- **Story:** Start with the specific problem or user need; explain what changed and the result in plain language.
- **Context:** Customize to this PR. Do not paste the full issue or reuse a generic blurb.
- **Linear:** Reference relevant Linear issues in the flow of the explanation. Use closing language (e.g. “Fixes …”) only when this PR actually completes the issue.
- **Links and media:** Put useful links beside the statement they support.
- **Visual proof (required for visible changes):** If the change is visible in the product UI—layout, styling, copy on a page, components that render, OG/social preview images, animations, or anything reviewers can see on a page or preview deployment—you **must** embed at least one screenshot or short demo/video of the **actual result** in the PR body. Backend-only or non-visible work (API routes, data fetching, config, CI, dependencies, pure logic with no UI) does **not** require visual proof. For fixes or redesigns, prefer before/after when it clarifies the change.
- **Cursor cloud agents:** Capture screenshots or a short screen recording of the changed UI (e.g. local dev or preview) and embed them in the PR description. Enable **Allow posting artifacts to GitHub** in the Cloud Agents dashboard so artifacts appear in PRs.
- **Open questions:** Mention them only when reviewers need to decide something.

Do not add extra checklist sections to the PR body unless the team asks for them.
