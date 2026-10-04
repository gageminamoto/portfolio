export type EarlyDesignResource = {
  title: string
  url?: string
}

export const earlyDesignResources: EarlyDesignResource[] = [
  { title: "Interface Craft" },
  { title: "Design of Everyday Things" },
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
]

export function getResourceHost(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "")
}

export function groupResourcesByLink(
  resources: EarlyDesignResource[],
): EarlyDesignResource[][] {
  const groups: EarlyDesignResource[][] = []
  for (const resource of resources) {
    const last = groups[groups.length - 1]
    if (last && Boolean(last[0].url) === Boolean(resource.url)) {
      last.push(resource)
    } else {
      groups.push([resource])
    }
  }
  return groups
}

export type EarlyDesignView = "a" | "b"

export function parseEarlyDesignView(value: string | null): EarlyDesignView {
  return value === "b" ? "b" : "a"
}
