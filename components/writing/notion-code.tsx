import type { NotionBlock } from "@/lib/notion"

type CodeBlock = Extract<NotionBlock, { type: "code" }>

interface NotionCodeProps {
  block: CodeBlock
}

export function NotionCode({ block }: NotionCodeProps) {
  const code = block.code
  const language = code.language !== "plain text" ? code.language : null
  const text = code.rich_text.map((t: { plain_text: string }) => t.plain_text).join("")

  return (
    <pre data-language={language ?? undefined}>
      <code>{text}</code>
    </pre>
  )
}
