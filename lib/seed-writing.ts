import type { NotionWritingPost } from "@/lib/notion"

type SeedDef = {
  title: string
  slug: string
  date: string | null
}

/** Static list used when DialKit "Seed writing" is enabled (local preview data). */
const SEED_DEFS: SeedDef[] = [
  { title: "Building a design system from scratch", slug: "design-system-from-scratch", date: "2025-03-15" },
  { title: "Why I stopped using useEffect for data fetching", slug: "stop-using-useeffect", date: "2025-02-28" },
  { title: "Framer Motion patterns I keep reaching for", slug: "framer-motion-patterns", date: "2025-01-20" },
  { title: "Notes on typography at small sizes", slug: "typography-small-sizes", date: "2024-12-10" },
  { title: "Server Components changed how I think about state", slug: "server-components-state", date: "2024-11-05" },
  { title: "A short guide to easing curves", slug: "easing-curves", date: "2024-10-18" },
  { title: "The case for boring tech in side projects", slug: "boring-tech-side-projects", date: "2024-09-02" },
  { title: "How I structure my Next.js projects", slug: "nextjs-project-structure", date: "2024-08-14" },
  { title: "Tailwind tips I wish I knew earlier", slug: "tailwind-tips", date: "2024-07-30" },
  { title: "On shipping fast without cutting corners", slug: "shipping-fast", date: "2024-06-11" },
]

export function generateSeedPosts(count: number): NotionWritingPost[] {
  const n = Math.min(Math.max(0, count), SEED_DEFS.length)

  return Array.from({ length: n }, (_, i) => {
    const def = SEED_DEFS[i]
    return {
      id: `seed-post-${i}`,
      title: def.title,
      slug: def.slug,
      date: def.date,
      url: `/writing/${def.slug}`,
    } satisfies NotionWritingPost
  })
}
