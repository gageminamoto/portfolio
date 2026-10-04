export type EarlyDesignResource = {
  title: string
  url?: string
  /** Draft placeholder — Gage can edit or remove. */
  draftWhy?: string
}

export const earlyDesignResources: EarlyDesignResource[] = [
  {
    title: "Interface Craft",
    draftWhy: "Draft: foundations for thoughtful UI work.",
  },
  {
    title: "Design of Everyday Things",
    draftWhy: "Draft: how people actually encounter design.",
  },
  {
    title: "Linear Method – Practices for building",
    url: "https://linear.app/method",
    draftWhy: "Draft: habits for shipping with clarity.",
  },
  {
    title: "Family Values",
    url: "https://benji.org/family-values",
    draftWhy: "Draft: principles that outlast a sprint.",
  },
  {
    title: "Developing taste",
    url: "https://emilkowal.ski/ui/developing-taste",
    draftWhy: "Draft: refining judgment over time.",
  },
  {
    title: "Output isn't design",
    url: "https://linear.app/now/output-isn-t-design",
    draftWhy: "Draft: why artifacts aren't the whole story.",
  },
  {
    title: "Novelty",
    url: "https://rauno.me/craft/novelty",
    draftWhy: "Draft: when fresh detail earns its place.",
  },
  {
    title: "Animating in public",
    url: "https://emilkowal.ski/ui/animating-in-public",
    draftWhy: "Draft: learning motion in the open.",
  },
  {
    title: "How to Do Great Work",
    url: "https://paulgraham.com/greatwork.html",
    draftWhy: "Draft: curiosity and depth over shortcuts.",
  },
  {
    title: "Emil Kowalski post",
    url: "https://x.com/emilkowalski/status/1765004718131068971",
    draftWhy: "Draft: a sharp note on craft (edit link label if needed).",
  },
]

export type EarlyDesignView = "a" | "b"

export function parseEarlyDesignView(value: string | null): EarlyDesignView {
  return value === "b" ? "b" : "a"
}
