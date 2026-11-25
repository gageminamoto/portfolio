import { listPublishedPosts } from "@/lib/public-routes"
import { portfolioData } from "@/lib/portfolio-data"
import { PUBLIC_PAGES, SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/site"

export const revalidate = 600

function markdownUrl(path: string) {
  return absoluteUrl(path === "/" ? "/index.md" : `${path}.md`)
}

export async function GET() {
  const posts = await listPublishedPosts()

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "Every page is also available as Markdown: add `.md` to the URL (use `/index.md` for the homepage) or request it with `Accept: text/markdown`.",
    "",
    "## Pages",
    "",
    ...Object.values(PUBLIC_PAGES).map(
      ({ path, name, description }) => `- [${name}](${markdownUrl(path)}): ${description}`
    ),
  ]

  if (posts.length > 0) {
    lines.push(
      "",
      "## Writing",
      "",
      ...posts.map((post) => {
        const published = post.date ? `: Published ${post.date.slice(0, 10)}` : ""
        return `- [${post.title}](${markdownUrl(`/writing/${post.slug}`)})${published}`
      })
    )
  }

  lines.push(
    "",
    "## Elsewhere",
    "",
    `- [Email](mailto:${portfolioData.email})`,
    ...portfolioData.socials.map(({ label, url }) => `- [${label}](${url})`),
    ""
  )

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
