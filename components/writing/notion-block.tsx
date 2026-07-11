import type { NotionBlock } from "@/lib/notion"
import { NotionHeading, type HeadingBlock } from "./notion-heading"
import { NotionParagraph } from "./notion-paragraph"
import { NotionQuote } from "./notion-quote"
import { NotionCode } from "./notion-code"
import { NotionCallout } from "./notion-callout"
import { NotionImage } from "./notion-image"
import { NotionToggle } from "./notion-toggle"
import { NotionRichText } from "./notion-rich-text"
import { NotionTable } from "./notion-table"

interface NotionBlockComponentProps {
  block: NotionBlock
}

export function NotionBlockComponent({ block }: NotionBlockComponentProps) {
  switch (block.type) {
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return <NotionHeading block={block as HeadingBlock} />

    case "paragraph":
      return <NotionParagraph block={block} />

    case "quote":
      return <NotionQuote block={block} />

    case "code":
      return <NotionCode block={block} />

    case "callout":
      return <NotionCallout block={block} />

    case "image":
      return <NotionImage block={block} />

    case "toggle":
      return <NotionToggle block={block} />

    case "table":
      return <NotionTable block={block} />

    case "table_row":
      return null

    case "bulleted_list_item":
      return (
        <li>
          <NotionRichText items={block.bulleted_list_item.rich_text} />
        </li>
      )

    case "numbered_list_item":
      return (
        <li>
          <NotionRichText items={block.numbered_list_item.rich_text} />
        </li>
      )

    case "divider":
      return <hr />

    default:
      return null
  }
}
