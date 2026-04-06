"use client"

import type { ToolHighlight } from "@/lib/portfolio-data"
import { faviconUrl } from "@/lib/favicon-url"

export function ToolHighlightCard({ tool }: { tool: ToolHighlight }) {
  const icon = tool.favicon ?? faviconUrl(tool.url)

  return (
    <div className="group relative flex flex-col gap-2 rounded-xl border border-border/50 bg-card p-5 transition-[transform,background-color,border-color] [transition-duration:var(--card-hover-speed,200ms)] [transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)] hover:bg-accent/50 hover:[transform:scale(var(--card-hover-scale,0.98))]">
      {tool.url && (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-0 rounded-xl"
          aria-label={tool.name}
          tabIndex={0}
        />
      )}
      <div className="flex h-16 items-center justify-center">
        {icon ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={icon} alt="" width={40} height={40} className="size-10 rounded-lg" />
        ) : (
          <div className="size-10 rounded-lg bg-muted" />
        )}
      </div>
      <h3 className="text-base font-medium text-foreground">{tool.name}</h3>
      <p className="line-clamp-2 text-sm text-muted-foreground [text-wrap:balance]">{tool.description}</p>
    </div>
  )
}
