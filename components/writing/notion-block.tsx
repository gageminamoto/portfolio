import type { NotionBlock } from "@/lib/notion"
import { NotionHeading } from "./notion-heading"
import { NotionParagraph } from "./notion-paragraph"
import { NotionQuote } from "./notion-quote"
import { NotionCode } from "./notion-code"
import { NotionCallout } from "./notion-callout"
import { NotionImage } from "./notion-image"
import { NotionToggle } from "./notion-toggle"
import { NotionRichText } from "./notion-rich-text"

interface NotionBlockComponentProps {
  block: NotionBlock
}

export function NotionBlockComponent({ block }: NotionBlockComponentProps) {
  switch (block.type) {
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return <NotionHeading block={block} />

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

    case "bulleted_list_item":
      return (
        <li className="text-base leading-7 text-foreground/90">
          <NotionRichText items={block.bulleted_list_item.rich_text} />
        </li>
      )

    case "numbered_list_item":
      return (
        <li className="text-base leading-7 text-foreground/90">
          <NotionRichText items={block.numbered_list_item.rich_text} />
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
