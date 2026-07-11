import type { NotionBlock } from "@/lib/notion"
import { NotionBlockComponent } from "./notion-block"

interface NotionBlocksRendererProps {
  blocks: NotionBlock[]
}

interface BlockGroup {
  type: "bulleted_list" | "numbered_list" | "single"
  blocks: NotionBlock[]
}

function groupBlocks(blocks: NotionBlock[]): BlockGroup[] {
  const groups: BlockGroup[] = []

  for (const block of blocks) {
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

        const block = group.blocks[0]
        return <NotionBlockComponent key={block.id} block={block} />
      })}
    </>
  )
}
