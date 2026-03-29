import type { ProjectItem } from "@/lib/portfolio-data"

export function ProjectPreviewCard({ project }: { project: ProjectItem }) {
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
      <div className="flex items-center gap-2 px-3 py-2.5 min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{project.name}</p>
      </div>
    </>
  )
}
