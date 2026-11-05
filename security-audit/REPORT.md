# Security audit report: gageminamoto/portfolio

**Result:** 0 confirmed findings, 13 leads that need owner validation, and 0 rejected candidates.

## 1. Run scope and method

| | |
|---|---|
| Method | Cloudflare `security-audit` skill, full-audit mode, all six phases |
| Profile | `standard` |
| Source ref | `35e443389c50505efe5dcf83fa6b917b44ded302` on `main`, clean worktree. The clone was shallow, so git-history review covered only the last 57 commits. |
| Scope | All application source (`app/`, `components/`, `contexts/`, `hooks/`, `lib/`), `next.config.mjs`, manifests and lockfiles, `.npmrc`, `scripts/`, `.github/` |
| Out of scope | None. Static assets under `public/` were not reviewed as code. |
| Budget | None set. Agents spent: 4 reconnaissance, 8 hunters over 3 waves, 5 coverage critics (3 post-wave, 2 final-clean), 13 candidate verifiers, 13 final-record verifiers. |
| Prior runs | None. This is the first audit, so nothing was carried over or excluded. |

**Execution boundary.** This was a source-first audit limited to source review and local sandbox checks. Nothing was sent to the deployed site, to Notion, GitHub, or AWS, or to any other external service.

Small harnesses built from repository code ran inside a local OS sandbox with these limits:
- separate mount, network, and process namespaces, with no external network;
- every mount read-only except a per-agent scratch directory;
- an empty environment;
- CPU, memory, process, file-size, and wall-clock limits.

Decisive output files were copied into the audit directory by a separate trusted step. That step refuses symlinks, special files, and oversized files.

`node_modules` was absent and dependencies were **not** installed. Behaviour that depends on Next.js, sharp, `accept-md-runtime`, or `@notionhq/client` was therefore not observed. Every candidate that depends on it is recorded as `needs_validation`, not `confirmed`.

**Deferred coverage:** none. All 22 coverage units were closed with recorded evidence.

## 2. Security posture

This is a public, read-only portfolio site. It has no accounts, sessions, forms, cookies, or state-changing endpoints, so the usual high-impact web classes do not apply here: account takeover, CSRF, and stored XSS against other users.

The real exposure is the server-side credentials the site holds (the Notion integration key and an optional GitHub token) and its server compute. The leads that matter most are:

- **Notion data exposure.** The writing routes may let anyone read Notion content the site never intended to publish. One route accepts any Notion page ID, and both writing routes send back the raw block tree, not just what the page renders.
- **Private GitHub data.** If production sets `GITHUB_TOKEN` with private-repo access, the commit-history API may leak private repository names and commit messages.
- **Open image proxy.** The image proxy's host allowlist is broad enough to work as an open image proxy.

Each of these depends on a setting or third-party behaviour that only the owner can check.

Client-side code is in good shape:
- no `dangerouslySetInnerHTML` on untrusted data;
- no `postMessage` handlers;
- static navigation targets;
- secrets read only on the server, with client components using type-only imports.

## 3. Confirmed findings

None.

## 4. Confirmed finding details

None. See [FINDINGS-DETAIL.md](FINDINGS-DETAIL.md).

## 5. Needs validation

These leads have no severity and are **not confirmed vulnerabilities**. They are listed in suggested priority order. Full traces, evidence, and owner-run checks are in [NEEDS-VALIDATION.md](NEEDS-VALIDATION.md).

| # | Lead | Where | What blocks confirmation | Bounded local next step | Safe owner check |
|---|---|---|---|---|---|
| 1 | Writing slug fallback serves **any Notion page the integration can read**, not only blog posts. It also serves trashed posts. | `lib/notion.ts:233` → `app/api/writing/[slug]/route.ts:23`, `app/writing/[slug]/page.tsx:29` | Which pages the Notion integration is connected to; whether Notion returns trashed pages | Mocked-client test: a page whose parent is not the blog data source, or `in_trash: true`, must return null | Request a throwaway non-blog page ID and a trashed test post on a preview build |
| 2 | Commit-history API can expose **private repo names, commit messages, and URLs** when `GITHUB_TOKEN` is set | `lib/github.ts:24-25,48,67,127` → `app/api/commits/history/route.ts:12` | Whether production sets `GITHUB_TOKEN`, and its scopes | Already reproduced with a mocked fetch: private fixtures pass through unfiltered | Check token scopes; compare `/api/commits/history` repo names against your public repos |
| 3 | Writing API and page payload include the **raw recursive Notion block tree**: unrendered sub-pages, attachment URLs, editor IDs | `lib/notion.ts:545,554` → `app/api/writing/[slug]/route.ts:23`, `app/writing/[slug]/article-content.tsx:57` | Notion API child-page behaviour; whether live posts contain unpublished sub-content | Harness with a dummy client already shows the leak. Add a projection step and assert it removes the leaked content | Test post with a marker sub-page and a PDF; search the JSON and RSC payload for them |
| 4 | Image proxy allowlist trusts the **shared S3 host** `s3.us-west-2.amazonaws.com`, so it may accept any bucket | `lib/image-url.ts:5,9` → `app/api/image/route.ts:41,61` | Whether AWS serves other customers' public objects at that path-style host | Allowlist accepts any bucket, `http:`, and other ports (shown locally) | One request for an object in a throwaway bucket on a preview build |
| 5 | Image proxy **follows redirects** without re-checking the allowlist | `app/api/image/route.ts:24,41` | Whether any allowlisted host issues attacker-steerable redirects | Plain Node fetch with the same call shape followed a cross-host 302 locally | Look for open redirects on the allowlisted hosts; check function egress logs |
| 6 | Markdown route builds its **fetch target from the request origin** and an unnormalized path, then caches publicly | `app/api/accept-md/[[...path]]/route.ts:35-46,53` | `accept-md-runtime` URL-join and cache key; Vercel Host / `X-Forwarded-Host` handling | `new URL()` turns `//host` or `\host` paths into another origin (shown locally) | Request `/about.md` with a spoofed `X-Forwarded-Host` on a preview build |
| 7 | Shared in-process **markdown cache may not be keyed on origin** | `app/api/accept-md/[[...path]]/route.ts:8,42,44` | `accept-md-runtime` cache-key code (not installed) | Read the package; harness calling it with two different `baseUrl` values | Same preview check as #6 |
| 8 | HTML and markdown share one publicly cached URL, **separated only by `Vary: Accept`** | `next.config.mjs:20-29,37`; `app/api/accept-md/[[...path]]/route.ts:50-55` | Whether the Vercel CDN and Next.js keep and honour `Vary: Accept` on both variants | Offline `next start`: compare headers for both Accept values | Request a cache-busted URL with markdown Accept, then browser Accept; check the `x-vercel-cache` header |
| 9 | Image proxy reads upstream bodies of **any size, with no time limit**, and decodes with only sharp's default pixel limit | `app/api/image/route.ts:42,51,53` | sharp default limits; Vercel function memory and duration | Measure the route pipeline on a small, high-dimension image | Review function limits; add a byte cap, keep the timeout through decode, set `limitInputPixels` |
| 10 | Repeated `.md` suffixes may make the markdown route **fetch itself in a nested chain** | `next.config.mjs:16-17`; `app/api/accept-md/[[...path]]/route.ts:35-42` | `accept-md-runtime` behaviour; Vercel loop detection | Offline `next start`, one request to `/a.md.md.md` with fetch logging | One request to `/index.md.md` on preview; count function invocations |
| 11 | Random writing slugs trigger an **uncached full Notion scan** per request | `lib/notion.ts:200,221,227,233`; `app/writing/[slug]/page.tsx:78` | Notion rate limit and SDK retries; any Vercel WAF rules | Harness shows 1 + ceil(N/100) + 1 calls per miss | Count Notion calls per random slug on preview, rate-capped |
| 12 | Commit-history API spends **7 or more GitHub API calls of the owner's token per request**, uncached | `app/api/commits/history/route.ts:4`; `lib/github.ts:48,97,127` | Whether the token is shared with other tooling; WAF rules; Next.js fetch caching | Harness shows 7 authenticated calls per request, no reuse | Compare `X-RateLimit-Remaining` before and after two requests |
| 13 | Image optimizer accepts **unlimited distinct favicon URLs** (no `search` constraint) | `next.config.mjs:48-52` | Next.js remotePatterns matching; how Vercel bills image optimization | Run the framework matcher offline against two different query strings | Check image-optimization source counts in the Vercel dashboard |

**Common fix themes:**
- In `fetchPostBySlug`, check that the page belongs to the blog database before returning it, and only call `pages.retrieve` for UUID-shaped slugs.
- Return only the block types and fields the page renders.
- Filter GitHub results to public repos and events, cache the route, and use a dedicated minimal-scope token.
- Narrow the image allowlist to specific bucket paths, require `https:`, and handle redirects manually with a re-check on each hop.
- Cap image download size and keep the timeout running through decode.
- Pin the markdown route's `baseUrl`, normalize its path, stop forwarding all request headers, and reject nested `.md` paths.

## 6. Hardening notes and positive patterns

Hardening (not findings; there is no demonstrated boundary violation today):

**Headers and third-party scripts**
- `app/layout.tsx:73` loads `https://inflight.co/widget.js` on every page with no Subresource Integrity, and no Content-Security-Policy is set anywhere. A CSP limiting `script-src` would contain a vendor compromise.
- No `frame-ancestors` or `X-Frame-Options` is set. There is nothing state-changing to clickjack today.

**Markdown route**
- `/api/accept-md` returns library `error.message` verbatim (`route.ts:59-63`). Prefer a fixed generic message.
- `/api/accept-md` forwards every inbound header, cookies included, to its self-fetch. Forward an allowlist instead.
- The markdown rewrite matches `text/markdown` anywhere in the Accept header, even at a low q-value.

**Notion data and links**
- Notion tool URLs and rich-text links are not passed through the `http`/`https` check (`normalizeExternalUrl`) that early-design links use. Today only owner authorship and React 19's blocking of `javascript:` URLs protect them.
- The blog list has no Published or Status filter, so every non-trashed page in the blog database is public.
- `/api/tools` is force-dynamic and re-queries Notion on every request; it could reuse the 600s cache.

**Image handling**
- `lib/image-metadata.ts:24-30` sends a 64 KiB `Range` header but still reads the whole body with no cap. Its input is owner Notion content.
- `/api/image` caches Notion signed-URL images as immutable for a year, so removed images stay served from the CDN.
- A negative `w` parameter is not clamped, so sharp throws and the route returns 500.

**Server code**
- `lib/notion.ts` and `lib/github.ts` read secrets but don't `import "server-only"`.
- `lib/github.ts` has no per-fetch timeout and runs its per-repo calls one after another.
- Leftover `[v0]` `console.log` lines remain in the commit-history path.

**Build and supply chain**
- `pnpm-lock.yaml` is stale: it is missing `accept-md-runtime`, the `nucleo-ui-*` packages, and `torph`. Together with `.npmrc` `frozen-lockfile=false`, a pnpm-based build would re-resolve versions.
  - Remove the stale lockfile, drop `frozen-lockfile=false`, and pin `packageManager`.
- `@nicepkg/gpt-runner` is a production dependency that is never imported and pulls in a large dependency tree.
- `scripts/install-framer-motion.*` are unused v0 leftovers.
- `typescript.ignoreBuildErrors: true` lets type errors ship.
- `.gitignore` covers `.env*.local` but not plain `.env` files.

Positive patterns found:

**Secrets**
- Secrets are read only in server modules.
- Client components use `import type` from `lib/notion` and `lib/github`.
- The only `NEXT_PUBLIC_` variable is a non-secret flag.
- No secrets were found in tracked files or in the reviewed history.

**Client-side code**
- Early-design URLs are restricted to `http`/`https` (checked locally against `javascript:`, `data:`, and `vbscript:` variants).
- Case-study hash routing resolves only to known slugs (checked locally).
- External `window.open` uses `noopener,noreferrer`.

**Server routes and build**
- Dev-only tooling (Agentation, DialKit) is gated on `NODE_ENV === "development"`.
- No `eval`, `child_process`, or dynamic code runs in app code.
- No CORS headers, cookies, or server-side redirect sinks exist.
- `package-lock.json` resolves all 720 entries from the npm registry with integrity hashes. Only `sharp` and `unrs-resolver` have install scripts.

## 7. Coverage summary

- **Units:** 22 coverage units: 9 `covered` and 13 `candidate`, with 0 blocked, 0 deferred, and 0 out of scope.
- **Waves:**
  - Wave 1 (14 units) was seeded from reconnaissance.
  - Wave 2 (6 units) came from the first post-wave critic.
  - Wave 3 (2 units) came from the first final-clean critic.
- **Critics:** the post-wave-3 critic and a second, separate final-clean critic both returned no missing units and no reassignments, so the coverage loop ended clean.
- **Validation:** every candidate went to a fresh verifier that did not hunt it (13 of 13), then to a second, fresh record verifier. That second pass verified 9 records as-is and made non-material wording or line-number corrections to 4.
- **Excluded companion domains:**
  - memory safety: no native code;
  - AI/LLM: no model integration; `@nicepkg/gpt-runner` is never imported;
  - protocols/RPC: no RPC or brokers;
  - desktop/mobile/local IPC: none;
  - cloud/deployment: no infrastructure-as-code. Deployment facts are recorded as blockers instead.
- **Known gaps** for a future run:
  - dependency internals (`accept-md-runtime`, Next.js image and fetch behaviour) were not readable;
  - known-CVE status of the locked dependency versions was not checked offline;
  - git history was shallow.

One pass does not exhaust the target. A follow-up run should take the [NEEDS-VALIDATION.md](NEEDS-VALIDATION.md) owner checks and the unblocked dependency source as input.
