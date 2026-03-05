import type { NotionBlock } from "@/lib/notion"
import { NotionRichText } from "./notion-rich-text"

type HeadingType = "heading_1" | "heading_2" | "heading_3"
export type HeadingBlock = Extract<NotionBlock, { type: HeadingType }>

function getHeadingText(richText: { plain_text: string }[]): string {
  return richText.map((t) => t.plain_text).join("")
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

interface NotionHeadingProps {
  block: HeadingBlock
}

function getHeadingRichText(block: HeadingBlock) {
  switch (block.type) {
    case "heading_1":
      return block.heading_1.rich_text
    case "heading_2":
      return block.heading_2.rich_text
    case "heading_3":
      return block.heading_3.rich_text
  }
}

export function getHeadingId(block: HeadingBlock): string {
  const text = getHeadingText(getHeadingRichText(block))
  const slug = slugifyHeading(text) || "heading"
  const blockId = block.id.replace(/-/g, "")
  return `${slug}-${blockId}`
}

export function NotionHeading({ block }: NotionHeadingProps) {
  const type = block.type
  const heading = getHeadingRichText(block)
  const id = getHeadingId(block)

  if (type === "heading_1") {
    return (
      <h2
        id={id}
        className="mt-10 mb-4 text-xl font-semibold text-foreground [text-wrap:pretty] scroll-mt-8"
      >
        <NotionRichText items={heading} />
      </h2>
    )
  }

  if (type === "heading_2") {
    return (
      <h3
        id={id}
        className="mt-8 mb-3 text-lg font-medium text-foreground [text-wrap:pretty] scroll-mt-8"
      >
        <NotionRichText items={heading} />
      </h3>
    )
  }

  return (
    <h4
      id={id}
      className="mt-6 mb-2 text-base font-medium text-foreground [text-wrap:pretty] scroll-mt-8"
    >
      <NotionRichText items={heading} />
    </h4>
  )
}
