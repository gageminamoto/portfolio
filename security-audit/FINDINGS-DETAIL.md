# Findings detail

This file gives full reproduction detail for each **confirmed** finding rated medium, high, or critical.

**This run has no confirmed findings,** so there is nothing to detail here.

All 13 candidates that survived hunting ended up `needs_validation` after independent validation and a second, fresh record review. In every case the deciding fact is one of these:

- a deployment setting (which env vars and token scopes production uses, Vercel caching and Host handling);
- third-party behaviour (Notion, GitHub, AWS S3, and redirects on the allowlisted image hosts);
- dependency code that is not installed (`accept-md-runtime`, `next`, `sharp`, `@notionhq/client`).

None of these can be observed from source or from a local, network-free sandbox. The audit did not install dependencies or probe the live site.

Each lead's full trace, the exact blocker, and safe owner-run checks are in [NEEDS-VALIDATION.md](NEEDS-VALIDATION.md). After the owner resolves a blocker, a lead can be re-run through validation. If it is confirmed then, its reproduction detail belongs here.
