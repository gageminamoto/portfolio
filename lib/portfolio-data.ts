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
  hoverImage?: string
  favicon?: string
  collaborators?: Collaborator[]
}

export interface SocialLink {
  platform: string
  url: string
  label: string
}

export interface WorkHistoryItem {
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
  workHistory: WorkHistoryItem[]
}

const faviconUrl = (url: string) =>
  `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url)}&sz=64`

export const portfolioData: PortfolioData = {
  name: "Gage Minamoto",
  bio: "Designer thriving in ambiguity, blurred lines, and curiosity to shape great everyday products. Currently, crafting simple {software|brands|tools} at Negi.\n\nGrowing Hawai’i’s [local design community](https://piiku.co/) and building [Mizen](https://www.mizen.recipes/), a calm and simple way to cook online recipes.",
  extendedBio: `I’m a design engineer based in Hawai’i, focused on building everyday products that feel calm and intuitive. I care deeply about craft and believe great software should feel invisible; getting out of your way so you can focus on what matters. Currently building [Mizen](https://www.mizen.recipes/) and growing the [local design community](https://piiku.co/) in Hawai’i.

I grew up in Hawai’i, surrounded by diverse cultures. That background taught me to value empathy, community, and restraint, qualities that still shape how I approach design.

I first stepped into design through esports and brand marketing at the [University of Hawaiʻi Esports](https://www.hawaii.edu/), then continued at [Servco](https://www.servco.com/). Those early roles taught me how to move fast, collaborate across teams, and communicate with clarity.

Indie games have always inspired me. Small teams pour their craft into every detail with whatever they have. That same energy drives Negi, the design studio I co-founded with [Michelle](https://www.michellesunnyside.com/), where we design thoughtful software and brands in and for Hawai’i. Craft is still rare here, but deeply needed. Follow the journey [here](https://www.linkedin.com/company/negi-studio/).`,
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
    { name: "NewJeans", url: "https://www.youtube.com/watch?v=iXlH5AhHLZY&t=407s", description: "#njz" },
    { name: "Design books", description: "Mostly aspirational, occasionally read" },
    { name: "Camping", description: "Eating outdoors is peak" },
    { name: "Notion", url: "https://www.linkedin.com/in/gageminamoto/details/certifications/", description: "Notion certified" },
  ],
  projects: [
    {
      name: "Mizen",
      url: "https://www.mizen.recipes/",
      githubUrl: "https://github.com/parse-n-plate/mizen",
      description: "Calm online cooking",
      status: "building",
      image: "/projects/mizen.png",
      hoverImage: "/projects/mizen-hover.svg",
      favicon: faviconUrl("https://www.mizen.recipes/"),
      collaborators: [
        { name: "Gage Minamoto", avatarUrl: "/avatars/gage.png", role: "Design Eng", url: "https://linkedin.com/in/gageminamoto" },
        { name: "Michelle Tran", avatarUrl: "/avatars/michelle.png", role: "PM", url: "https://www.linkedin.com/in/michelle-tran-a48a14203/" },
        { name: "Michele Tang", avatarUrl: "/avatars/michele-tang.jpg", role: "Contributor", url: "https://www.linkedin.com/in/michele-tang/" },
        { name: "Zelda Cole", avatarUrl: "/avatars/zelda.jpg", role: "Contributor", url: "https://www.linkedin.com/in/zeldacole" },
        { name: "William Liang", avatarUrl: "/avatars/william.jpg", role: "Contributor", url: "https://www.linkedin.com/in/william-liang808/" },
        { name: "Rahul Jain", avatarUrl: "/avatars/rahul.jpg", role: "Contributor", url: "https://www.linkedin.com/in/rahulj24/" },
      ],
    },
    {
      name: "Yahtzee Scorecard",
      url: "https://yahtzee-score-card.vercel.app/",
      githubUrl: "https://github.com/gageminamoto/yahtzee-score-card",
      description: "Scorecard on the go",
      status: "production",
      image: "/projects/yahtzee.png",
      hoverImage: "/projects/yahtzee-hover.svg",
      favicon: "/projects/yahtzee-favicon.png",
      collaborators: [
        { name: "Gage Minamoto", avatarUrl: "/avatars/gage.png", role: "Designer", url: "https://linkedin.com/in/gageminamoto" },
      ],
    },
    {
      name: "Guandan Rules",
      url: "https://guan-duan-rules.vercel.app/",
      githubUrl: "https://github.com/gageminamoto/Guan-Duan-Rules",
      description: "Quick guide to Guan Dan",
      status: "new",
      collaborators: [
        { name: "Gage Minamoto", avatarUrl: "/avatars/gage.png", role: "Designer", url: "https://linkedin.com/in/gageminamoto" },
      ],
    },
    {
      name: "More soon",
      description: "Something new in the works",
      status: "production",
      collaborators: [
        { name: "Gage Minamoto", avatarUrl: "/avatars/gage.png", role: "Designer", url: "https://linkedin.com/in/gageminamoto" },
      ],
    },
  ],
  learning: [
    { name: "Animations.dev", url: "https://animations.dev/", description: "Course on how to create great animations." },
    { name: "日本語", description: "Learning nihongo" },
  ],
  speaking: [
    {
      name: "Cutting Through the AI Noise as a Designer",
      description: "Apr 2026",
      url: "https://www.linkedin.com/posts/piiku-co_hot-take-ai-tools-activity-7449913912835338240-4tUX",
    },
    { name: "Becoming Impossible to Ignore", description: "Oct 2025" },
    { name: "UX 101 for University of Hawaiʻi at Mānoa Students", description: "Sep 2025" },
    { name: "Esports & Gaming Industry Resume Workshop", description: "Apr, Oct 2023" },
    { name: "Reel Fluent (HNL Tech Week Speaker)", description: "Sep 2024" },
    { name: "Designing a Path to Success in Esports", description: "2023 – 2024" },
  ],
  workHistory: [
    {
      company: "Mizen",
      role: "Calm recipes",
      period: "Building",
      url: "https://www.mizen.recipes/",
      icon: faviconUrl("https://www.mizen.recipes/"),
      hoverImage: "/images/mizen-hover.gif",
      description: "A side project for making online recipes calmer to cook from. I keep poking at parsing, grocery lists, recipe clipping, and the tiny product decisions that make cooking from a phone feel less annoying.",
    },
    {
      company: "Piʻiku",
      role: "Local design community",
      period: "Ongoing",
      url: "https://piiku.co/",
      icon: faviconUrl("https://piiku.co/"),
      hoverImage: "/piiku-preview.jpg",
      description: "A small community project for designers in Hawai'i. It is part events, part gathering place, and part excuse to meet more people who care about making things here.",
    },
    {
      company: "Negi",
      role: "Tiny design studio",
      period: "2025 – Present",
      url: "https://negi.studio/",
      icon: faviconUrl("https://negi.studio/"),
      hoverImage: "/negi-studio-preview.jpg",
      description: "The studio Michelle and I started to make thoughtful software, brands, and odd little ideas in Hawai'i. It is where client work, experiments, taste-building, and learning how to run a practice all overlap.",
    },
    {
      company: "Yahtzee Scorecard",
      role: "Weekend game tool",
      period: "Shipped",
      url: "https://yahtzee-score-card.vercel.app/",
      icon: "/projects/yahtzee-favicon.png",
      description: "A tiny scorecard I built because paper score sheets disappear too easily. It is simple, a little playful, and mostly exists because small tools are fun when they solve one specific irritation.",
    },
    {
      company: "Guandan Rules",
      role: "Card game notes",
      period: "Shipped",
      url: "https://guan-duan-rules.vercel.app/",
      icon: "/projects/guandian-rules-logo.svg",
      description: "A quick rules guide for a card game I wanted to explain without making people read a wall of text. Mostly an excuse to turn a confusing set of rules into something friendlier.",
    },
    {
      company: "Freelance",
      role: "Product & Brand Designer",
      period: "2026 – Present",
      url: "https://gageminamoto.com/",
      icon: "/icons/freelance.png",
      description: "Helping Hawai'i businesses, local builders, and growing teams make websites, brands, and product ideas feel more considered. It is client work, but also a lot of figuring things out in the open.",
    },
    {
      company: "Becoming Impossible to Ignore",
      role: "UXHI Speaker",
      period: "2025",
      url: "https://uxhiconference.com/",
      icon: "/icons/uxhi.png",
      hoverImage: "/images/uxhi-hover.jpg",
      description: "A talk Michelle and I gave about making more room for luck. It was really about side projects, community, awkward first steps, and how putting small things into the world can change what finds you.",
    },
    {
      company: "NVIDIA",
      role: "Generative AI Analyst",
      period: "2024 – 2025",
      url: "https://www.nvidia.com/",
      icon: "/icons/nvidia.ico",
      hoverComponent: "nvidia",
      description: "Looking closely at how generative AI behaves when people ask it messy, real-world things. Lots of edge cases, pattern spotting, and learning that tiny wording changes can make systems act very differently.",
    },
    {
      company: "University of Hawai'i Esports",
      role: "Creative Director",
      period: "2023 – 2025",
      url: "https://uhesports.com/",
      hoverImage: "/uh-preview.jpg",
      description: "Where I learned design by making a lot of things quickly. Brand systems, match graphics, event assets, and the occasional weird esports request. It became my first real playground for leading other designers.",
    },
    {
      company: "Umi Language Learning App",
      role: "UX Designer",
      period: "2024",
      url: "https://umiapp.co/",
      icon: "/icons/umi.png",
      hoverImage: "/images/umi-hover.jpg",
      description: "A language learning project where I got to think about motivation, lessons, memory, and how quickly learning tools can become annoying. I tested flows with learners and kept trimming the interface back.",
    },
    {
      company: "Gen.G Esports",
      role: "Intern",
      period: "2024",
      url: "https://geng.gg/",
      icon: "/icons/geng.png",
      hoverImage: "/images/geng-hover.gif",
      description: "Making social graphics and campaign assets for esports teams across Seoul and North America. Fast-paced, highly online, and a good lesson in making work that still reads when everyone scrolls past it.",
    },
    {
      company: "Servco",
      role: "Design Intern",
      period: "2023 – 2024",
      icon: "/icons/servco.png",
      hoverImage: "/images/servco-hover.gif",
      description: "My first look at design inside a larger company. I worked across automotive and lifestyle brands, made campaign assets and landing pages, and learned how much of design is keeping many moving pieces understandable.",
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
