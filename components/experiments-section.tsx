"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useDialKit } from "dialkit"
import type { Experiment } from "@/lib/experiments"
import { experiments } from "@/lib/experiments"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import { cn } from "@/lib/utils"

type ExperimentsSectionProps = {
  limit?: number
  showIntro?: boolean
}

type ExperimentLayoutMode = "feed" | "list" | "cards"

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

function isExperimentLayoutMode(value: string): value is ExperimentLayoutMode {
  return value === "feed" || value === "list" || value === "cards"
}

function ExperimentTitle({ experiment }: { experiment: Experiment }) {
  return (
    <h3 className="inline-flex items-center text-sm font-medium text-foreground">
      <span>{experiment.title}</span>
      {experiment.url ? (
        <ArrowUpRight className="ml-1 size-3.5 shrink-0 -translate-x-1 text-muted-foreground/60 opacity-0 transition-[opacity,transform] duration-150 ease motion-reduce:translate-x-0 motion-reduce:transition-none group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
      ) : null}
    </h3>
  )
}

function ExperimentStatusPill({ status }: { status: Experiment["status"] }) {
  return (
    <span className="mt-0.5 shrink-0 rounded-full border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground">
      {statusLabels[status]}
    </span>
  )
}

function ExperimentDate({ date }: { date: string }) {
  return (
    <span className="text-[11px] text-muted-foreground/70">
      {formatExperimentDate(date)}
    </span>
  )
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

function ExperimentFeedRow({ experiment }: { experiment: Experiment }) {
  const content = (
    <>
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-col gap-0.5">
            <ExperimentTitle experiment={experiment} />
            <ExperimentDate date={experiment.date} />
          </div>
        </div>
        <ExperimentStatusPill status={experiment.status} />
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

function ExperimentListRow({ experiment }: { experiment: Experiment }) {
  const content = (
    <div className="flex min-w-0 gap-3 py-4">
      {experiment.media ? (
        <div className="relative mt-0.5 size-12 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted/30">
          <Image
            src={experiment.media.src}
            alt={experiment.media.alt}
            fill
            sizes="48px"
            className="object-contain p-2"
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <ExperimentTitle experiment={experiment} />
            <div>
              <ExperimentDate date={experiment.date} />
            </div>
          </div>
          <ExperimentStatusPill status={experiment.status} />
        </div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {experiment.summary}
        </p>
      </div>
    </div>
  )

  if (experiment.url) {
    return (
      <a
        href={experiment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {content}
      </a>
    )
  }

  return <article className="group">{content}</article>
}

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const content = (
    <>
      <ExperimentMediaPreview experiment={experiment} />
      <div className="flex min-w-0 items-start justify-between gap-3 pt-3">
        <div className="min-w-0">
          <ExperimentTitle experiment={experiment} />
          <div>
            <ExperimentDate date={experiment.date} />
          </div>
        </div>
        <ExperimentStatusPill status={experiment.status} />
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {experiment.summary}
      </p>
    </>
  )

  const className = "group block rounded-lg border border-border/60 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

  if (experiment.url) {
    return (
      <a href={experiment.url} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    )
  }

  return <article className={className}>{content}</article>
}

function ExperimentItem({ experiment, mode }: { experiment: Experiment; mode: ExperimentLayoutMode }) {
  if (mode === "list") {
    return <ExperimentListRow experiment={experiment} />
  }

  if (mode === "cards") {
    return <ExperimentCard experiment={experiment} />
  }

  return <ExperimentFeedRow experiment={experiment} />
}

export function ExperimentsSection({ limit, showIntro = false }: ExperimentsSectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const layoutDial = useDialKit("Experiments layout", {
    mode: {
      type: "select",
      default: "feed",
      options: [
        { value: "feed", label: "Feed" },
        { value: "list", label: "List" },
        { value: "cards", label: "Cards" },
      ],
    },
  }, {
    id: "experiments-layout",
    persist: true,
  })
  const items = typeof limit === "number" ? experiments.slice(0, limit) : experiments
  const mode = isExperimentLayoutMode(layoutDial.mode) ? layoutDial.mode : "feed"

  return (
    <motion.div
      className={cn(
        mode === "cards" ? "grid grid-cols-1 gap-3 sm:grid-cols-2" : "flex flex-col",
      )}
      variants={shouldReduceMotion ? undefined : stagger}
      initial={showIntro ? "hidden" : undefined}
      animate={showIntro ? "show" : undefined}
    >
      {showIntro ? (
        <motion.p
          variants={shouldReduceMotion ? noMotion : fadeUp}
          className={cn(
            "text-sm leading-6 text-muted-foreground",
            mode === "cards" ? "sm:col-span-2" : "mb-2",
          )}
        >
          Small prototypes, game-adjacent tools, and loose ideas before they become full projects.
        </motion.p>
      ) : null}
      {items.map((experiment) => (
        <motion.div key={experiment.id} variants={shouldReduceMotion ? noMotion : fadeUp}>
          <ExperimentItem experiment={experiment} mode={mode} />
        </motion.div>
      ))}
    </motion.div>
  )
}
