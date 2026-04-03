import type { NotionToolItem, ToolCategory } from "@/lib/notion"

type SeedDef = {
  name: string
  url: string | null
  description: string
  category: ToolCategory
}

/** Static list used when DialKit “Seed tools” is enabled (local preview data). */
const SEED_DEFS: SeedDef[] = [
  {
    name: "DialKit",
    url: "https://www.npmjs.com/package/dialkit",
    description: "Floating control panel for tuning UI in development",
    category: "Build",
  },
  {
    name: "Cursor",
    url: "https://cursor.com",
    description: "AI-native code editor",
    category: "Productivity",
  },
  {
    name: "Framer Motion",
    url: "https://www.framer.com/motion/",
    description: "Animation library for React",
    category: "Build",
  },
  {
    name: "Notion",
    url: "https://www.notion.so",
    description: "Docs, databases, and publishing",
    category: "Productivity",
  },
  {
    name: "Figma",
    url: "https://www.figma.com",
    description: "Interface design and prototypes",
    category: "Build",
  },
  {
    name: "Raycast",
    url: "https://www.raycast.com",
    description: "Launcher and quick actions",
    category: "Productivity",
  },
  {
    name: "Vercel",
    url: "https://vercel.com",
    description: "Deploy and host frontend projects",
    category: "Build",
  },
  {
    name: "Linear",
    url: "https://linear.app",
    description: "Issue tracking for product teams",
    category: "Productivity",
  },
  {
    name: "typescript",
    url: "https://www.typescriptlang.org",
    description: "Typed JavaScript at scale",
    category: "Skills",
  },
  {
    name: "react",
    url: "https://react.dev",
    description: "UI components and state",
    category: "Skills",
  },
  {
    name: "tailwind",
    url: "https://tailwindcss.com",
    description: "Utility-first styling",
    category: "Skills",
  },
  {
    name: "nextjs",
    url: "https://nextjs.org",
    description: "React framework for the web",
    category: "Skills",
  },
  {
    name: "Obsidian",
    url: "https://obsidian.md",
    description: "Local markdown notes",
    category: "Productivity",
  },
  {
    name: "Sharp",
    url: "https://sharp.pixelplumbing.com",
    description: "Image processing in Node",
    category: "Build",
  },
  {
    name: "esLint",
    url: "https://eslint.org",
    description: "Linting for JavaScript and TypeScript",
    category: "Build",
  },
  {
    name: "Arc",
    url: "https://arc.net",
    description: "Spatial browser tabs",
    category: "Productivity",
  },
  {
    name: "astro",
    url: "https://astro.build",
    description: "Content-focused web framework",
    category: "Skills",
  },
  {
    name: "playwright",
    url: "https://playwright.dev",
    description: "End-to-end browser testing",
    category: "Skills",
  },
  {
    name: "Squoosh",
    url: "https://squoosh.app",
    description: "Compress images in the browser",
    category: "Productivity",
  },
  {
    name: "Biome",
    url: "https://biomejs.dev",
    description: "Fast linter and formatter for JS/TS",
    category: "Build",
  },
]

export function generateSeedTools(count: number): NotionToolItem[] {
  const n = Math.min(Math.max(0, count), SEED_DEFS.length)
  const now = new Date().toISOString()

  return Array.from({ length: n }, (_, i) => {
    const def = SEED_DEFS[i]
    return {
      id: `seed-tool-${i}`,
      name: def.name,
      url: def.url,
      description: def.description,
      category: def.category,
      lastEdited: now,
    } satisfies NotionToolItem
  })
}
