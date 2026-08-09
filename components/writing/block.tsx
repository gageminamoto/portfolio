import type { NotionBlock } from "@/lib/notion"
import { Heading, type HeadingBlock } from "./heading"
import { Paragraph } from "./paragraph"
import { Quote } from "./quote"
import { Code } from "./code"
import { Callout } from "./callout"
import { ImageBlock } from "./image"
import { Toggle } from "./toggle"
import { RichText } from "./rich-text"
import { Table } from "./table"

interface ArticleBlockProps {
  block: NotionBlock
}

export function Block({ block }: ArticleBlockProps) {
  switch (block.type) {
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return <Heading block={block as HeadingBlock} />

    case "paragraph":
      return <Paragraph block={block} />

    case "quote":
      return <Quote block={block} />

    case "code":
      return <Code block={block} />

    case "callout":
      return <Callout block={block} />

    case "image":
      return <ImageBlock block={block} />

    case "toggle":
      return <Toggle block={block} />

    case "table":
      return <Table block={block} />

    case "table_row":
      return null

    case "bulleted_list_item":
      return (
        <li className="text-base leading-7 text-foreground/90">
          <RichText items={block.bulleted_list_item.rich_text} />
        </li>
      )

    case "numbered_list_item":
      return (
        <li className="text-base leading-7 text-foreground/90">
          <RichText items={block.numbered_list_item.rich_text} />
        </li>
      )

    case "divider":
      return (
        <div className="my-8 flex justify-center gap-1.5" role="separator">
          <span className="block h-1 w-1 rounded-full bg-muted-foreground/30" />
          <span className="block h-1 w-1 rounded-full bg-muted-foreground/30" />
          <span className="block h-1 w-1 rounded-full bg-muted-foreground/30" />
        </div>
      )

    default:
      return null
  }
}
