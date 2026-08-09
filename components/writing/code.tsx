import type { NotionBlock } from "@/lib/notion"

type CodeBlock = Extract<NotionBlock, { type: "code" }>

interface ArticleCodeProps {
  block: CodeBlock
}

export function Code({ block }: ArticleCodeProps) {
  const code = block.code
  const language = code.language !== "plain text" ? code.language : null
  const text = code.rich_text.map((t: { plain_text: string }) => t.plain_text).join("")

  return (
    <div className="my-6 overflow-x-auto rounded-lg bg-muted/60 p-4">
      {language && (
        <span className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
          {language}
        </span>
      )}
      <pre>
        <code className="font-mono text-sm leading-6 text-foreground/90">
          {text}
        </code>
      </pre>
    </div>
  )
}
