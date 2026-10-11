export type EarlyDesignResource = {
  title: string
  url?: string
  note?: string
}

/** Temporary copy until Gage writes real notes for each row. */
const PLACEHOLDER_NOTE =
  "Placeholder — Gage will replace this with a short personal note."

export const earlyDesignResources: EarlyDesignResource[] = [
  {
    title: "Interface Craft",
    url: "https://interfacecraft.dev/",
    note: PLACEHOLDER_NOTE,
  },
  {
    title: "Design of Everyday Things",
    url: "https://dn790006.ca.archive.org/0/items/pdfy-9Bb1XUCNFvb5HrMP/Design%20of%20Everyday%20Things_text.pdf",
    note: PLACEHOLDER_NOTE,
  },
  {
    title: "Linear Method – Practices for building",
    url: "https://linear.app/method",
    note: PLACEHOLDER_NOTE,
  },
  {
    title: "Family Values",
    url: "https://benji.org/family-values",
    note: PLACEHOLDER_NOTE,
  },
  {
    title: "Developing taste",
    url: "https://emilkowal.ski/ui/developing-taste",
    note: PLACEHOLDER_NOTE,
  },
  {
    title: "Output isn't design",
    url: "https://linear.app/now/output-isn-t-design",
    note: PLACEHOLDER_NOTE,
  },
  {
    title: "Novelty",
    url: "https://rauno.me/craft/novelty",
    note: PLACEHOLDER_NOTE,
  },
  {
    title: "Animating in public",
    url: "https://emilkowal.ski/ui/animating-in-public",
    note: PLACEHOLDER_NOTE,
  },
  {
    title: "How to Do Great Work",
    url: "https://paulgraham.com/greatwork.html",
    note: PLACEHOLDER_NOTE,
  },
  {
    title: "Ira Glass on Taste",
    url: "https://x.com/emilkowalski/status/1765004718131068971",
    note: PLACEHOLDER_NOTE,
  },
  {
    title: "Train Your Judgement",
    url: "https://emilkowal.ski/ui/train-your-judgement",
    note: PLACEHOLDER_NOTE,
  },
  {
    title: "Skills for Designers and Engineers",
    url: "https://github.com/emilkowalski/skills",
    note: PLACEHOLDER_NOTE,
  },
  {
    title: "Why is quality so rare?",
    url: "https://linear.app/now/why-is-quality-so-rare",
    note: PLACEHOLDER_NOTE,
  },
]

export function getResourceHost(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "")
}
