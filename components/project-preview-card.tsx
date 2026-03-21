"use client"

import { useState } from "react"
import { Copy, Github, Check } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import type { ProjectItem } from "@/lib/portfolio-data"

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase()
}

export function ProjectPreviewCard({ project }: { project: ProjectItem }) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (project.url) {
      navigator.clipboard.writeText(project.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const iconBtnClass = "flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"

  return (
    <>
      {project.image && (
        <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={`${project.name} preview`}
            className="size-full object-cover"
          />
        </div>
      )}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{project.name}</p>
          {project.collaborators && project.collaborators.length > 0 && (
            <TooltipProvider delayDuration={0}>
              <div className="flex -space-x-1.5 shrink-0">
                {project.collaborators.map((c) => (
                  <Tooltip key={c.name}>
                    <TooltipTrigger asChild>
                      <span>
                        <Avatar className="size-5 border border-popover">
                          <AvatarImage src={c.avatarUrl} alt={c.name} />
                          <AvatarFallback className="text-[8px]">{getInitials(c.name)}</AvatarFallback>
                        </Avatar>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {c.name}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-center shrink-0">
          {project.url && (
            <button onClick={handleCopyLink} className={iconBtnClass} aria-label="Copy link">
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            </button>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={iconBtnClass}
              aria-label="View on GitHub"
            >
              <Github className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </>
  )
}
