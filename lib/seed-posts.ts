import type { NotionWritingPost, NotionBlock } from "@/lib/notion"

const TITLES = [
  "On designing for quiet moments",
  "Why I stopped chasing polish",
  "Building tools that disappear",
  "The gap between design and craft",
  "Small software, big feelings",
  "Notes on working in public",
  "What I learned from shipping weekly",
  "Texture in digital interfaces",
  "A case for slower software",
  "How constraints shape taste",
  "Design as translation",
  "The invisible details that matter",
  "Making things no one asked for",
  "Lessons from a side project graveyard",
  "When good enough is great",
  "Typography as interface",
  "Why I keep a design journal",
  "The art of the default state",
  "Rethinking navigation patterns",
  "Components are just opinions",
]

export function generateSeedPosts(count: number): NotionWritingPost[] {
  const now = Date.now()
  const day = 86_400_000

  return Array.from({ length: Math.min(count, TITLES.length) }, (_, i) => {
    const date = new Date(now - (i + 1) * day * 3)
    return {
      id: `seed-${i}`,
      title: TITLES[i],
      slug: `seed-${i}`,
      date: date.toISOString().split("T")[0],
      url: "",
    }
  })
}

export function getSeedPost(slug: string): NotionWritingPost | null {
  const index = parseInt(slug.replace("seed-", ""), 10)
  if (isNaN(index) || index < 0 || index >= TITLES.length) return null
  const posts = generateSeedPosts(TITLES.length)
  return posts[index] ?? null
}

const SEED_SECTIONS = [
  { heading: "The invisible interface", level: 2, paragraphs: [
    "There's a particular kind of satisfaction in making something that feels obvious in hindsight. The best interfaces don't announce themselves — they recede, leaving only the task at hand. I've been thinking about this a lot lately.",
    "The goal isn't to make something beautiful for the sake of beauty. It's to make something so clear that the user forgets they're using a tool at all. That's the highest compliment an interface can receive.",
  ]},
  { heading: "Decisions compound", level: 2, paragraphs: [
    "Most of the time, the hard part isn't building the thing. It's deciding what the thing should be. The gap between an idea and its execution is filled with thousands of micro-decisions, each one shaping the final result in ways you can't predict.",
    "Every pixel you place, every interaction you define, every word you choose — they compound. A single questionable decision is invisible. A hundred of them define the entire experience.",
  ]},
  { heading: "Why defaults matter", level: 3, paragraphs: [
    "The default state is the most important state. Most users will never change a setting, never customize a layout, never read the documentation. What you ship as the default is what you're really shipping.",
  ]},
  { heading: "Craft as care", level: 2, paragraphs: [
    "I keep coming back to this notion that craft is really about care. Not perfection — care. The difference is subtle but important. Perfection is about the maker. Care is about the person on the other end.",
    "When I look at the tools I reach for most, they share a common trait: they stay out of the way. They don't try to be clever. They don't surprise me. They just work, consistently, every single time.",
  ]},
]

function makeRichText(text: string) {
  return [{
    type: "text" as const,
    text: { content: text, link: null },
    plain_text: text,
    annotations: {
      bold: false, italic: false, strikethrough: false,
      underline: false, code: false, color: "default" as const,
    },
    href: null,
  }]
}

const BLOCK_BASE = {
  parent: { type: "page_id" as const, page_id: "seed" },
  created_time: new Date().toISOString(),
  last_edited_time: new Date().toISOString(),
  created_by: { object: "user" as const, id: "seed" },
  last_edited_by: { object: "user" as const, id: "seed" },
  has_children: false,
  archived: false,
  in_trash: false,
  object: "block" as const,
}

export function generateSeedBlocks(): NotionBlock[] {
  const blocks: unknown[] = []
  let idx = 0

  for (const section of SEED_SECTIONS) {
    const headingType = `heading_${section.level}` as const
    blocks.push({
      ...BLOCK_BASE,
      id: `seed-block-${idx++}`,
      type: headingType,
      [headingType]: {
        rich_text: makeRichText(section.heading),
        is_toggleable: false,
        color: "default",
      },
    })

    for (const text of section.paragraphs) {
      blocks.push({
        ...BLOCK_BASE,
        id: `seed-block-${idx++}`,
        type: "paragraph",
        paragraph: {
          rich_text: makeRichText(text),
          color: "default",
        },
      })
    }
  }

  return blocks as NotionBlock[]
}
