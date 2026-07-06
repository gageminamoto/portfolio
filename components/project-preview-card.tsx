import type { ProjectItem } from "@/lib/portfolio-data"
import { OptimizedImage } from "@/components/optimized-image"

export function ProjectPreviewCard({ project }: { project: ProjectItem }) {
  return (
    <>
      {project.image && (
        <OptimizedImage
          src={project.image}
          alt={`${project.name} preview`}
          width={800}
          height={500}
          sizes="(min-width: 640px) 320px, 100vw"
          className="aspect-[16/10] w-full"
          imageClassName="size-full object-cover"
        />
      )}
      <div className="flex items-center gap-2 px-3 py-2.5 min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{project.name}</p>
      </div>
    </>
  )
}
