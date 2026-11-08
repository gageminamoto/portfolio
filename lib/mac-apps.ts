/**
 * The hand-picked tools shown on the homepage as a row of Mac app icons.
 *
 * Icons come from two places, in this order:
 * 1. `public/tools/<slug>.png` — a real macOS app icon. Run
 *    `bash scripts/export-mac-app-icons.sh` on a Mac with the apps installed
 *    to export them (the file is picked up automatically when it exists).
 * 2. A mock-up drawn to Apple's macOS icon guidelines (`MacAppIcon`), used for
 *    tools that have no Mac app or until the real icon is exported.
 */

export type MacAppSlug =
  | "figma"
  | "paper"
  | "linear"
  | "agentation"
  | "dialkit"
  | "inflight"
  | "grok-bot"
  | "raycast"
  | "granola"

export interface MacApp {
  slug: MacAppSlug
  name: string
  url: string
  /** Short, plain description shown in the tooltip. */
  description: string
}

export interface MacAppGroup {
  label: string
  apps: MacApp[]
}

export const MAC_APP_GROUPS: MacAppGroup[] = [
  {
    label: "Build",
    apps: [
      {
        slug: "figma",
        name: "Figma",
        url: "https://www.figma.com",
        description: "Interface design and prototypes",
      },
      {
        slug: "paper",
        name: "Paper",
        url: "https://paper.design",
        description: "Fast, focused design canvas",
      },
      {
        slug: "linear",
        name: "Linear",
        url: "https://linear.app",
        description: "Issues, projects, and roadmaps",
      },
    ],
  },
  {
    label: "Plugins",
    apps: [
      {
        slug: "agentation",
        name: "Agentation",
        url: "https://agentation.com",
        description: "Annotate the UI for coding agents",
      },
      {
        slug: "dialkit",
        name: "DialKit",
        url: "https://www.npmjs.com/package/dialkit",
        description: "Tune UI values live in development",
      },
      {
        slug: "inflight",
        name: "Inflight",
        url: "https://inflight.co",
        description: "Visual review on preview builds",
      },
    ],
  },
  {
    label: "Productivity",
    apps: [
      {
        slug: "grok-bot",
        name: "Grok Bot",
        url: "https://grok.com",
        description: "AI assistant",
      },
      {
        slug: "raycast",
        name: "Raycast",
        url: "https://www.raycast.com",
        description: "Launcher and quick actions",
      },
      {
        slug: "granola",
        name: "Granola",
        url: "https://www.granola.ai",
        description: "AI notes for meetings",
      },
    ],
  },
]

/** Map of slug → public path for exported real icons, e.g. `{ figma: "/tools/figma.png" }`. */
export type MacAppIconImages = Partial<Record<MacAppSlug, string>>
