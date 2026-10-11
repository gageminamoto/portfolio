export type EarlyDesignResource = {
  title: string
  url?: string
  note?: string
}

export const earlyDesignResources: EarlyDesignResource[] = [
  {
    title: "Interface Craft",
    url: "https://interfacecraft.dev/",
    note: "Placeholder: why Interface Craft belongs on this list.",
  },
  {
    title: "Design of Everyday Things",
    url: "https://dn790006.ca.archive.org/0/items/pdfy-9Bb1XUCNFvb5HrMP/Design%20of%20Everyday%20Things_text.pdf",
    note: "Placeholder: a one-line take on Norman’s book.",
  },
  {
    title: "Linear Method – Practices for building",
    url: "https://linear.app/method",
    note: "Placeholder: what to borrow from Linear’s method write-up.",
  },
  {
    title: "Family Values",
    url: "https://benji.org/family-values",
    note: "Placeholder: note on Benji’s family-values piece.",
  },
  {
    title: "Developing taste",
    url: "https://emilkowal.ski/ui/developing-taste",
    note: "Placeholder: why developing taste matters here.",
  },
  {
    title: "Output isn't design",
    url: "https://linear.app/now/output-isn-t-design",
    note: "Placeholder: quick reaction to the output vs design idea.",
  },
  {
    title: "Novelty",
    url: "https://rauno.me/craft/novelty",
    note: "Placeholder: what Rauno’s novelty essay adds.",
  },
  {
    title: "Animating in public",
    url: "https://emilkowal.ski/ui/animating-in-public",
    note: "Placeholder: note on animating work in public.",
  },
  {
    title: "How to Do Great Work",
    url: "https://paulgraham.com/greatwork.html",
    note: "Placeholder: why PG’s essay is on the list.",
  },
  {
    title: "Emil Kowalski post",
    url: "https://x.com/emilkowalski/status/1765004718131068971",
    note: "Placeholder: context for this Emil post.",
  },
  {
    title: "Train Your Judgement",
    url: "https://emilkowal.ski/ui/train-your-judgement",
    note: "Placeholder: why train-your-judgement is worth reading.",
  },
]

export function getResourceHost(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "")
}
