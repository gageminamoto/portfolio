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

export interface SpeakingItem {
  name: string
  description: string
  url?: string
}

export interface ManifestoItem {
  principle: string
  description: string
}

export interface Collaborator {
  name: string
  avatarUrl: string
  role: string
  url?: string
}

export interface ProjectItem {
  name: string
  url?: string
  githubUrl?: string
  description: string
  status: "production" | "building" | "new"
  image?: string
  video?: string
  hoverImage?: string
  favicon?: string
  collaborators?: Collaborator[]
}

export interface SocialLink {
  platform: string
  url: string
  label: string
}

export interface TimelineItem {
  company: string
  role: string
  period: string
  description: string
  url?: string
  icon?: string
  hoverImage?: string
  hoverComponent?: string
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
  speaking: SpeakingItem[]
  timeline: TimelineItem[]
}

const faviconUrl = (url: string) =>
  `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url)}&sz=64`

export const portfolioData: PortfolioData = {
  name: "Gage Minamoto",
  bio: "{Interaction designer|Software designer|Experience designer} building at Negi and growing Hawai’i’s [local design community](https://piiku.co/).\n\nCooking up [Mizen](https://www.mizen.recipes/), a recipe manager for home cooks.\n\nA little more lives in [about](/about), [writing](/writing), and [tools](/tools).",
  extendedBio: `{Interaction designer|Software designer|Experience designer} based in Hawai’i, focused on building everyday products.

I first stepped into design through esports and brand marketing at the [University of Hawaiʻi Esports](https://www.hawaii.edu/), then continued at [Servco](https://www.servco.com/).

I then started [Negi](https://negi.studio/), a design studio I co-founded with [Michelle](https://www.michellesunnyside.com/), where we design thoughtful software for passionate communities. Craft is still rare, but deeply needed. Follow our journey [here](https://www.linkedin.com/company/negi-studio/).`,
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
  writing: [],
  hobbies: [
    { name: "Pokemon cards", url: "https://www.pokemon.com/us/pokemon-tcg", description: "We're only collecting cute ones" },
    { name: "TTRPGs", description: "Rolling dice and telling stories" },
    { name: "Developing PICO-8 games", url: "https://www.lexaloffle.com/pico-8.php", description: "Making small games with big constraints" },
    { name: "Analog photography", description: "Slow photos on film" },
    { name: "Design books", description: "Mostly aspirational, occasionally read" },
    { name: "Camping", description: "Eating outdoors is peak" },
  ],
  projects: [
    {
      name: "Gulp Shooters",
      description: "A Pico-8 roguelike twin-stick shooter built around alien interactions and run upgrades.",
      status: "building",
      image: "/projects/gulp-shooters.png",
      video: "/projects/gulp-shooters-preview.mp4",
    },
    {
      name: "Yahtzee Scorecard",
      url: "https://yahtzee-score-card.vercel.app/",
      githubUrl: "https://github.com/gageminamoto/yahtzee-score-card",
      description: "Scorecard on the go",
      status: "production",
      image: "/projects/yahtzee.png",
      video: "/projects/yahtzee-preview.mp4",
      hoverImage: "/projects/yahtzee-hover.svg",
      favicon: "/projects/yahtzee-favicon.png",
      collaborators: [
        { name: "Gage Minamoto", avatarUrl: "/avatars/gage.png", role: "Designer", url: "https://linkedin.com/in/gageminamoto" },
      ],
    },
    {
      name: "Gunnar's Trash Trade",
      url: "https://magethegage.itch.io/gunnars-trash-trade",
      description: "A Pico-8 game made in a day",
      status: "new",
      image: "/projects/gunnars-trash-trade.jpg",
      video: "/projects/gunnars-trash-trade-preview.mp4",
    },
    {
      name: "UH Esports Branding",
      url: "https://www.figma.com/deck/5LuGBEAhIF5lbzO5RgrFvc/2025-UHE-Brand-Guides",
      description: "Visual identity and match graphics for collegiate esports",
      status: "production",
      image: "/uh-preview.jpg",
    },
  ],
  learning: [
    { name: "Animations.dev", url: "https://animations.dev/", description: "Course on how to create great animations." },
    { name: "日本語", description: "Learning nihongo" },
  ],
  speaking: [
    {
      name: "UXHICon 2026 Speaker – Case Study Showcase",
      description: "Oct 2026",
      url: "https://uxhiconference.com",
    },
    {
      name: "Piʻikū Co. Alumni Panel – Tech but Build it Local",
      description: "Sep 2026",
      url: "https://luma.com/dkxxm2tz?tk=gAV0PB",
    },
    {
      name: "Cutting Through the AI Noise as a Designer",
      description: "Apr 2026",
      url: "https://www.linkedin.com/posts/piiku-co_hot-take-ai-tools-activity-7449913912835338240-4tUX",
    },
    { name: "Becoming Impossible to Ignore", description: "Oct 2025" },
    { name: "UX 101 for University of Hawaiʻi at Mānoa Students", description: "Sep 2025" },
    { name: "Esports & Gaming Industry Resume Workshop", description: "Apr, Oct 2023" },
    {
      name: "Reel Fluent (HNL Tech Week Speaker)",
      description: "Sep 2024",
      url: "https://lu.ma/aljkkoaw",
    },
    { name: "Designing a Path to Success in Esports", description: "2023 – 2024" },
  ],
  timeline: [
    {
      company: "Mizen",
      role: "Calm recipes",
      period: "2025 – Present",
      url: "https://www.mizen.recipes/",
      icon: faviconUrl("https://www.mizen.recipes/"),
      hoverImage: "/images/mizen-hover.gif",
      description: "A recipe app I’m building to make cooking from a phone easier, with recipe clipping and grocery lists.",
    },
    {
      company: "Piʻiku",
      role: "Local design community",
      period: "2024 – Present",
      url: "https://piiku.co/",
      icon: faviconUrl("https://piiku.co/"),
      hoverImage: "/piiku-preview.jpg",
      description: "Volunteering to bring Hawaiʻi’s designers together and support the next generation of local creatives.",
    },
    {
      company: "Negi",
      role: "Tiny design studio",
      period: "2026 – Present",
      url: "https://negi.studio/",
      icon: faviconUrl("https://negi.studio/"),
      hoverImage: "/negi-studio-preview.png",
      description: "The small studio Michelle and I started to build thoughtful software, brands, and experiments in Hawaiʻi.",
    },
    {
      company: "Yahtzee Scorecard",
      role: "Weekend Project",
      period: "Feb 2026",
      url: "https://yahtzee-score-card.vercel.app/",
      icon: "/projects/yahtzee-favicon.png",
      description: "A digital Yahtzee scorecard I built with simple dice input and customizable scoring.",
    },
    {
      company: "Side Tracked",
      role: "A Makers Showcase",
      period: "Oct 2026",
      url: "https://www.negi.studio/side-tracked",
      description: "An event showcasing makers and their creative projects.",
    },
    {
      company: "Freelance",
      role: "Product & Brand Designer",
      period: "2024 – 2026",
      url: "https://gageminamoto.com/",
      icon: "/icons/freelance.png",
      description: "Designing websites, brands, and products for Hawaiʻi businesses and growing teams.",
    },
    {
      company: "NVIDIA",
      role: "Generative AI Analyst",
      period: "2024 – 2025",
      url: "https://www.nvidia.com/",
      icon: "/icons/nvidia.ico",
      hoverComponent: "nvidia",
      description: "Tested generative AI systems, reviewed outputs, and identified edge cases and failure patterns.",
    },
    {
      company: "University of Hawai'i Esports",
      role: "Creative Director",
      period: "2023 – 2025",
      url: "https://www.figma.com/deck/5LuGBEAhIF5lbzO5RgrFvc/2025-UHE-Brand-Guides",
      hoverImage: "/uh-preview.jpg",
      description: "Led UH Esports’ visual identity through brand systems, match graphics, event assets, and creative direction.",
    },
    {
      company: "Umi Language Learning App",
      role: "UX Designer",
      period: "2024",
      url: "https://umiapp.co/",
      icon: "/icons/umi.png",
      hoverImage: "/images/umi-hover.jpg",
      description: "Designed and tested language learning flows to make lessons clearer and more motivating.",
    },
    {
      company: "Gen.G Esports",
      role: "Intern",
      period: "2024",
      url: "https://geng.gg/",
      icon: "/icons/geng.png",
      hoverImage: "/images/geng-hover.gif",
      description: "Created graphics for Western channels and social media after working with the team in Seoul.",
    },
    {
      company: "Servco",
      role: "Design Intern",
      period: "2023 – 2024",
      icon: "/icons/servco.png",
      hoverImage: "/images/servco-hover.gif",
      description: "Designed campaigns and landing pages across automotive and lifestyle brands during my first in-house design internship.",
      url: "https://www.servco.com/",
    },
  ],
}

// Helper for future Notion API integration
// This function would be called from a Server Component or API rou te
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
