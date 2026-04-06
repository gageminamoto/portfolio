import type { ProjectItem } from "@/lib/portfolio-data"

type SeedDef = {
  name: string
  url: string | null
  description: string
  status: "production" | "building"
  year: number
}

/** Static list used when DialKit "Seed projects" is enabled (local preview data). */
const SEED_DEFS: SeedDef[] = [
  { name: "Personal Site", url: null, description: "Portfolio and writing", status: "production", year: 2026 },
  { name: "Spell UI", url: null, description: "Refined UI components for design engineers", status: "building", year: 2026 },
  { name: "Early Access", url: null, description: "Waitlist and launch page", status: "production", year: 2025 },
  { name: "Music Cards", url: null, description: "Shareable album art cards", status: "production", year: 2025 },
  { name: "Blur Reveal", url: null, description: "Scroll-driven blur animation", status: "production", year: 2025 },
  { name: "Spell UI Docs", url: null, description: "Documentation site for Spell UI", status: "building", year: 2026 },
  { name: "Emojicord", url: null, description: "Custom emoji server manager", status: "production", year: 2024 },
  { name: "Spell UI Launch", url: null, description: "Launch page with component previews", status: "production", year: 2026 },
  { name: "Piiku Site", url: null, description: "Community site for Hawai'i designers", status: "building", year: 2025 },
  { name: "Color Engine", url: null, description: "Perceptual color palette generator", status: "production", year: 2024 },
]

export function generateSeedProjects(count: number): ProjectItem[] {
  const n = Math.min(Math.max(0, count), SEED_DEFS.length)

  return Array.from({ length: n }, (_, i) => {
    const def = SEED_DEFS[i]
    return {
      name: def.name,
      url: def.url ?? undefined,
      description: def.description,
      status: def.status,
      year: def.year,
    } satisfies ProjectItem
  })
}
