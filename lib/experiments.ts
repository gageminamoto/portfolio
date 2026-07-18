export type ExperimentStatus = "live" | "building" | "sketch"

export type ExperimentMedia = {
  src: string
  alt: string
  aspectRatio?: "video" | "square"
}

export type Experiment = {
  id: string
  title: string
  date: string
  summary: string
  status: ExperimentStatus
  tags: string[]
  url?: string
  media?: ExperimentMedia
  notes?: string
}

export const experiments: Experiment[] = [
  {
    id: "gunnys-game",
    title: "Gunny's Game",
    date: "2026-06-01",
    summary: "A small game prototype in progress, kept loose while the rules, feel, and interaction loop settle.",
    status: "building",
    tags: ["Game", "Prototype", "Play"],
    notes: "Placeholder entry until the build has public media or a playable link.",
  },
  {
    id: "yahtzee-scorecard",
    title: "Yahtzee Scorecard",
    date: "2025-12-01",
    summary: "A mobile-friendly scorecard for faster games, clearer scoring, and fewer paper sheets at the table.",
    status: "live",
    tags: ["Game aid", "Mobile", "Utility"],
    url: "https://yahtzee-score-card.vercel.app/",
  },
  {
    id: "guandan-rules",
    title: "Guandan Rules",
    date: "2025-11-01",
    summary: "A quick reference for learning Guan Dan rules without digging through long explainers mid-game.",
    status: "live",
    tags: ["Cards", "Reference", "Rules"],
    url: "https://guan-duan-rules.vercel.app/",
    media: {
      src: "/projects/guandian-rules-logo.svg",
      alt: "Guandan Rules logo",
      aspectRatio: "square",
    },
  },
]

