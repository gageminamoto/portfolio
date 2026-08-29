import { Sledgehammer, Star } from "@solar-icons/react"
import Image from "next/image"
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
    <div className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-800 shadow-sm">
      {project.image ? (
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(max-width: 640px) 82vw, 22rem"
          className="object-cover object-left-top"
        />
      ) : null}
      {project.video ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={project.image}
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover object-center"
        >
          <source src={project.video} type="video/mp4" />
        </video>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-950/95 via-zinc-950/50 to-transparent" aria-hidden="true" />
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="peer absolute inset-0 z-10 cursor-pointer rounded-xl active:scale-[0.97]"
          aria-label={project.name}
        />
      )}
      <ProjectStatusBadge status={project.status} />
      <div className="absolute inset-x-0 bottom-0 z-0 flex flex-col gap-1 p-4">
        <h3 className="text-base font-medium text-zinc-50">
          {project.name}
        </h3>
        <p className="line-clamp-2 text-sm text-zinc-300 [text-wrap:balance]">
          {project.description}
        </p>
      </div>
    </div>
  )
}
