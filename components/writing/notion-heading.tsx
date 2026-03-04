import type { NotionBlock } from "@/lib/notion"
import { NotionRichText } from "./notion-rich-text"

function getHeadingId(richText: { plain_text: string }[]): string {
  return richText
    .map((t) => t.plain_text)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

interface NotionHeadingProps {
  block: NotionBlock
}

export function NotionHeading({ block }: NotionHeadingProps) {
  const type = block.type as "heading_1" | "heading_2" | "heading_3"
  const heading = block[type]
  const id = getHeadingId(heading.rich_text)

  if (type === "heading_1") {
    return (
      <h2
        id={id}
        className="mt-10 mb-4 text-xl font-semibold text-foreground [text-wrap:pretty] scroll-mt-8"
      >
        <NotionRichText items={heading.rich_text} />
      </h2>
    )
  }

  if (type === "heading_2") {
    return (
      <h3
        id={id}
        className="mt-8 mb-3 text-lg font-medium text-foreground [text-wrap:pretty] scroll-mt-8"
      >
        <NotionRichText items={heading.rich_text} />
      </h3>
    )
  }

  return (
    <h4
      id={id}
      className="mt-6 mb-2 text-base font-medium text-foreground [text-wrap:pretty] scroll-mt-8"
    >
      <NotionRichText items={heading.rich_text} />
    </h4>
  )
}
