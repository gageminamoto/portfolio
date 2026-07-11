import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import { HoverLink } from "@/components/hover-link"

interface NotionRichTextProps {
  items: RichTextItemResponse[]
}

const textColorClasses: Partial<Record<RichTextItemResponse["annotations"]["color"], string>> = {
  gray: "text-muted-foreground",
  brown: "text-amber-800 dark:text-amber-300",
  orange: "text-orange-700 dark:text-orange-300",
  yellow: "text-yellow-700 dark:text-yellow-300",
  green: "text-emerald-700 dark:text-emerald-300",
  blue: "text-sky-700 dark:text-sky-300",
  purple: "text-violet-700 dark:text-violet-300",
  pink: "text-pink-700 dark:text-pink-300",
  red: "text-red-700 dark:text-red-300",
}

const highlightColorClasses: Partial<Record<RichTextItemResponse["annotations"]["color"], string>> = {
  gray_background: "bg-muted text-foreground",
  brown_background: "bg-amber-200/70 text-amber-950 dark:bg-amber-300/20 dark:text-amber-100",
  orange_background: "bg-orange-200/70 text-orange-950 dark:bg-orange-300/20 dark:text-orange-100",
  yellow_background: "bg-yellow-200/80 text-yellow-950 dark:bg-yellow-300/25 dark:text-yellow-100",
  green_background: "bg-emerald-200/70 text-emerald-950 dark:bg-emerald-300/20 dark:text-emerald-100",
  blue_background: "bg-sky-200/70 text-sky-950 dark:bg-sky-300/20 dark:text-sky-100",
  purple_background: "bg-violet-200/70 text-violet-950 dark:bg-violet-300/20 dark:text-violet-100",
  pink_background: "bg-pink-200/70 text-pink-950 dark:bg-pink-300/20 dark:text-pink-100",
  red_background: "bg-red-200/70 text-red-950 dark:bg-red-300/20 dark:text-red-100",
}

export function NotionRichText({ items }: NotionRichTextProps) {
  return (
    <>
      {items.map((item, i) => {
        let content: React.ReactNode = item.plain_text
        const color = item.annotations.color
        const textColorClass = textColorClasses[color]
        const highlightColorClass = highlightColorClasses[color]

        if (textColorClass) {
          content = <span className={textColorClass}>{content}</span>
        }
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
        if (highlightColorClass) {
          content = (
            <mark className={`rounded-[0.2em] px-1 py-0.5 decoration-inherit ${highlightColorClass}`}>
              {content}
            </mark>
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
