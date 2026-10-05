export type EarlyDesignResource = {
  title: string
  url?: string
  /** Optional quiet context line (plain text, no labels). */
  why?: string
}

export const earlyDesignResources: EarlyDesignResource[] = [
  { title: "Interface Craft", url: "https://interfacecraft.dev/" },
  {
    title: "Design of Everyday Things",
    url: "https://dn790006.ca.archive.org/0/items/pdfy-9Bb1XUCNFvb5HrMP/Design%20of%20Everyday%20Things_text.pdf",
  },
  {
    title: "Linear Method – Practices for building",
    url: "https://linear.app/method",
  },
  { title: "Family Values", url: "https://benji.org/family-values" },
  {
    title: "Developing taste",
    url: "https://emilkowal.ski/ui/developing-taste",
  },
  {
    title: "Output isn't design",
    url: "https://linear.app/now/output-isn-t-design",
  },
  { title: "Novelty", url: "https://rauno.me/craft/novelty" },
  {
    title: "Animating in public",
    url: "https://emilkowal.ski/ui/animating-in-public",
  },
  {
    title: "How to Do Great Work",
    url: "https://paulgraham.com/greatwork.html",
  },
  {
    title: "Emil Kowalski post",
    url: "https://x.com/emilkowalski/status/1765004718131068971",
  },
  {
    title: "Jay Yang — Stripe CEO advice to ambitious people",
    url: "https://x.com/Jayyanginspires/status/2106791870563021103?s=20",
    why: "Short clip on Patrick Collison’s advice for people early in their careers.",
  },
]

export function getResourceHost(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "")
}
