import { Sledgehammer, Star } from "@solar-icons/react"
import type { ProjectItem } from "@/lib/portfolio-data"
import { useGradientWord } from "@/components/gradient-word-context"

const BADGE_COLORS: Record<string, string> = {
  software: "oklch(0.55 0.2 250)",
  brands: "oklch(0.55 0.2 330)",
  tools: "oklch(0.55 0.2 145)",
}

export function ProjectStatusBadge({ status }: { status: ProjectItem["status"] }) {
  const { activeWord } = useGradientWord()

  if (status !== "building" && status !== "new") {
    return null
  }

  const Icon = status === "new" ? Star : Sledgehammer
  const label = status === "new" ? "New" : "Building"

  return (
    <span
      className="absolute right-3 top-3 z-20 inline-flex cursor-default items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium leading-none text-white shadow-sm"
      style={{
        backgroundColor: BADGE_COLORS[activeWord] ?? BADGE_COLORS.software,
        transform: `rotate(${status === "new" ? 3 : -3}deg)`,
      }}
    >
      <Icon size={12} weight="Bold" aria-hidden="true" />
      {label}
    </span>
  )
}

export function ProjectCard({
  project,
}: {
  project: ProjectItem
}) {
  return (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border/60 bg-muted shadow-sm">
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="peer absolute inset-0 z-10 rounded-xl"
          aria-label={project.name}
        />
      )}
      <ProjectStatusBadge status={project.status} />
      <div className="absolute inset-x-0 bottom-0 z-0 flex flex-col gap-1 p-4">
        <h3 className="text-base font-medium text-foreground">
          {project.name}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground [text-wrap:balance]">
          {project.description}
        </p>
      </div>
    </div>
  )
}
