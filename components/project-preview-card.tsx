"use client"

import { useState } from "react"
import { Copy, Github, Check } from "lucide-react"
import type { ProjectItem } from "@/lib/portfolio-data"

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
            width={800}
            height={500}
            className="size-full object-cover"
          />
        </div>
      )}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{project.name}</p>
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
