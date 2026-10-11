export type EarlyDesignResource = {
  title: string
  url?: string
  note?: string
}

export const earlyDesignResources: EarlyDesignResource[] = [
  {
    title: "Interface Craft",
    url: "https://interfacecraft.dev/",
    note: "Interface craft is a must for early and experienced designers. There’s a level of craft all designers should strive for, and this course showcases practical lessons in how to do so.",
  },
  {
    title: "Design of Everyday Things",
    url: "https://dn790006.ca.archive.org/0/items/pdfy-9Bb1XUCNFvb5HrMP/Design%20of%20Everyday%20Things_text.pdf",
    note: "Has been the go-to book for designers and a good overview of the field as a whole.",
  },
  {
    title: "Linear Method – Practices for building",
    url: "https://linear.app/method",
    note: "I believe Linear has innovated on simple but hard to master approach for building amazing product.",
  },
  {
    title: "Family Values",
    url: "https://benji.org/family-values",
    note: "Family is regarded as an app that went above and beyond industry in terms of simplistic delight. Learns Benji and his team's design principle in creating such a wonderful experience.",
  },
  { title: "Developing taste", url: "https://emilkowal.ski/ui/developing-taste" },
  {
    title: "Output isn't design",
    url: "https://linear.app/now/output-isn-t-design",
    note: "For me this is something I revisit on regular basis. It's a reminder where the designer value lies and that especially important as designs reach sky rocket as output becomes more and more democratized.",
  },
  { title: "Novelty", url: "https://rauno.me/craft/novelty" },
  {
    title: "Animating in public",
    url: "https://emilkowal.ski/ui/animating-in-public",
    note: "Like we share in our talk, Impossible to Ignore, many of the opportunities I've gotten today have come from being curious and sharing that passion with others.",
  },
  {
    title: "How to Do Great Work",
    url: "https://paulgraham.com/greatwork.html",
  },
  {
    title: "Ira Glass on Taste",
    url: "https://x.com/emilkowalski/status/1765004718131068971",
  },
  {
    title: "Train Your Judgement",
    url: "https://emilkowal.ski/ui/train-your-judgement",
  },
  {
    title: "Skills for Designers and Engineers",
    url: "https://github.com/emilkowalski/skills",
  },
  {
    title: "Why is quality so rare?",
    url: "https://linear.app/now/why-is-quality-so-rare",
  },
]

export function getResourceHost(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "")
}
