import type { NotionBlock } from "@/lib/notion"
import { NotionBlockComponent } from "./notion-block"
import { NotionImage, type ImageBlock } from "./notion-image"

interface NotionBlocksRendererProps {
  blocks: NotionBlock[]
}

interface BlockGroup {
  type: "bulleted_list" | "numbered_list" | "single" | "themed_image"
  blocks: NotionBlock[]
  lightBlock?: ImageBlock
  darkBlock?: ImageBlock
  caption?: string
}

const themeMarkerPattern = /^\[theme:(light|dark)\]\s*/i

function getImageCaption(block: ImageBlock): string {
  return block.image.caption.map((item) => item.plain_text).join("")
}

function getImageTheme(block: NotionBlock): "light" | "dark" | null {
  if (block.type !== "image") return null
  const match = getImageCaption(block).match(themeMarkerPattern)
  return match?.[1]?.toLowerCase() as "light" | "dark" | undefined ?? null
}

function stripThemeMarker(caption: string): string {
  return caption.replace(themeMarkerPattern, "").trim()
}

function groupBlocks(blocks: NotionBlock[]): BlockGroup[] {
  const groups: BlockGroup[] = []

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index]
    const nextBlock = blocks[index + 1]
    const theme = getImageTheme(block)
    const nextTheme = nextBlock ? getImageTheme(nextBlock) : null

    if (
      block.type === "image" &&
      nextBlock?.type === "image" &&
      theme &&
      nextTheme &&
      theme !== nextTheme
    ) {
      const lightBlock = theme === "light" ? block : nextBlock
      const darkBlock = theme === "dark" ? block : nextBlock
      groups.push({
        type: "themed_image",
        blocks: [],
        lightBlock,
        darkBlock,
        caption: stripThemeMarker(getImageCaption(lightBlock)),
      })
      index += 1
      continue
    }

    const lastGroup = groups[groups.length - 1]

    if (block.type === "bulleted_list_item") {
      if (lastGroup?.type === "bulleted_list") {
        lastGroup.blocks.push(block)
      } else {
        groups.push({ type: "bulleted_list", blocks: [block] })
      }
    } else if (block.type === "numbered_list_item") {
      if (lastGroup?.type === "numbered_list") {
        lastGroup.blocks.push(block)
      } else {
        groups.push({ type: "numbered_list", blocks: [block] })
      }
    } else {
      groups.push({ type: "single", blocks: [block] })
    }
  }

  return groups
}

export function NotionBlocksRenderer({ blocks }: NotionBlocksRendererProps) {
  const groups = groupBlocks(blocks)

  return (
    <>
      {groups.map((group, i) => {
        if (group.type === "bulleted_list") {
          return (
            <ul
              key={i}
              className="my-5 flex flex-col gap-1.5 pl-6 list-disc marker:text-muted-foreground/50"
            >
              {group.blocks.map((block) => (
                <NotionBlockComponent key={block.id} block={block} />
              ))}
            </ul>
          )
        }

        if (group.type === "numbered_list") {
          return (
            <ol
              key={i}
              className="my-5 flex flex-col gap-1.5 pl-6 list-decimal marker:text-muted-foreground/50"
            >
              {group.blocks.map((block) => (
                <NotionBlockComponent key={block.id} block={block} />
              ))}
            </ol>
          )
        }

        if (group.type === "themed_image" && group.lightBlock && group.darkBlock) {
          return (
            <NotionImage
              key={group.lightBlock.id}
              block={group.lightBlock}
              darkBlock={group.darkBlock}
              captionOverride={group.caption}
            />
          )
        }

        const block = group.blocks[0]
        return <NotionBlockComponent key={block.id} block={block} />
      })}
    </>
  )
}
