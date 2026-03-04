import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { HoverLink } from "@/components/hover-link"

interface NotionRichTextProps {
  items: RichTextItemResponse[]
}

export function NotionRichText({ items }: NotionRichTextProps) {
  return (
    <>
      {items.map((item, i) => {
        let content: React.ReactNode = item.plain_text

        if (item.annotations.bold) {
          content = <strong className="font-medium">{content}</strong>
        }
        if (item.annotations.italic) {
          content = <em>{content}</em>
        }
        if (item.annotations.strikethrough) {
          content = <s>{content}</s>
        }
        if (item.annotations.underline) {
          content = <u>{content}</u>
        }
        if (item.annotations.code) {
          content = (
            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.875em]">
              {content}
            </code>
          )
        }

        if (item.href) {
          return (
            <HoverLink key={i} href={item.href}>
              {content}
            </HoverLink>
          )
        }

        return <span key={i}>{content}</span>
      })}
    </>
  )
}
