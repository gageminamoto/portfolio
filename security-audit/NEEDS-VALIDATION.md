# Needs validation

These are source-grounded leads whose decisive fact is outside the repository (deployment settings, token scopes, third-party behaviour) or inside a dependency that was not installed. They have **no severity** and are **not confirmed vulnerabilities**. They are listed in suggested priority order, based on what would be exposed if the blocker resolves the wrong way.

All checks below are owner-run, against throwaway data or a preview deployment. Do not run them against production traffic or anyone else's systems.

## 1. Writing slug page-ID fallback resolves any Notion page the integration can read, not only blog-database posts

- **Fingerprint:** `lib/notion.ts:fetchPostBySlug:page-id-fallback-no-parent-check`
- **Boundary at risk:** Notion workspace data exposure

An anonymous visitor can request /api/writing/<page-id> or /writing/<page-id>. If the slug is not in the cached post list, does not match the Slug property and does not match a title-derived slug, fetchPostBySlug (lib/notion.ts:232-242) passes the visitor's string as page_id to pages.retrieve, using the owner's NOTION_API_KEY. It returns the page's id and title as a writing post and never checks page.parent against the blog data source pinned by NOTION_BLOG_DATABASE_ID, or in_trash/archived. Both callers then run fetchPostBlocks(post.id), which fetches the whole block tree recursively. The API route returns that tree as raw JSON (app/api/writing/[slug]/route.ts:23), and the page route renders it (app/writing/[slug]/page.tsx:29). The blog list and Slug queries go only through the env-pinned data source, so this fallback is the one place that widens the set of readable pages. Correction to the hunter's scope: child pages nested under published posts are already reachable through the normal path, because fetchPostBlocks follows has_children into child_page blocks. Draft (non-trashed) rows in the blog database are also already in the unfiltered list query. The added exposure from this fallback is (a) pages outside the blog database's subtree that the integration is shared with, and (b) trashed or archived blog posts, which the data-source query leaves out but pages.retrieve may still return. Page IDs can come from link_to_page blocks, page mentions and Notion URLs in returned block JSON, and from old public UUID URLs. A hunter harness with a mocked client showed a dummy non-blog page and a dummy in_trash page both returning 200 with content. That proves the copied application logic, not Notion's real behavior.

**Claimed root cause.** lib/notion.ts:232-242 calls getNotionClient().pages.retrieve({ page_id: slug }) with a visitor-controlled slug and maps the result into a NotionWritingPost. It never checks that page.parent is the blog data source/database resolved from NOTION_BLOG_DATABASE_ID, or that in_trash/archived is false. The query paths at lib/notion.ts:137-146 and 200-209 apply database scoping, and this path does not.

**Source trace**

1. `app/api/writing/[slug]/route.ts:11` (entrypoint, `GET`): The anonymous path segment slug is read from route params with no validation. The HTML route does the same at app/writing/[slug]/page.tsx:79.
1. `lib/notion.ts:255` (propagation, `resolveWritingPostBySlug`): A slug that is not in the cached post list falls through to fetchPostBySlug(slug).
1. `lib/notion.ts:233` (propagation, `fetchPostBySlug`): After the Slug-filter query and the title-derived match both miss, pages.retrieve({ page_id: slug }) runs with the owner's integration token. The page's parent and trash state are not checked.
1. `app/api/writing/[slug]/route.ts:21` (propagation, `GET`): fetchPostBlocks(post.id) recursively lists every child block of the resolved page.
1. `app/api/writing/[slug]/route.ts:23` (sink, `GET`): The post metadata and the full raw block tree are returned as JSON to the anonymous caller.

**Evidence**

- `lib/notion.ts:231`: The comment says the fallback is only for backward compatibility with old UUID URLs, but the code accepts any page ID.
- `lib/notion.ts:234`: page_id is the raw visitor slug, and the result is returned without checking parent, in_trash or archived.
- `lib/notion.ts:200`: The intended scoping: the Slug lookup, like the list query at line 137, queries only the env-pinned blog data source.
- `lib/notion.ts:554`: fetchPostBlocks recurses into every has_children block, so the full content of the resolved page, including nested child pages, is fetched.
- `app/writing/[slug]/page.tsx:29`: The HTML page route makes the same fetchPostBlocks call on the fallback result, so the same exposure applies through /writing/<page-id>.

**Blockers (why this is not confirmed)**

- Which Notion pages and databases outside the blog database the deployed NOTION_API_KEY integration is connected to is a workspace setting that source does not show. Any impact beyond trashed blog posts depends on it.
- Whether Notion's pages.retrieve and blocks.children.list (API version 2025-09-03) still return content for in_trash/archived pages is third-party behavior that cannot be observed locally.
- node_modules is absent, so it cannot be checked whether @notionhq/client 5.x URL-encodes page_id when it builds the request path. This affects whether non-UUID slugs could reach other API paths, not the core finding.

**How to resolve**

- **Local check:** In the approved sandbox, with @notionhq/client at the lockfile version installed offline and a mocked fetch transport, call fetchPostBySlug('<dummy-uuid>') after mocked Slug and list misses. Confirm it sends GET /v1/pages/<dummy-uuid> and returns a post when the mocked response has a parent.data_source_id different from the blog data source, or has in_trash: true. Then add a regression check that, with a fix that compares page.parent to the resolved blog data source and rejects in_trash/archived, both cases return null.
- **Owner-observed check:** The owner, using throwaway test content on a preview deployment only: (1) create a page outside the blog database in a workspace area the integration is connected to, (2) create and then trash a test blog post, (3) request /api/writing/<page-id> for each and record whether the response is 200 with content or 404, and (4) review the integration's connections list in Notion to see which non-blog pages it can read. Delete the test pages afterwards.


## 2. Anonymous commit-history API can disclose private repository names, commit messages and commit URLs when GITHUB_TOKEN is set

- **Fingerprint:** `lib/github:fetchCommitHistory:private-repo-disclosure`
- **Boundary at risk:** Private GitHub data exposure

GET /api/commits/history is a public route that takes no input and is force-dynamic. Any anonymous visitor can request it directly. The hunter said the homepage footer calls it for every visitor. Source refutes that: components/commits-section.tsx is the only client consumer, and it is not imported or rendered anywhere in the repository. The route is still reachable by URL. When GITHUB_TOKEN is set, lib/github.ts sends the owner's token as a Bearer header on every GitHub call. It calls /users/gageminamoto/events?per_page=100, and GitHub documents that this endpoint includes private events when you are authenticated as that user. It also switches the repo listing from the public /users/gageminamoto/repos to /user/repos?type=owner, which includes private repositories by default for a token with private-repo access. The code then fetches commits for each listed repo using the same token. No step filters on repo.private, event.public or visibility. Each commit's repo full name, first message line and commit URL is copied into the JSON response. A local mocked-fetch harness (verifier-07 check-1) ran the real fetchCommitHistory logic with a dummy token and dummy fixtures. It reproduced the passthrough: one private-marked PushEvent and one private:true repo both appeared in the output with full name, message and URL. Whether real private data is exposed depends on deployment and token facts that cannot be observed locally. (Verifier local check retained in the audit working directory: agents/verifier-07/artifacts/check-1.txt.)

**Claimed root cause.** headers() adds the owner's GITHUB_TOKEN to every request. reposUrl() switches to the authenticated /user/repos?type=owner listing without visibility=public. The events call is also authenticated. fetchCommitHistory never checks repo.private or event.public, and it copies every repo full name, commit message and commit URL into the response that GET /api/commits/history returns to anonymous callers.

**Source trace**

1. `app/api/commits/history/route.ts:7` (entrypoint, `GET`): Anonymous GET handler with no input and no auth. The route is force-dynamic (line 4) and calls fetchCommitHistory(30) at line 10.
1. `lib/github.ts:48` (propagation, `fetchCommitHistory`): Fetches /users/gageminamoto/events?per_page=100 with headers() (lines 48-51). headers() adds Authorization: Bearer GITHUB_TOKEN when the token is set (lines 17-19). As the owner, GitHub may include private events.
1. `lib/github.ts:67` (propagation, `fetchCommitHistory`): Only event.type === PushEvent is checked; event.public is never checked. Lines 68-85 copy repo name, full name, first message line and commit URL into commits.
1. `lib/github.ts:25` (propagation, `reposUrl`): With GITHUB_TOKEN set, it returns /user/repos?type=owner&... without visibility=public. That endpoint lists the token owner's private repos when the token allows it. Called at lines 97-100 with sort=pushed&per_page=5.
1. `lib/github.ts:109` (propagation, `fetchCommitHistory`): Every listed repo is pushed into allRepos with no repo.private check.
1. `lib/github.ts:127` (propagation, `fetchCommitHistory`): Fetches /repos/<full_name>/commits with the token for each repo. Lines 142-153 copy commit message, repo name, full name and html_url into commits unchanged.
1. `app/api/commits/history/route.ts:12` (sink, `GET`): Returns { commits } as JSON to the anonymous caller.

**Evidence**

- `lib/github.ts:17`: headers() attaches the owner's GITHUB_TOKEN as a Bearer token to every GitHub request.
- `lib/github.ts:24`: The token switches the repo listing from the public user endpoint to the authenticated /user/repos?type=owner endpoint, with no visibility parameter.
- `lib/github.ts:67`: Events are filtered only by type; event.public is ignored.
- `lib/github.ts:145`: Commit message first line, repo full name (line 147) and html_url (line 151) are copied unchanged into the output.
- `app/api/commits/history/route.ts:4`: The route is force-dynamic and needs no authentication, so any anonymous request triggers authenticated GitHub calls.
- `components/commits-section.tsx:104`: The only client consumer fetches /api/commits/history and renders repoName, message and url. CommitsSection is not imported anywhere, so the leak path is direct requests to the API route, not the rendered homepage.

**Blockers (why this is not confirmed)**

- Whether the production Vercel deployment sets GITHUB_TOKEN. AGENTS.md calls it optional, and the repository has no deployment config.
- The token's type and scope. A classic token with the repo scope, or a fine-grained token with private-repository access, can return private repos from /user/repos and private events from /users/gageminamoto/events. A public-only fine-grained token or a classic token without repo cannot.
- Whether the owner account has private repositories among its 5 most recently pushed owned repos, or private PushEvents within the events API retention window.
- GitHub API behaviour for authenticated /users/<self>/events and /user/repos?type=owner is third-party behaviour. Only documentation supports it; it was not observed locally.

**How to resolve**

- **Local check:** Reproduced in verifier-07 check-1. A mocked fetch with a dummy token and dummy fixtures ran inside the parent sandbox (no network, read-only mounts, env -i, prlimit, 20s timeout). The fixtures were one public:false PushEvent and one private:true repo from /user/repos. Both private entries pass through to the result. Regression test: add a fix (visibility=public on /user/repos, or skip repo.private !== false; skip event.public !== true; or drop the token for these calls), rerun the same harness, and assert that no repoFullName containing dummy-private-* is returned while dummy-public remains.
- **Owner-observed check:** Owner-only, read-only steps. (1) In Vercel project settings, check whether GITHUB_TOKEN is set for Production, and note its type and scopes in GitHub settings. Do not paste its value anywhere. (2) If it is set, run locally with that token: GET https://api.github.com/user/repos?type=owner&visibility=private&per_page=1. If the result is non-empty, private repos are reachable. Also run GET https://api.github.com/users/gageminamoto/events?per_page=100 and count entries with public:false. (3) Fetch the production /api/commits/history once and compare each repoFullName against the owner's public repository list. Any match against a private repo confirms disclosure. Do not share the response output beyond the owner.


## 3. Writing API and page payload expose the raw recursive Notion block tree, including unrendered subpages and attachments

- **Fingerprint:** `lib/notion.ts:fetchPostBlocks:unprojected-recursive-block-tree`
- **Boundary at risk:** Notion content beyond what is rendered

For any post that resolves, an anonymous GET /api/writing/[slug] returns the raw Notion BlockObjectResponse tree built by fetchPostBlocks. The /writing/[slug] page builds the same tree (app/writing/[slug]/page.tsx:29) and hands it, through ArticleContent, to the 'use client' component ArticleContentMotion, so it is also serialised into the RSC payload. fetchPostBlocks descends into every block that has children, whatever its type, and copies each block unchanged. The renderer (components/writing/block.tsx) shows only 13 block types and returns null for everything else. As a result, content the site never displays can reach an anonymous visitor through the JSON and RSC payload. That content includes the body of child_page subpages nested under a post, synced_block and column content, signed file URLs on file/pdf/video/audio blocks, and created_by/last_edited_by user IDs. A verifier harness ran independently in the sandbox. It contained a verbatim copy of fetchPostBlocks and a dummy Notion client. Its serialised route body contained the subpage marker text, the synced-block marker text, a signed PDF URL and a dummy user ID. The Block switch renders none of child_page, pdf or synced_block. Whether real exposure exists depends on how the Notion API behaves and on what the owner's live posts contain.

**Claimed root cause.** fetchPostBlocks (lib/notion.ts:529-569) copies each raw block unchanged ({...block}, line 545). It recurses into every block where has_children is true (lines 553-554), with no allowlist of block types and no projection of the fields the site publishes. The route serialises that unprojected tree (app/api/writing/[slug]/route.ts:23), and so does the client-component prop (app/writing/[slug]/article-content.tsx:57). The effective publish policy is the renderer's type switch (components/writing/block.tsx:17-72, default: return null), and no layer before serialisation enforces it.

**Source trace**

1. `app/api/writing/[slug]/route.ts:11` (entrypoint, `GET`): An anonymous visitor supplies the slug path segment. resolveWritingPostBySlug resolves it to a post on line 12.
1. `app/api/writing/[slug]/route.ts:21` (propagation, `GET`): fetchPostBlocks(post.id) is called for the resolved post.
1. `lib/notion.ts:545` (propagation, `fetchPostBlocks`): Each raw BlockObjectResponse is shallow-copied unchanged, so it keeps created_by/last_edited_by, any signed file URLs and every type-specific field.
1. `lib/notion.ts:554` (propagation, `fetchPostBlocks`): The function recurses into any block with has_children, including child_page, synced_block, column_list and column. The renderer displays none of these.
1. `components/writing/block.tsx:70` (propagation, `Block`): The default case returns null, which shows that child_page, file, pdf, video, audio, synced_block and column_list are not part of the rendered surface.
1. `app/api/writing/[slug]/route.ts:23` (sink, `GET`): NextResponse.json({ post, blocks, allPosts }) returns the full unprojected tree to the anonymous caller. The same tree reaches the RSC payload through page.tsx:95 and article-content.tsx:57.

**Evidence**

- `lib/notion.ts:553`: The has_children recursion has no block-type filter.
- `components/writing/block.tsx:17`: The renderer switch allowlists heading_1-3, paragraph, quote, code, callout, image, toggle, table, bulleted/numbered list items and divider. table_row and every other type return null.
- `app/writing/[slug]/page.tsx:29`: The page calls fetchPostBlocks and passes the result unchanged to ArticleContent at line 95.
- `app/writing/[slug]/article-content.tsx:57`: The full articleBlocks tree is passed as a prop to ArticleContentMotion, which is a 'use client' component (article-content-motion.tsx:1), so the tree is serialised into the page payload.
- `app/api/writing/[slug]/route.ts:23`: The raw tree is returned as JSON with no projection.

**Blockers (why this is not confirmed)**

- Provider behaviour, which cannot be observed locally: whether the Notion API (notionVersion 2025-09-03) sets has_children=true on child_page and synced_block blocks, and whether blocks.children.list on a child_page ID returns the subpage's content under the integration's inherited access. Both local harnesses (the hunter's check-1 and the verifier's check-1) model this with a dummy client.
- Owner data state: only the owner can see whether live writing posts contain nested child pages, synced or column content, or file/pdf/video/audio attachments that are not meant to be public. Without such content, the exposure is limited to block metadata such as Notion user IDs.

**How to resolve**

- **Local check:** Re-run agents/verifier-10/scratch/h.js inside the sandbox. It is a verbatim copy of fetchPostBlocks with a dummy client and only dummy data. Then replace the dummy tree with a recorded, non-sensitive Notion fixture of a test page. The fixture should hold a child_page containing a marker string, a pdf block and a synced_block. Next, add a projection step: keep only the block types Block renders and the fields they need, strip created_by/last_edited_by, and do not recurse into child_page, child_database, synced_block or column_list. Assert that the serialised route body contains no marker text, no non-image file URLs and no user IDs.
- **Owner-observed check:** Use a throwaway Notion test database shared only with a test integration. Add a post that contains a child_page with a unique marker string, a PDF attachment and a synced block. Request /api/writing/<test-slug> on a local or preview build pointed at that test database. Search the JSON and the /writing/<test-slug> RSC payload for the marker and the attachment's signed URL. Separately, the owner reviews live posts for nested subpages, synced or column content, or attachments that are not intended for publication. This is a read-only check.


## 4. Image proxy allowlist trusts the shared S3 path-style host, so any visitor may be able to make the site fetch, transcode and serve images from buckets the attacker owns

- **Fingerprint:** `lib/image-url.ts:isAllowedImageUrl:hostname-only-shared-s3`
- **Boundary at risk:** Image proxy used for third-party content

Any anonymous visitor can call GET /api/image. It reads the url query parameter and checks only the URL's hostname against a fixed list. That list includes s3.us-west-2.amazonaws.com, which is the regional path-style S3 endpoint and is not a bucket-specific host. Protocol, port, userinfo and path are never checked. A request like /api/image?url=https://s3.us-west-2.amazonaws.com/<attacker-bucket>/<object> passes the check, and http and non-default ports pass too. The route then calls fetch(url) with the default redirect behaviour (follow) and does not check the allowlist again on the final URL. It reads the whole body with no byte cap, transcodes it with sharp to WebP, and serves the result from the site's origin with Cache-Control: public, max-age=31536000, s-maxage=31536000, immutable, plus CDN-Cache-Control: public, max-age=31536000. If AWS serves public objects from other customers' buckets through that path-style host, the site's compute and egress become an image proxy and transcoder for attacker-chosen content, and that content is cached under the owner's domain for one year. The Content-Type is fixed to image/webp and the body is re-encoded by sharp, so no script runs in the site's origin. No middleware or other layer in the repository restricts the route. Neither the repository source nor the hunter's harness found any first-party code that needs the bare host. The same allowlist is also used by lib/image-metadata.ts:18 (getImageDimensions, called from lib/notion.ts). That function does a server-side ranged fetch of the first 64 KiB, follows redirects by default, and only returns dimensions, so it is not an anonymous entry point. next.config.mjs images.remotePatterns lists only www.google.com /s2/favicons and does not apply to this route.

**Claimed root cause.** isAllowedImageUrl (lib/image-url.ts:8-9) compares only url.hostname against a static list that includes the multi-tenant host s3.us-west-2.amazonaws.com (line 5). It does not check protocol, port, or the bucket/path prefix. The route (app/api/image/route.ts:41) follows redirects without checking the final URL against the allowlist again.

**Source trace**

1. `app/api/image/route.ts:11` (entrypoint, `GET`): The url query parameter is read directly from the anonymous request.
1. `app/api/image/route.ts:24` (propagation, `GET`): The only access decision is isAllowedImageUrl(parsed). A failure returns 403.
1. `lib/image-url.ts:9` (propagation, `isAllowedImageUrl`): Exact hostname equality only. Protocol, port, userinfo and path are not checked.
1. `app/api/image/route.ts:41` (propagation, `GET`): fetch(url, { signal }) uses the default redirect mode 'follow'. The allowlist is not re-checked on the final URL, and the body is read in full at line 51 with no size cap.
1. `app/api/image/route.ts:61` (sink, `GET`): The sharp-transcoded upstream content is served from the site origin with public, max-age=31536000, s-maxage=31536000, immutable caching.

**Evidence**

- `lib/image-url.ts:5`: The allowlist contains s3.us-west-2.amazonaws.com, the regional path-style S3 endpoint, in addition to the bucket-specific prod-files-secure.s3.us-west-2.amazonaws.com on line 2.
- `lib/image-url.ts:9`: hostname === url.hostname is the whole check. A verifier sandbox harness that loads this list from source accepted https://, http://, :8443 and userinfo variants of s3.us-west-2.amazonaws.com/dummy-other-bucket/x.png, and rejected s3.us-west-2.amazonaws.com.evil.example and evil.example (agents/verifier-09/artifacts/check-1.txt).
- `app/api/image/route.ts:41`: fetch(url, { signal: controller.signal }) does not set redirect: 'manual' or 'error'.
- `app/api/image/route.ts:61`: The response is marked public and immutable for one year at both the browser and the CDN, so whatever is fetched once stays served from the site origin.

**Blockers (why this is not confirmed)**

- Whether AWS currently serves a public-read object from an arbitrary third-party us-west-2 bucket at the path-style URL https://s3.us-west-2.amazonaws.com/<bucket>/<key> is AWS service behaviour that cannot be observed locally without network access. This fact decides whether the attack works.
- The end-to-end fetch, sharp transcode and response headers cannot be run locally because node_modules (next, sharp) is absent and installing is prohibited. Only the pure allowlist function was reproduced.
- Whether www.notion.so or images.unsplash.com issue redirects to, or proxy, arbitrary upstream URLs, which would widen the reach through the unchecked redirect follow, is third-party behaviour outside the repository.
- Whether the deployed Vercel CDN honours the one-year immutable cache for these responses, and the resulting compute and egress cost, is not visible in the repository.

**How to resolve**

- **Local check:** Add unit tests for isAllowedImageUrl requiring that http: URLs, non-default ports and userinfo are rejected, and that any s3.us-west-2.amazonaws.com URL whose path is outside the owner's expected bucket prefix is rejected, or remove that host entirely. Add a route test with a mocked fetch that returns a 302 to a non-allowlisted host, and assert the request is rejected (for example with redirect: 'manual' plus a re-check, or redirect: 'error').
- **Owner-observed check:** Owner-observed, single non-stress check on a preview deployment. Put one small dummy public-read PNG in a throwaway us-west-2 bucket the owner controls and the site does not use. Request /api/image?url=https://s3.us-west-2.amazonaws.com/<throwaway-bucket>/<key>&w=16 once, and record whether it returns 200 image/webp with the immutable Cache-Control header. Separately, check whether any real Notion image URLs used by the site rely on the bare s3.us-west-2.amazonaws.com host. If none do, drop it or restrict it to the specific bucket path prefix. Delete the throwaway bucket afterwards.


## 5. Image proxy follows redirects from allowlisted hosts without re-checking the allowlist

- **Fingerprint:** `app/api/image/route.ts:GET:redirect-follow-without-allowlist-recheck`
- **Boundary at risk:** Server-side request forgery via redirects

GET /api/image checks only the hostname of the URL the visitor sends. It then calls fetch() with no redirect option, so fetch uses its default, redirect:'follow'. The allowlist compares the hostname alone, so http:// and any port also pass (for example http://www.notion.so:PORT/...). Later redirect hops are never checked. Suppose an allowlisted host (prod-files-secure.s3.us-west-2.amazonaws.com, www.notion.so, images.unsplash.com, s3.us-west-2.amazonaws.com) returns a 3xx whose Location an attacker can choose. An anonymous visitor could then make the server send GET requests to any external or internal address, including over plain http. A non-image response fails in sharp, and the route returns a generic 500 with no-store, so the read is mostly blind. A response that sharp can decode as an image is re-encoded to WebP and served with public, immutable, one-year cache headers. A local Node 22 harness confirmed the redirect-following part. It used a verbatim copy of isAllowedImageUrl and the route's exact fetch call shape. A request to the allowlisted name www.notion.so got a 302 to a non-allowlisted host, and fetch followed it. Whether any real allowlisted host emits a redirect an attacker can steer has not been established.

**Claimed root cause.** The allowlist decision (lib/image-url.ts:8-10, applied once at app/api/image/route.ts:24) covers only the first URL and only its hostname, with no check on protocol or port. The fetch at route.ts:41 follows redirects automatically. It has no per-hop allowlist check, no https-only rule, and no private-address check.

**Source trace**

1. `app/api/image/route.ts:11` (entrypoint, `GET`): The url query parameter, which the anonymous visitor controls, is read from request.nextUrl.searchParams.
1. `app/api/image/route.ts:24` (propagation, `GET`): isAllowedImageUrl(parsed) is checked once, against the URL the visitor supplied.
1. `lib/image-url.ts:9` (propagation, `isAllowedImageUrl`): Compares url.hostname exactly against four hosts. It does not check protocol, port, or path, and it does not apply to later redirect hops.
1. `app/api/image/route.ts:41` (sink, `GET`): fetch(url, { signal }) uses the default redirect:'follow' and requests every redirect target without checking it again.

**Evidence**

- `app/api/image/route.ts:41`: There is no redirect:'manual' or redirect:'error' option and no per-hop isAllowedImageUrl check. In the local sandbox, Node 22.23.4 fetch with this call shape followed a 302 from the allowlisted name www.notion.so (mapped to a loopback fixture) to fixture-b.internal.test, which is not allowlisted. It returned status 200, redirected=true, and fixture B's body, and fixture B logged the GET. The output is in agents/verifier-05/artifacts/check-1.txt, pending parent promotion.
- `lib/image-url.ts:9`: Only the hostname is compared. In the harness, isAllowedImageUrl returned true for http://www.notion.so:44907/image/x (plain http, non-default port) and false for the redirect target.
- `app/api/image/route.ts:61`: Successful outputs are sent with public, max-age and s-maxage of 31536000, immutable. Any image body reached through a redirect therefore stays in the origin's CDN cache.
- `lib/image-metadata.ts:24`: The sibling fetch for Notion image blocks has the same one-time check (line 18) and the same default redirect following. Its input comes from Notion page content, not directly from the visitor.

**Blockers (why this is not confirmed)**

- Whether any of the four allowlisted hosts returns a 3xx whose Location an anonymous attacker can choose is third-party behaviour that source cannot show. That includes an open redirect, a redirecting proxy path, or a pre-signed S3 or bucket website-redirect configuration on the shared s3.us-west-2.amazonaws.com hostname. Without such a redirect, the flaw cannot be reached.
- The local observation used Node 22.23.4's built-in fetch (undici). It did not use the fetch that Next.js 16.1.6 patches at runtime, because node_modules is absent and installing is prohibited. It is not verified locally that the patched fetch keeps redirect:'follow' as the default for this route.
- What a Vercel function can reach through egress, and so the real impact of server-side request forgery, depends on the deployment and is not visible in source. Examples are internal metadata or private network services.

**How to resolve**

- **Local check:** With the repo's locked dependencies installed, run `next dev` in an offline sandbox with loopback up and an /etc/hosts override in a private mount namespace. The override maps www.notion.so and fixture-b.internal.test to 127.0.0.1. Fixture A, at http://www.notion.so:PORT_A/image/x, answers 302 with Location http://fixture-b.internal.test:PORT_B/b. Request GET /api/image?url=http%3A%2F%2Fwww.notion.so%3APORT_A%2Fimage%2Fx and check whether fixture B logs a request. Regression check after the fix: use redirect:'manual', re-check isAllowedImageUrl on each hop, require https with no explicit port, and cap the number of hops. Fixture B must then receive nothing, and the route must return 4xx or 502.
- **Owner-observed check:** Non-destructive, owner-run steps. (1) Using the owner's own resources only, check whether any path on www.notion.so, images.unsplash.com, prod-files-secure.s3.us-west-2.amazonaws.com, or s3.us-west-2.amazonaws.com returns a 3xx with a Location taken from the request. Examples are Notion image or login redirect paths, Unsplash redirect endpoints, and an S3 bucket in the owner's account with a website redirect rule; do not probe third parties aggressively. (2) Review Vercel function logs for /api/image requests whose final URL host differs from the requested host. (3) Confirm what network destinations Vercel function egress can reach.


## 6. The markdown route builds its server-side fetch target from the request origin and an unnormalized path, then caches the result publicly

- **Fingerprint:** `accept-md:route:request-derived-self-fetch-url`
- **Boundary at risk:** Markdown route fetch target / cache poisoning

Any anonymous request for a *.md path, or any request with Accept: text/markdown to a path outside /api and /_next, is rewritten to /api/accept-md (next.config.mjs:16-28). The route builds pathname as '/' plus the catch-all segments joined with '/', with no normalization (route.ts:35). It copies every inbound request header except Accept (route.ts:36-37). It calls getMarkdownForPath with baseUrl = request.nextUrl.origin, because markdownConfig never sets baseUrl (route.ts:9-24, 42). It passes a process-wide Map with up to 250 entries as the cache (route.ts:8, 44). Successful output is sent as 'public, s-maxage=60, stale-while-revalidate' with only Vary: Accept (route.ts:50-55). Error messages are returned verbatim (route.ts:59-63). The repository source has no host pin, no path check and no header allowlist. A local check (check-1) confirmed that WHATWG new URL(pathname, base) resolves the pathnames '///evil.example', '//evil.example' and '/\evil.example' (from segments ['//evil.example'], ['', 'evil.example'] and ['\evil.example']) to https://evil.example/, while plain string concatenation stays same-origin. The finding is exploitable only if two things hold. First, either ingress lets a client-chosen Host or X-Forwarded-Host reach nextUrl.origin, or Next.js delivers such a segment to params.path and accept-md-runtime@5.0.2 joins the URL with new URL() or forwards a Host header that the server honours. Second, the library's cache key or the CDN key does not include the steered origin. If both hold, the server would fetch from an attacker-chosen origin, reflect its content or error text, and could cache that markdown for other visitors of the same path. None of these facts can be seen in the repository, and the package is absent locally. (Verifier local check retained in the audit working directory: agents/verifier-04/artifacts/check-1.txt.)

**Claimed root cause.** The self-fetch origin is not pinned: markdownConfig.baseUrl is unset, so request.nextUrl.origin is used. The catch-all pathname is not reduced to a single-leading-slash, same-origin path before it reaches accept-md-runtime, whose URL join and cache key cannot be inspected locally. All request headers except Accept are forwarded, and the result is shared through a process-wide cache and a public CDN cache that varies only on Accept.

**Source trace**

1. `next.config.mjs:16` (entrypoint, `rewrites.beforeFiles`): Anonymous requests to /:path*.md (and, at lines 20-28, any non-api, non-_next path with Accept containing text/markdown) are rewritten to /api/accept-md/:path*.
1. `app/api/accept-md/[[...path]]/route.ts:35` (propagation, `GET`): pathname = '/' + path.join('/') with no normalization, so a leading '//' or a backslash survives if Next.js delivers it in a segment.
1. `app/api/accept-md/[[...path]]/route.ts:36` (propagation, `GET`): Copies all inbound request headers (including Host, X-Forwarded-* and Cookie); only Accept is removed at line 37. The headers are passed to getMarkdownForPath at line 45.
1. `app/api/accept-md/[[...path]]/route.ts:42` (propagation, `GET`): baseUrl = markdownConfig.baseUrl ?? request.nextUrl.origin. baseUrl is never configured, so the origin always comes from the request.
1. `app/api/accept-md/[[...path]]/route.ts:40` (sink, `GET`): getMarkdownForPath (accept-md-runtime, absent locally) fetches baseUrl plus pathname and uses the shared markdownCache (line 44). The result is returned with public s-maxage=60 caching (lines 50-55), and errors are reflected verbatim (lines 59-63).

**Evidence**

- `app/api/accept-md/[[...path]]/route.ts:9`: markdownConfig has no baseUrl. include is ['/**'], exclude is ['/api/**', '/_next/**'], cache is true and maxCacheEntries is 250.
- `app/api/accept-md/[[...path]]/route.ts:8`: markdownCache is a module-level Map shared across all requests and visitors in the process.
- `app/api/accept-md/[[...path]]/route.ts:53`: Cache-Control is 'public, s-maxage=60, stale-while-revalidate' with Vary: Accept only (line 55). Host and forwarded headers are not part of the Vary key.
- `app/api/accept-md/[[...path]]/route.ts:63`: error.message is returned verbatim in the JSON body, so text from an upstream fetch failure is shown to the client.
- `next.config.mjs:37`: The global header rule adds only Vary: Accept to every path.
- `package-lock.json:4432`: accept-md-runtime 5.0.2 is locked, but node_modules is absent and the package is not in the local npm cache, so its URL join, Host handling, include/exclude matching and cache key cannot be inspected.

**Blockers (why this is not confirmed)**

- How accept-md-runtime@5.0.2 getMarkdownForPath combines baseUrl and pathname (new URL resolution or string concatenation), whether it checks that the result stays on baseUrl's origin, whether include/exclude matching rejects '//' or backslash paths, whether it passes the forwarded Host header to fetch, and what its cache key contains (pathname only, or the full URL). The package is absent locally and installing it is prohibited.
- Whether Next.js 16.1.6, as deployed on Vercel, derives request.nextUrl.origin from a client-supplied Host or X-Forwarded-Host, or whether Vercel ingress overwrites or rejects those headers. This is deployment behaviour that is not visible in the repository.
- Whether Next.js routing and the beforeFiles rewrites deliver a catch-all segment that decodes to '//host' or '\host' (for example /%2F%2Fevil.example.md, /%5Cevil.example.md or //evil.example with Accept: text/markdown) into params.path, or instead normalize, reject or redirect repeated slashes and backslashes first.
- Whether the Vercel CDN cache key for a public s-maxage response includes the Host, so a steered response could reach other visitors.

**How to resolve**

- **Local check:** In an offline sandbox with npm ci from package-lock.json already done by the owner, first read node_modules/accept-md-runtime/dist (getMarkdownForPath) and record the URL join, any origin check, the include/exclude match and the cache-key expression. Then import the GET handler from app/api/accept-md/[[...path]]/route.ts and replace globalThis.fetch with a stub that records the requested URL and headers and returns '<html><body>STUB</body></html>'. Run it four times. (a) NextRequest('https://site.test/about.md', headers {host: 'attacker.invalid', 'x-forwarded-host': 'attacker.invalid'}) with params.path ['about']. (b) params.path ['//attacker.invalid'] with a normal host. (c) params.path ['\attacker.invalid']. (d) A follow-up request with the normal host and the same path. Record whether any stub URL leaves https://site.test, and whether request (d) returns STUB from markdownCache. Separately, run next dev offline and request /%2F%2Fattacker.invalid.md and /%5Cattacker.invalid.md to see what params.path receives. Proposed fix: set markdownConfig.baseUrl from a server-only env var or constant; reject a pathname that starts with '//', contains a backslash, or resolves to a different origin than baseUrl; forward only an allowlist of headers (never Host or X-Forwarded-*); keep the cache key on the normalized pathname only.
- **Owner-observed check:** Owner only, against their own preview deployment, read-only GET requests. (1) GET /about.md with X-Forwarded-Host: owner-controlled.invalid, then again with a spoofed Host where the client allows it. Check whether the response body or the error text mentions that host. (2) GET /%2F%2Fexample.com.md and /%5Cexample.com.md. Confirm the response is the site's own 404 or markdown, not example.com content, and check the function logs for any outbound request to example.com. (3) Repeat request (1) without spoofed headers within 60 seconds and confirm the cached response is the normal one.


## 7. Shared in-process markdown cache may not be keyed on the request-derived origin

- **Fingerprint:** `accept-md:route:markdownCache-key-omits-baseUrl`
- **Boundary at risk:** Markdown route cache poisoning

The markdown route keeps one module-level Map, capped at 250 entries, that every visitor on a server instance shares. Each request passes its own baseUrl into getMarkdownForPath together with that shared Map. Because markdownConfig.baseUrl is never set, baseUrl always falls back to request.nextUrl.origin. The request also passes every header except Accept, including Host and any X-Forwarded-* headers. The pathname is built only from path segments, so the query string never reaches it. If accept-md-runtime keys the Map on pathname alone, the following can happen. An attacker sends a request that controls the origin (see peer root cause accept-md:route:request-derived-self-fetch-url) or sends headers that change the self-fetched page. The markdown produced from that request is stored. Later visitors to the same path on that instance then receive it until the entry is evicted. The route also marks the response public with s-maxage=60, so a CDN can copy the poisoned body further. This is a cache-poisoning variant that depends on the peer host-trust root cause. The repository source does not define the cache key, so neither the key nor the poisoning can be shown locally.

**Claimed root cause.** The cache instance is process-global (route.ts:8). The inputs that decide what it stores are per-request: baseUrl from request.nextUrl.origin (route.ts:42) and the forwarded request headers (route.ts:36-37, 45). Both go to getMarkdownForPath with that one Map (route.ts:40-46). The cache key is built inside the dependency accept-md-runtime@5.0.2, which is pinned in package-lock.json and absent locally. No code in this repository binds the key to baseUrl or to the headers.

**Source trace**

1. `app/api/accept-md/[[...path]]/route.ts:30` (entrypoint, `GET`): An anonymous request reaches the handler through the /index.md, /:path*.md or Accept: text/markdown rewrites (next.config.mjs:10-29).
1. `app/api/accept-md/[[...path]]/route.ts:36` (propagation, `GET headers`): All request headers, including Host and any X-Forwarded-* headers, are copied from the visitor's request. Only Accept is deleted (line 37).
1. `app/api/accept-md/[[...path]]/route.ts:42` (propagation, `GET getMarkdownForPath options`): baseUrl is request.nextUrl.origin, because markdownConfig.baseUrl is never set in markdownConfig (lines 9-24).
1. `app/api/accept-md/[[...path]]/route.ts:44` (sink, `markdownCache`): The shared module-level Map is handed to the runtime, which stores and returns entries under a key that this repository does not define.

**Evidence**

- `app/api/accept-md/[[...path]]/route.ts:8`: A single Map is created at module scope and shared by all requests on the instance.
- `app/api/accept-md/[[...path]]/route.ts:35`: pathname is built only from path segments. The query string is dropped, so the pathname alone does not separate one request's variant from another's.
- `app/api/accept-md/[[...path]]/route.ts:36`: The forwarded headers are copied from the visitor's request.
- `app/api/accept-md/[[...path]]/route.ts:53`: The response is marked public with s-maxage=60 and stale-while-revalidate, so a shared cache can store a poisoned body as well.
- `package-lock.json:4432`: accept-md-runtime resolves to 5.0.2. Its source, which builds the cache key, is not on disk: node_modules is absent, and the local npm cache (~/.npm/_cacache) has no entry for this package or its integrity hash.

**Blockers (why this is not confirmed)**

- The cache-key construction in accept-md-runtime@5.0.2 is not present locally. node_modules is absent, no other copy exists on disk (the local npm cache has no entry for it), and installing is prohibited. Whether baseUrl or any forwarded header is part of the key is therefore unknown, and that fact decides the finding.
- Whether the deployed platform lets a request reach this function with an origin other than the site's own domains (for example through a Host or X-Forwarded-Host override) is a deployment fact owned by the peer host-trust unit.

**How to resolve**

- **Local check:** Get an offline copy of accept-md-runtime-5.0.2.tgz (resolved URL and integrity at package-lock.json:4434-4435) through the parent and read how getMarkdownForPath builds its cache key. Then copy only that pure function into the sandbox, together with a mocked fetch that returns different HTML for each baseUrl. Call it twice with pathname '/', one shared Map, and baseUrl values 'https://a.invalid' and 'https://b.invalid'. Record in scratch/check-1.txt whether the second call returns the first call's markdown and lists the Map keys. Make no network calls.
- **Owner-observed check:** Owner check, read-only: on a preview deployment, send GET /index.md once with the normal Host and once with an X-Forwarded-Host header set to a domain the owner controls. Confirm whether request.nextUrl.origin, logged temporarily on a preview branch, ever reflects the client-supplied value. Do not send poisoning requests to production.


## 8. Markdown and HTML share one publicly cached URL, separated only by Vary: Accept

- **Fingerprint:** `accept-md:route:accept-header-representation-switch-relies-on-vary`
- **Boundary at risk:** CDN serving markdown instead of HTML

An anonymous request whose Accept header contains 'text/markdown' gets rewritten from an ordinary page URL (for example /about) to the accept-md handler, and the public URL does not change. The handler returns markdown (Content-Type text/markdown) marked 'public, s-maxage=60, stale-while-revalidate', which a shared CDN may store. That cache entry is for the same URL that normally serves HTML to browsers. Only a 'Vary: Accept' header keeps the two apart: the handler sets it on the markdown response, and the global headers() rule adds it to other paths. The repository has no vercel.json, no middleware and no other cache-key configuration. If the deployed edge cache ignores Vary: Accept for these responses, one request could make the CDN serve markdown in place of the page HTML to later visitors on that URL. This would last up to 60 seconds plus the stale-while-revalidate window, and the request can be repeated. The same could happen if a cached HTML entry is stored without Vary: Accept, because Next.js replaces the headers()-level Vary with its own Vary. The impact is limited to integrity and availability of public page content: the markdown is generated from the site's own public pages, and no private data is involved. Two of the hunter's sub-scenarios do not create a poisoning path on their own. A cache keyed on the raw Accept value splits variants more finely than the substring regex, not less. A normalised browser Accept value would not collapse onto a value containing text/markdown. The decisive question is whether Vary: Accept is honoured on both representations.

**Claimed root cause.** next.config.mjs:19-29 switches the representation of an existing page URL to markdown based on the request Accept header. app/api/accept-md/[[...path]]/route.ts:48-56 then marks that markdown publicly cacheable on the original URL. Keeping the HTML and markdown variants apart in shared caches therefore depends entirely on every downstream cache honouring Vary: Accept, and on Next.js keeping that Vary on the HTML responses (next.config.mjs:33-39, route.ts:55). The markdown is not served only from a separate URL that does not depend on Accept (*.md), and the Accept-switched variant is not marked private or no-store.

**Source trace**

1. `next.config.mjs:20` (entrypoint, `rewrites.beforeFiles[2]`): An anonymous visitor controls the Accept header. Any path not under api/ or _next/ whose Accept value matches (.*)text/markdown(.*) is rewritten to /api/accept-md/:path*, and the public URL stays the same.
1. `app/api/accept-md/[[...path]]/route.ts:40` (propagation, `GET`): getMarkdownForPath generates markdown for the same pathname that the HTML page serves. The pathname is built only from path segments, at line 35.
1. `app/api/accept-md/[[...path]]/route.ts:50` (sink, `GET response headers`): The response carries Cache-Control 'public, s-maxage=60, stale-while-revalidate', Content-Type text/markdown and Vary: Accept (lines 50-55). This makes the markdown eligible for shared CDN caching under the page URL, kept apart from the HTML only by Vary.

**Evidence**

- `next.config.mjs:25`: The rewrite selector is a substring regex on the Accept header, not media-type negotiation.
- `next.config.mjs:37`: A global 'Vary: Accept' header from headers() is the only source-visible signal that separates the HTML cache entries from the markdown entries on page URLs. No vercel.json or middleware in the repository changes cache keys.
- `app/api/accept-md/[[...path]]/route.ts:53`: The markdown variant is marked publicly cacheable at the shared edge (s-maxage=60 with stale-while-revalidate) instead of no-store or private.
- `app/api/accept-md/[[...path]]/route.ts:55`: The markdown response sets Vary: Accept explicitly. If the CDN honours it and the HTML entries also carry it, the variants stay separate. Whether they do cannot be seen in the source.

**Blockers (why this is not confirmed)**

- Whether the deployed Vercel edge cache includes the request Accept value in its cache key when a response carries Vary: Accept, for both the rewritten markdown response and the page HTML response. This is deployment and CDN behaviour that is not in the repository.
- Whether Next.js 16.1.6 keeps the custom 'Vary: Accept' from next.config headers() on prerendered, ISR or dynamic App Router HTML responses, or replaces it with its own Vary (rsc, Next-Router-State-Tree, Next-Router-Prefetch, ...). Also whether the beforeFiles rule with :path((?!api...).*) matches the root path /. Both are framework behaviour that cannot be checked because node_modules is absent and installing is prohibited.

**How to resolve**

- **Local check:** In an isolated, network-free environment that already has next@16.1.6 and the locked dependencies installed, without changing this repository, run 'next build' and then 'next start' bound to 127.0.0.1. For / and /about, request once with 'Accept: text/html,application/xhtml+xml,*/*;q=0.8' and once with 'Accept: text/markdown'. For each response, record Content-Type, Cache-Control, Vary and x-nextjs-cache. Confirm that Vary contains Accept on both the HTML and the markdown responses, and whether / is rewritten at all. Send only GET requests.
- **Owner-observed check:** On a preview deployment the owner controls, not production, pick a unique cache-busting query value <cb>. First request /about?cb=<cb> with 'Accept: text/markdown'. Immediately afterwards, request /about?cb=<cb> with a normal browser Accept header. If the second response shows Content-Type text/markdown with x-vercel-cache HIT, the finding is confirmed. If it shows text/html, or shows MISS, the variants are kept apart. Repeat once against a path whose HTML is prerendered (for example /about) and once against a dynamic path (for example /writing). Make no other requests and do not purge caches.


## 9. The image proxy downloads upstream images of any size with no time limit and decodes them using only sharp's default pixel limit

- **Fingerprint:** `app/api/image/route.ts:GET:unbounded-body-and-decode`
- **Boundary at risk:** Compute/memory exhaustion

Any anonymous visitor can call GET /api/image with a url parameter. Once that url passes the exact-hostname allowlist, the route arms a 10-second abort timer (route.ts:39). It clears that timer as soon as fetch() resolves, which happens when the response headers arrive (route.ts:42). It then reads the whole upstream body into memory with response.arrayBuffer() (route.ts:51), with no Content-Length check and no byte cap. Finally it passes that buffer to sharp(buffer) with no options (route.ts:53). Only the output width is capped, at 2400 (route.ts:28-31). Nothing limits how many input pixels are decoded beyond sharp's built-in default. The allowlist includes the shared path-style host s3.us-west-2.amazonaws.com and checks no bucket or path (lib/image-url.ts:5,9), so a visitor can point the proxy at bytes in a bucket they control. Two kinds of object fit: a very large one, or a small, highly compressed image that declares huge dimensions. Each distinct url (for example with a nonce query string) or w value is a separate cache key, so the year-long immutable cache (route.ts:61) does not prevent repeated fresh downloads and decodes. No middleware, proxy file, vercel.json, or route-level maxDuration or runtime setting adds a bound in the repository. The impact is spend on the owner's compute, memory, and egress, and possible failure of the shared function instance. How severe that is depends on sharp's default behaviour and on Vercel function limits, and neither can be observed here.

**Claimed root cause.** The upstream fetch has no byte cap and no deadline on the body: clearTimeout(timeout) at route.ts:42 runs before arrayBuffer() at route.ts:51. sharp then receives an untrusted buffer with no limitInputPixels or other decode bound sized to the 2400px output (route.ts:53). Together with the bucket-agnostic shared-S3 allowlist entry and a cache key that varies with the visitor's url and w values, a visitor can choose the bytes and force fresh work on every request.

**Source trace**

1. `app/api/image/route.ts:11` (entrypoint, `GET`): An anonymous visitor's url query parameter selects the upstream object. It is checked only by exact hostname (isAllowedImageUrl, route.ts:24).
1. `app/api/image/route.ts:42` (propagation, `GET`): clearTimeout(timeout) runs once fetch() resolves on headers. After that the abort signal cannot fire during the body read or the decode.
1. `app/api/image/route.ts:51` (propagation, `GET`): Buffer.from(await response.arrayBuffer()) buffers the whole upstream body in memory with no size check.
1. `app/api/image/route.ts:53` (sink, `GET`): sharp(buffer) is called with no constructor options, so the decoded input size is bounded only by the library default. The resize at line 54 bounds only the output.

**Evidence**

- `app/api/image/route.ts:39`: A 10_000ms abort timer is the only time bound in the handler.
- `app/api/image/route.ts:42`: The timer is cleared immediately after fetch() resolves, before the body is read.
- `app/api/image/route.ts:51`: arrayBuffer() is read with no Content-Length check and no streaming byte cap.
- `app/api/image/route.ts:53`: sharp(buffer) gets no limitInputPixels, failOn, or other option. Width is capped at 2400 only at lines 28-31, which limits the output, not the decoded input.
- `app/api/image/route.ts:61`: The response is cached public and immutable for a year, but each distinct url or w value is a separate cache key, so the cache does not prevent repeated work.
- `lib/image-url.ts:5`: The shared path-style host s3.us-west-2.amazonaws.com is allowlisted. Line 9 compares the hostname only, with no bucket or path restriction, so visitor-controlled buckets pass. The hunter's harness output in agents/hunter-image/artifacts/check-1.txt confirms this.
- `package.json:71`: sharp ^0.34.5 (package-lock.json pins 0.34.5). Its default input-pixel limit and memory behaviour cannot be observed because node_modules is absent.

**Blockers (why this is not confirmed)**

- sharp 0.34.5's actual default limitInputPixels, and its peak memory and CPU when decoding a small, highly compressed input of about 16000x16000 pixels, cannot be observed: node_modules is absent and installing is prohibited.
- The deployed Vercel function memory size, maxDuration, concurrency, and billing for /api/image are not in the repository. There is no vercel.json and no route segment config. These decide whether the impact is a shared availability failure or bounded spend.
- Whether the platform enforces any limit on outbound fetch response bodies cannot be determined locally. A body-deadline fixture also cannot run, because Node's undici fetch fails to allocate WebAssembly memory under the sandbox's 8GiB address-space limit.

**How to resolve**

- **Local check:** In an isolated sandbox with no network and resource limits, install sharp 0.34.5 exactly as pinned in package-lock.json. Create a PNG of a few KB that declares about 16000x16000 pixels, which is under the documented default of 268402689 pixels. Run it through the route's exact pipeline: sharp(buf).resize({width:2400, withoutEnlargement:true}).webp({quality:80}).toBuffer(). Record peak RSS and CPU time, and stop at the first measurement. Separately, serve a body slowly over a loopback socket inside the sandbox using a Node runtime whose fetch can start, with the sandbox's address-space limit raised enough for undici's WebAssembly. Apply the same AbortController and clearTimeout pattern and confirm that arrayBuffer() finishes after more than 10 seconds without aborting.
- **Owner-observed check:** The owner should check, without load testing, the Vercel function's configured memory, maxDuration, and concurrency for /api/image, and whether any platform cap applies to outbound response bodies. The fix is in source: keep the abort timer armed until decoding finishes (or use AbortSignal.timeout covering the body read), reject responses whose Content-Length or streamed byte count exceeds a cap such as 20 MB, pass sharp({limitInputPixels: <realistic bound, e.g. 50_000_000>}), and narrow the s3.us-west-2.amazonaws.com allowlist entry to the owner's bucket paths.


## 10. Repeated .md suffixes may make accept-md fetch itself in a nested chain

- **Fingerprint:** `accept-md:rewrite:nested-md-suffix-self-fetch-chain`
- **Boundary at risk:** Self-request amplification

An anonymous visitor can request a path such as /a.md.md.md. The `/:path*.md` beforeFiles rewrite (next.config.mjs:16-17) sends it to /api/accept-md with the remaining inner suffixes kept, for example path `a.md.md`. The route rebuilds the pathname from those segments (route.ts:35). It removes only the `accept` header (route.ts:37). It then calls getMarkdownForPath with baseUrl = request.nextUrl.origin (route.ts:40-42), so the page fetch goes back through the public router. If the runtime fetches baseUrl + pathname unchanged, that request ends in `.md` again and the same rewrite catches it. This happens once per remaining suffix. Each outer call stays open while it waits on its child, for up to fetchTimeoutMs = 10s (route.ts:23). One anonymous request with k suffixes could then hold up to k nested serverless invocations open at the same time. The only bounds the repository shows are the URL length limit and whatever loop protection the platform has. The leaf most likely returns 404, and each level turns that into a 404 (route.ts:61), so the effect is wasted function concurrency and compute, not data exposure. The repository source alone does not show the claimed fan-out of "hundreds or thousands". It depends on the runtime fetch behaviour, the platform URL length limit, and Vercel loop detection, none of which can be observed locally.

**Claimed root cause.** The self-fetch pathname is rebuilt from request path segments without rejecting or removing a trailing `.md`. No recursion marker header and no depth check is added; only the `accept` header is deleted, which breaks the Accept-header rewrite loop but not the suffix rewrite. The accept-md config uses include ['/**'] and excludes only ['/api/**','/_next/**'], so pathnames ending in `.md` are not excluded and can re-enter the `/:path*.md` beforeFiles rewrite through the public origin.

**Source trace**

1. `next.config.mjs:16` (entrypoint, `rewrites.beforeFiles`): The `/:path*.md` source matches any public path ending in .md, including /a.md.md, and is reachable by anonymous visitors.
1. `app/api/accept-md/[[...path]]/route.ts:35` (propagation, `GET`): pathname = `/${path.join("/")}`. When the request had more than one suffix, the rebuilt pathname still ends in .md.
1. `app/api/accept-md/[[...path]]/route.ts:37` (propagation, `GET`): Only the `accept` header is deleted from the forwarded headers. No loop marker or depth header is added.
1. `app/api/accept-md/[[...path]]/route.ts:40` (sink, `GET`): getMarkdownForPath is called with the .md-suffixed pathname and baseUrl request.nextUrl.origin (line 42). If the runtime fetches baseUrl + pathname, that request re-enters the rewrite at next.config.mjs:16 and adds one more nested invocation.

**Evidence**

- `app/api/accept-md/[[...path]]/route.ts:10`: The include pattern ['/**'] and the exclude list at line 11, which has only ['/api/**','/_next/**'], do not exclude pathnames ending in .md.
- `app/api/accept-md/[[...path]]/route.ts:23`: fetchTimeoutMs is 10_000, so each nested invocation can wait up to 10s on its child.
- `app/api/accept-md/[[...path]]/route.ts:42`: baseUrl is request.nextUrl.origin, so the self-fetch goes through the full public router and its rewrites.
- `next.config.mjs:17`: The destination /api/accept-md/:path* keeps the inner .md suffixes in the path.
- `app/api/accept-md/[[...path]]/route.ts:61`: A child 404 ('Failed to fetch page: 404') becomes a 404 at each level, so the chain mainly wastes concurrency and compute rather than exposing data.

**Blockers (why this is not confirmed)**

- accept-md-runtime@5.0.2 (package-lock.json:4432) is not installed locally, and installing is prohibited. Without it, there is no way to tell whether getMarkdownForPath rejects or strips .md pathnames, rewrites them, adds a loop-marker header, or limits recursion. This fact decides whether the chain exists at all.
- Next.js 16.1.6 is absent, so its path-to-regexp matching of `/:path*.md` against `/a.md.md` cannot be run with the real framework code. Source reading suggests path=`a.md` because the pattern is end-anchored, but this has not been observed.
- Platform behaviour cannot be observed locally: whether Vercel loop detection (508 INFINITE_LOOP_DETECTED, which may be triggered by the forwarded x-vercel-* headers), the platform URL length limit, function concurrency limits, or WAF rules stop the self-request chain at a small depth.

**How to resolve**

- **Local check:** In an offline sandbox with node_modules installed from package-lock.json, first read node_modules/accept-md-runtime's getMarkdownForPath source for any .md stripping, include/exclude handling of .md, loop-marker header, or depth guard. Then run `next build && next start` on 127.0.0.1. Wrap global fetch in the route, or use a local logging proxy, to log each self-fetch URL. Send a single request to /a.md.md.md (3 suffixes). The issue is shown if the log has nested fetches to /a.md.md, then /a.md, then /a, and /api/accept-md is invoked 3 times. Stop after that request. Regression check after the fix: /a.md.md must cause at most one self-fetch and must not re-enter /api/accept-md.
- **Owner-observed check:** On a preview deployment, the owner sends exactly one request to /index.md.md (2 levels only) and checks the function logs. The issue is confirmed if /api/accept-md runs 2 or more times for that one request. It is mitigated by the platform if Vercel returns 508 INFINITE_LOOP_DETECTED or stops at depth 1. The owner should also record the platform's maximum URL length and any firewall or rate rule that limits self-requests. Do not test deep chains. Suggested fix: in the route, return 404 when the last path segment ends in .md, and add an internal marker header (for example x-accept-md-internal: 1) to the forwarded headers, so that requests carrying it are rejected or served as HTML without the markdown rewrite.


## 11. Random writing slugs trigger an uncached full Notion database scan on every request, letting anonymous traffic use up the shared Notion rate limit

- **Fingerprint:** `lib/notion.ts:fetchPostBySlug:uncached-full-scan-on-slug-miss`
- **Boundary at risk:** Notion rate-limit exhaustion

Anonymous visitors can request /writing/<slug> or /api/writing/<slug> with any slug. The page calls noStore() (app/writing/[slug]/page.tsx:78), so it renders fresh on every request. A slug that is not in the cached post list goes to fetchPostBySlug (lib/notion.ts:255). That function makes 1 Slug-filter dataSources.query (line 200). It then calls the uncached fetchAllPosts() (line 227), which pages through the whole blog database at ceil(N/100) queries (lines 136-149). Finally it makes 1 pages.retrieve (line 233) before returning null, which becomes a 404. That is 1 + ceil(N/100) + 1 calls to the Notion API per request, with no negative cache, and each new slug misses again. I independently reproduced this in the sandbox with a mocked client and 250 dummy posts: three different random slugs each made 5 calls (1 filter query, 3 list pages, 1 retrieve), and a slug in the cached list made 0. Correction to the hunter's wording: when Notion returns 429, the catch at line 221 swallows the filter-query error and the full scan is attempted. The first list page then also fails and the error propagates, so a throttled request costs 2 calls instead of 1, not a completed full scan. The amplification is therefore mainly on the unthrottled path. Separately, each view of a real post re-runs the recursive fetchPostBlocks (lib/notion.ts:529-569) because of noStore(). That is one blocks.children.list per page of children of every nested block, plus an outbound image range-fetch per image block (line 551). React cache() only shares the lookup between generateMetadata and the page within a single request. All Notion calls share one integration token. If that token's rate limit is low (Notion documents about 3 requests/second on average), a modest anonymous request stream with unique slugs could keep it throttled. Real article views would then show the timeout or unavailable state, and refreshing the cached post list could fail. The repository has no middleware, proxy or rate limit.

**Claimed root cause.** On a cache miss, fetchPostBySlug calls the uncached fetchAllPosts() at lib/notion.ts:227 instead of the unstable_cache-backed fetchCachedAllPosts() (lines 177-185), which resolveWritingPostBySlug has already consulted. The miss path has no negative cache. pages.retrieve is called for any slug, not only UUID-shaped ones. The catch at line 221 treats every error (including 429 and timeouts) as a missing Slug property. Neither dynamic writing route has a request rate limit.

**Source trace**

1. `app/writing/[slug]/page.tsx:79` (entrypoint, `ArticlePage`): Anonymous slug path segment. noStore() at line 78 makes every request render fresh. The same lookup is reachable through GET /api/writing/[slug] (app/api/writing/[slug]/route.ts:12).
1. `lib/notion.ts:255` (propagation, `resolveWritingPostBySlug`): When the slug is not in the cached list (fetchCachedAllPosts, line 253), fetchPostBySlug is called.
1. `lib/notion.ts:200` (propagation, `fetchPostBySlug`): One Slug-filter dataSources.query. Any error is swallowed by the catch at line 221 and execution continues.
1. `lib/notion.ts:227` (propagation, `fetchPostBySlug`): Uncached fetchAllPosts() pages through the whole blog database (fetchAllWritingPostsForDatabase, lines 136-149), ceil(N/100) queries.
1. `lib/notion.ts:233` (sink, `fetchPostBySlug`): One more pages.retrieve on the shared integration token for an arbitrary slug, then null, which renders as a 404.

**Evidence**

- `lib/notion.ts:227`: Calls fetchAllPosts() rather than fetchCachedAllPosts(), so it bypasses the unstable_cache at lines 177-181 (revalidate 600).
- `lib/notion.ts:221`: The catch-all logs and falls through on any error, including 429 and timeouts. In the reproduction, a 429 led to one extra list query before the error propagated (2 calls in total).
- `app/writing/[slug]/page.tsx:78`: noStore() makes every page request fresh, so neither the route cache nor the CDN absorbs unique slugs.
- `lib/notion.ts:554`: For real posts, every view recursively re-fetches nested blocks, and line 551 fetches image dimensions per image block, with no caching.
- `lib/notion.ts:25`: The only bound is the client's 8s timeout per call. There is no concurrency limit, rate limit or negative cache. No middleware or proxy file exists, and next.config.mjs only sets headers.

**Blockers (why this is not confirmed)**

- The integration's actual Notion rate limit, and how Notion behaves under sustained 429s, are third-party behaviour that cannot be observed without contacting Notion.
- Vercel WAF, firewall or rate-limit rules on the deployed project are not in the repository.
- The automatic retry policy of the installed @notionhq/client 5.x (which may multiply calls on 429) cannot be inspected because node_modules is absent.
- The real blog database size N, which sets the ceil(N/100) multiplier, is unknown. The minimum is 3 calls per miss.

**How to resolve**

- **Local check:** Use a mocked-client unit test or sandbox harness built from lib/notion.ts lines 129-257. Assert that an unknown slug makes 1 + ceil(N/100) + 1 Notion calls; the verifier observed 5 at N=250. Assert that a 429 on the filter query leads to exactly one more failing list query. After the fix (reuse fetchCachedAllPosts, call pages.retrieve only for UUID-shaped slugs, rethrow errors that are not 'missing property' validation errors, optionally add a short negative cache), assert that a random non-UUID slug makes at most 1 Notion call and a 429 makes no further calls.
- **Owner-observed check:** The owner checks the Vercel firewall and rate-limit settings for /writing/* and /api/writing/*. They confirm the integration's Notion rate limit and the installed SDK version's retry settings. On a preview deployment with a separate test integration and database, they send a small, rate-capped set of unique random slugs and count Notion requests per request in the logs. Do not load-test production.


## 12. Anonymous /api/commits/history spends the owner's GitHub token on several API calls per request (at least 7 when the owner has 5 or more repos), with no cache or rate limit

- **Fingerprint:** `lib/github:fetchCommitHistory:uncached-per-request-github-fanout`
- **Boundary at risk:** GitHub token rate-limit exhaustion

Any anonymous visitor can call GET /api/commits/history. The route is marked force-dynamic, so every request runs fetchCommitHistory(30). That function makes GitHub REST calls one after another: 1 events call, 1 repos call (per_page=5), and then 1 commits call for each repo returned plus each owner-configured GITHUB_EXTRA_REPOS entry. None of these fetches sets a cache option, and the repo has no middleware, proxy, or rate gate. When GITHUB_TOKEN is set, every call carries the owner's Bearer token and counts against that identity's primary limit of 5000 requests per hour, which works out to roughly 715 anonymous GETs per hour at 7 calls each. Once the limit is spent, the events call fails, fetchCommitHistory returns [] after just 1 call, and so it costs only about 1 request per hour to keep the budget exhausted. While it is exhausted, the site's commit feed is empty, and any other tooling that shares the token is denied, until the hourly window resets. Without a token, the unauthenticated limit of 60 requests per hour per egress IP runs out after about 9 requests, but that only breaks the feed. A sandboxed harness (the unchanged function body with only type annotations removed, and a stubbed fetch) recorded 7 authenticated GitHub fetches per call on two calls in a row, with no reuse. Two things could not be observed locally: whether the Next.js runtime caches these fetches, and whether Vercel controls the traffic in front of the route.

**Claimed root cause.** app/api/commits/history/route.ts sets `dynamic = "force-dynamic"` (line 4), which overrides `revalidate = 600` (line 5) and makes the handler run on every request. The fetch calls in lib/github.ts (lines 48, 97, 127) set no `next.revalidate` or `cache` option, and every call attaches `Authorization: Bearer GITHUB_TOKEN` (line 18). Each anonymous GET therefore fans out to several uncached GitHub calls billed to the owner's identity, and nothing in the source limits the request rate.

**Source trace**

1. `app/api/commits/history/route.ts:7` (entrypoint, `GET`): Anonymous GET handler with no input and no rate gate. force-dynamic (line 4) makes revalidate=600 (line 5) ineffective.
1. `app/api/commits/history/route.ts:10` (propagation, `GET`): Calls fetchCommitHistory(30) on every request.
1. `lib/github.ts:48` (propagation, `fetchCommitHistory`): Events fetch with no cache option, sent with the token headers from headers() at lines 12-21. If it fails (for example after the limit is exhausted), the function returns [] after this single call.
1. `lib/github.ts:97` (propagation, `fetchCommitHistory`): Repos fetch with no cache option (/user/repos?type=owner&sort=pushed&per_page=5 when a token is set).
1. `lib/github.ts:127` (sink, `fetchCommitHistory`): Commits fetch with no cache option, run in sequence for each repo: up to 5 from the repos response plus any GITHUB_EXTRA_REPOS entries. Every call is billed to the owner's GitHub rate limit.

**Evidence**

- `app/api/commits/history/route.ts:4`: `export const dynamic = "force-dynamic"` makes the handler run on every request and overrides `revalidate = 600` at line 5.
- `lib/github.ts:18`: The Authorization: Bearer GITHUB_TOKEN header is added to every GitHub call whenever the env var is set.
- `lib/github.ts:125`: The per-repo loop at lines 125-130 makes 1 sequential fetch per repo. The number of extra repos comes from the owner-set GITHUB_EXTRA_REPOS, not from the attacker.
- `components/commits-section.tsx:105`: refreshInterval 600_000 (with dedupingInterval at line 106) throttles only the site's own SWR client. Direct callers of the API are not limited.
- `next.config.mjs:33`: headers() adds only Vary: Accept. The repo has no middleware.ts or proxy.ts, so no source-visible rate limit or cache sits in front of the route.

**Blockers (why this is not confirmed)**

- Whether GITHUB_TOKEN is set in production, and whether it is a personal token shared with the owner's other tooling or a dedicated fine-grained or App token with its own budget, is a deployment fact. It decides whether there is any impact beyond the site's own commit feed.
- Whether Vercel WAF or Firewall rate-limit rules, or edge caching, limit anonymous request volume to /api/commits/history is not visible in the repository.
- Whether the Next.js 16.1.6 runtime leaves these fetches uncached under force-dynamic (expected: no-store) cannot be observed, because node_modules is absent and installing is prohibited. The local harness ran the function outside Next.js.

**How to resolve**

- **Local check:** Done: in the sandbox, lib/github.ts with only its type annotations removed was run under plain node with GITHUB_TOKEN set to a dummy value and fetch stubbed (events returns 1 PushEvent; repos returns 5 repos). Two calls to fetchCommitHistory(30) made 7 authenticated api.github.com fetches each, 14 in total, with no reuse (scratch/check-1.txt, promoted to agents/verifier-08/artifacts/check-1.txt). Remaining: with dependencies installed in an offline sandbox, call the real Next.js route handler twice, using the production build and runtime, with fetch stubbed. Confirm that the count of api.github.com fetches rises by 7 on each call and that the Next data cache serves nothing.
- **Owner-observed check:** Owner, on a preview deployment that uses the production token configuration: (1) record X-RateLimit-Remaining for the token, for example with `curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/rate_limit`; (2) send exactly 2 GET requests to /api/commits/history; (3) check the value again and expect a drop of about 14 (2 + repo count per request). Also confirm whether the token is shared with other tooling and whether any Vercel Firewall rate limit or edge cache covers this path. Do not run an exhaustion test. Fix: remove force-dynamic and rely on `revalidate = 600`, or wrap fetchCommitHistory in unstable_cache, or pass `next: { revalidate: 600 }` on each fetch. Use a dedicated, read-only token with minimal scope. Regression check: repeated calls within the revalidate window trigger no new GitHub fetches.


## 13. Image optimizer accepts unlimited distinct Google favicon source URLs

- **Fingerprint:** `next.config.mjs:images.remotePatterns:favicon-query-unconstrained`
- **Boundary at risk:** Image optimization spend

The only entry in images.remotePatterns pins the protocol to https, the hostname to www.google.com and the pathname to /s2/favicons. It sets no 'search' constraint, and images.unoptimized is not set. An anonymous visitor can therefore send /_next/image?url=https://www.google.com/s2/favicons?domain=<anything>&w=<allowed>&q=<allowed> with any number of distinct query values (domain, domain_url, sz, or extra parameters). If Next.js 16.1.6 permits any query when 'search' is omitted, each distinct value costs an upstream fetch from Google, a sharp transform and a separate optimizer-cache entry. On Vercel's managed optimizer it may also count as a separately billed source image. Per-request work is small: favicons are tiny, and width and quality come from the framework allowlists. The risk is unbounded cardinality, meaning cache growth and spend, not per-request amplification. The site's legitimate favicon sources come from a finite owner-controlled set: tool URLs authored in Notion and the static portfolio data.

**Claimed root cause.** images.remotePatterns[0] in next.config.mjs omits the 'search' field (and the site does not mark these small favicons unoptimized). The optimizer's source allowlist therefore has unbounded cardinality, even though the legitimate set of favicon sources is finite and owner-controlled.

**Source trace**

1. `next.config.mjs:48` (entrypoint, `images.remotePatterns`): The built-in /_next/image endpoint can be reached anonymously. A url parameter of https://www.google.com/s2/favicons?domain=<any> matches the protocol, hostname and pathname, and no search constraint is configured.
1. `components/tool-parts.tsx:35` (propagation, `ToolIcon favicon src`): The legitimate source is https://www.google.com/s2/favicons?domain=${hostname}&sz=32, rendered through OptimizedImage, which wraps next/image (components/optimized-image.tsx:11). The hostname comes from tool URLs authored in Notion, so only the query string distinguishes legitimate sources.
1. `next.config.mjs:51` (sink, `images.remotePatterns[0].hostname`): The default Next.js optimizer fetches every allowed remote URL, transforms it and caches it separately. Each distinct allowed query becomes a new fetch, transform and cache entry (framework behaviour, not visible locally).

**Evidence**

- `next.config.mjs:52`: pathname '/s2/favicons' is fixed. The pattern has no 'search' property, and the images config has no 'unoptimized' flag.
- `lib/portfolio-data.ts:91`: A second legitimate favicon shape (domain_url=<encoded url>&sz=64) confirms that the query string carries all the variable data.
- `components/optimized-image.tsx:11`: OptimizedImage imports next/image, so favicon sources go through the built-in optimizer.

**Blockers (why this is not confirmed)**

- node_modules is absent and installing is prohibited, so Next.js 16.1.6's matching of a remotePattern without 'search' (whether any query string is accepted) cannot be checked locally. Its default limits (images.qualities, deviceSizes/imageSizes, maximum upstream response size, minimumCacheTTL, cache size eviction) cannot be checked either.
- Deployment facts outside the repository: whether production runs on Vercel's managed Image Optimization, how unique source images are counted and billed, and whether any WAF or rate limit sits in front of /_next/image.

**How to resolve**

- **Local check:** In an isolated, offline next@16.1.6 install, with a minimal app that uses this exact images config and a mocked or loopback upstream, run the framework's remotePatterns matcher (matchRemotePattern / hasRemoteMatch from next/dist/shared/lib/match-remote-pattern) against https://www.google.com/s2/favicons?domain=a.invalid&sz=32 and ...?domain=b.invalid&x=1. Expected if the issue is real: both match. Optionally request /_next/image?url=<encoded>&w=32&q=75 for two distinct domains, confirm neither returns 400, and confirm two distinct cache entries appear under .next/cache/images.
- **Owner-observed check:** Owner check, read-only: in the Vercel dashboard (Usage > Image Optimization), see whether source-image counts treat query-distinct favicon URLs as separate sources. Also confirm whether a firewall or rate-limit rule covers /_next/image. Fix: add a 'search' constraint or an explicit per-domain list, or set unoptimized on the 32-64px favicon images.

