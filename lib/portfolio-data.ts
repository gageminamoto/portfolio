// Portfolio data structured for easy customization and future Notion API integration.
// When connecting to Notion, replace static arrays with fetched data from the API.
// The "writing" section is designed to be driven by a Notion CMS.

export interface ToolItem {
  name: string
  url: string
  description: string
}

export interface WritingItem {
  title: string
  slug: string
  date?: string
  // When connected to Notion, these fields would come from the API:
  // notionPageId?: string
  // lastEdited?: string
  // tags?: string[]
}

export interface LearningItem {
  name: string
  url?: string
  description: string
}

export interface HobbyItem {
  name: string
  url?: string
  description: string
}

export interface ProjectItem {
  name: string
  url?: string
  description: string
  status: "production" | "building"
}

export interface SocialLink {
  platform: string
  url: string
  label: string
}

export interface PortfolioData {
  name: string
  bio: string
  email?: string
  socials: SocialLink[]
  build: ToolItem[]
  productivity: ToolItem[]
  writing: WritingItem[]
  hobbies: HobbyItem[]
  projects: ProjectItem[]
  learning: LearningItem[]
}

export const portfolioData: PortfolioData = {
  name: "Gage Minamoto",
  bio: "Sofware Designer building everyday products. Growing Hawai'i's local design community. Building [Mizen](https://www.mizen.recipes/).",
  email: "info@gageminamoto.com",
  socials: [
    { platform: "twitter", url: "https://x.com/gageminamoto", label: "Twitter" },
    { platform: "github", url: "https://github.com/gageminamoto", label: "GitHub" },
    { platform: "linkedin", url: "https://linkedin.com/in/gageminamoto", label: "LinkedIn" }, // Fixed closing quotation mark
  ],
  build: [
    { name: "Cursor", url: "https://www.cursor.com/", description: "Code editor" },
    { name: "Conductor", url: "https://conductor.is/", description: "Agent orchestration" },
    { name: "v0", url: "https://v0.app/", description: "Simple Prototypes & quick sharing" },
    { name: "Figma", url: "https://www.figma.com/", description: "Design and Collaboration" },
    { name: "Paper", url: "https://paper.design/", description: "Code-native design canvas for agents" },
  ],
  productivity: [
    { name: "Raycast", url: "https://raycast.com/", description: "Launcher" },
    { name: "Notion", url: "https://www.notion.so/", description: "Notes and project management" },
    { name: "Inflight", url: "https://www.inflight.co/", description: "Design feedback" },
    { name: "CleanShot X", url: "https://cleanshot.com/", description: "Screen capture and annotation" },
    { name: "Eagle", url: "https://en.eagle.cool/", description: "Inspo library" },
    { name: "Typefully", url: "https://typefully.com/", description: "Writing + scheduling" },
    { name: "Superwhisper", url: "https://superwhisper.com/", description: "Voice dictation" },
  ],
  writing: [
    { title: "Blog 1", slug: "blog-1" },
    { title: "Blog 2", slug: "blog-2" },
    { title: "Blog 3", slug: "blog-3" },
  ],
  hobbies: [
    { name: "Modded Minecraft", url: "https://www.minecraft.net/", description: "Rn playing as a farmer sim" },
    { name: "Stardew Valley", url: "https://www.stardewvalley.net/", description: "Best chill game" },
    { name: "Pokemon cards", url: "https://www.pokemon.com/us/pokemon-tcg", description: "We're only collecting cute ones" },
    { name: "Design books", description: "Addicted to adding them" },
    { name: "Camping", description: "Eating outdoors is peak" },
  ],
  projects: [
    { name: "Mizen", url: "https://www.mizen.recipes/", description: "The calmest way to cook online recipes", status: "production" },
    { name: "Umi Language Learning", url: "https://umiapp.co/", description: "Language learning through TV and movies", status: "production" },
    { name: "Yahtzee Scorecard", url: "https://yahtzee-score-card.vercel.app/", description: "Play without the scratch pad, using just your phone and 5 dice", status: "production" },
  ],
  learning: [
    { name: "Animations.dev", url: "https://animations.dev/learn", description: "Course on how to create great animations." },
    { name: "Paper MCP", url: "https://paper.design/docs/mcp", description: "Learning how to do canvas to code and back" },
  ],
}

// Helper for future Notion API integration
// This function would be called from a Server Component or API route
// to fetch writing posts from a Notion database.
//
// export async function fetchWritingFromNotion(): Promise<WritingItem[]> {
//   const notion = new Client({ auth: process.env.NOTION_API_KEY })
//   const response = await notion.databases.query({
//     database_id: process.env.NOTION_DATABASE_ID!,
//     sorts: [{ property: 'Date', direction: 'descending' }],
//   })
//   return response.results.map((page: any) => ({
//     title: page.properties.Title.title[0]?.plain_text ?? '',
//     slug: page.properties.Slug.rich_text[0]?.plain_text ?? '',
//     date: page.properties.Date.date?.start,
//     notionPageId: page.id,
//   }))
// }
