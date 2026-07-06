"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import type { Experiment } from "@/lib/experiments"
import { experiments } from "@/lib/experiments"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import { cn } from "@/lib/utils"

type ExperimentsSectionProps = {
  limit?: number
  showIntro?: boolean
}

const statusLabels: Record<Experiment["status"], string> = {
  live: "Live",
  building: "Building",
  sketch: "Sketch",
}

type ExperimentMediaAspectRatio = NonNullable<NonNullable<Experiment["media"]>["aspectRatio"]>

const mediaAspectClasses: Record<ExperimentMediaAspectRatio, string> = {
  video: "aspect-video",
  square: "aspect-square",
}

function formatExperimentDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  })
}

function ExperimentMediaPreview({ experiment }: { experiment: Experiment }) {
  if (!experiment.media) return null

  const aspectRatio = experiment.media.aspectRatio ?? "video"

  return (
    <div
      className={cn(
        "relative mt-3 overflow-hidden rounded-md border border-border/60 bg-muted/30",
        mediaAspectClasses[aspectRatio],
      )}
    >
      <Image
        src={experiment.media.src}
        alt={experiment.media.alt}
        fill
        sizes="(min-width: 768px) 520px, calc(100vw - 48px)"
        className="object-contain p-4"
      />
    </div>
  )
}

function ExperimentRow({ experiment }: { experiment: Experiment }) {
  const title = (
    <h3 className="inline-flex items-center text-sm font-medium text-foreground">
      <span>{experiment.title}</span>
      {experiment.url ? (
        <ArrowUpRight className="ml-1 size-3.5 shrink-0 -translate-x-1 text-muted-foreground/60 opacity-0 transition-[opacity,transform] duration-150 ease motion-reduce:translate-x-0 motion-reduce:transition-none group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
      ) : null}
    </h3>
  )

  const content = (
    <>
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-col gap-0.5">
            {title}
            <span className="text-[11px] text-muted-foreground/70">
              {formatExperimentDate(experiment.date)}
            </span>
          </div>
        </div>
        <span className="mt-0.5 shrink-0 rounded-full border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground">
          {statusLabels[experiment.status]}
        </span>
      </div>

      <ExperimentMediaPreview experiment={experiment} />

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {experiment.summary}
      </p>

      {experiment.notes ? (
        <p className="mt-3 text-[11px] text-muted-foreground/70">
          {experiment.notes}
        </p>
      ) : null}
    </>
  )

  const className = cn(
    "group block rounded-sm py-4",
    experiment.url
      ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      : null,
  )

  if (experiment.url) {
    return (
      <a href={experiment.url} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    )
  }

  return <article className={className}>{content}</article>
}

export function ExperimentsSection({ limit, showIntro = false }: ExperimentsSectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const items = typeof limit === "number" ? experiments.slice(0, limit) : experiments

  return (
    <motion.div
      className="flex flex-col"
      variants={shouldReduceMotion ? undefined : stagger}
      initial={showIntro ? "hidden" : undefined}
      animate={showIntro ? "show" : undefined}
    >
      {showIntro ? (
        <motion.p variants={shouldReduceMotion ? noMotion : fadeUp} className="mb-2 text-sm leading-6 text-muted-foreground">
          Small prototypes, game-adjacent tools, and loose ideas before they become full projects.
        </motion.p>
      ) : null}
      {items.map((experiment) => (
        <motion.div key={experiment.id} variants={shouldReduceMotion ? noMotion : fadeUp}>
          <ExperimentRow experiment={experiment} />
        </motion.div>
      ))}
    </motion.div>
  )
}
