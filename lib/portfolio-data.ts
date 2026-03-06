// Portfolio data structured for easy customization and future Notion API integration.
// When connecting to Notion, replace static arrays with fetched data from the API.
// The "writing" section is designed to be driven by a Notion CMS.

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

export interface ManifestoItem {
  principle: string
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
  extendedBio: string
  designManifesto: ManifestoItem[]
  email?: string
  socials: SocialLink[]
  writing: WritingItem[]
  hobbies: HobbyItem[]
  projects: ProjectItem[]
  learning: LearningItem[]
}

export const portfolioData: PortfolioData = {
  name: "Gage Minamoto",
  bio: "Software designer building everyday products.\n\nCurrently, designing the simple software at Negi.\n\nGrowing Hawai’i’s local design community.\n\nBuilding [Mizen](https://www.mizen.recipes/), calm and simple way to cook online recipes.",
  extendedBio: `I’m a software designer based in Hawai’i, focused on building everyday products that feel calm and intuitive. I care deeply about craft and believe great software should feel invisible; getting out of your way so you can focus on what matters. Currently building [Mizen](https://www.mizen.recipes/) and growing the local design community in Hawai’i.

I grew up in Hawai’i, surrounded by diverse cultures, including my Japanese heritage. This background taught me to value empathy, community, and restraint. That perspective continues to influence my approach to design, fostering care and curiosity for the people I’m designing for.

I first stepped into design through esports and brand marketing at the [University of Hawai’i](https://www.hawaii.edu/), then continued growing at [Servco](https://www.servco.com/). Those early experiences taught me how to move fast, collaborate across teams, and communicate with clarity.

Today, I use that foundation to design thoughtful software and brands in and for Hawai’i, where great design is still rare but deeply needed.`,
  designManifesto: [
    /*
    { principle: "Calm by default", description: "Software should reduce anxiety, not create it. Every interaction should feel\u00a0unhurried." },
    { principle: "Details compound", description: "Typography, spacing, and micro-interactions build trust over time. Sweat the small\u00a0stuff." },
    { principle: "Design with code", description: "The best design happens in the medium it ships in. Prototype in code, iterate\u00a0fast." },
    { principle: "Ship and learn", description: "Perfect is the enemy of shipped. Put it in front of real people and\u00a0listen." },
    */
  ],
  email: "info@gageminamoto.com",
  socials: [
    { platform: "twitter", url: "https://x.com/gageminamoto", label: "Twitter" },
    { platform: "github", url: "https://github.com/gageminamoto", label: "GitHub" },
    { platform: "linkedin", url: "https://linkedin.com/in/gageminamoto", label: "LinkedIn" }, // Fixed closing quotation mark
  ],
  writing: [
    { title: "Blog 1", slug: "blog-1" },
    { title: "Blog 2", slug: "blog-2" },
    { title: "Blog 3", slug: "blog-3" },
  ],
  hobbies: [
    { name: "Pokemon cards", url: "https://www.pokemon.com/us/pokemon-tcg", description: "We're only collecting cute ones" },
    { name: "Design books", description: "Addicted to adding them" },
    { name: "Camping", description: "Eating outdoors is peak" },
  ],
  projects: [
    { name: "Mizen", url: "https://www.mizen.recipes/", description: "Calmest way to cook online\u00a0recipes", status: "production" },
    { name: "Yahtzee Scorecard", url: "https://yahtzee-score-card.vercel.app/", description: "Play Yahtzee on the go with a beautiful intuitive\u00a0experience", status: "production" },
  ],
  learning: [
    { name: "Animations.dev", url: "https://animations.dev/learn", description: "Course on how to create great animations." },
    { name: "日本語", description: "Speaking the Mothertongue" },
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
