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

type ExperimentLayoutMode =
  | "feed"
  | "strip"
  | "mosaic"
  | "vertical"
  | "timeline"
  | "gallery"
  | "side-by-side"
  | "invite"
  | "rolodex"
  | "canvas"

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
  return [
    "feed",
    "strip",
    "mosaic",
    "vertical",
    "timeline",
    "gallery",
    "side-by-side",
    "invite",
    "rolodex",
    "canvas",
  ].includes(value)
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

function ExperimentMediaFrame({
  experiment,
  className,
  imageClassName,
}: {
  experiment: Experiment
  className?: string
  imageClassName?: string
}) {
  if (experiment.media) {
    return (
      <div className={cn("relative overflow-hidden rounded-md border border-border/60 bg-muted/30", className)}>
        <Image
          src={experiment.media.src}
          alt={experiment.media.alt}
          fill
          sizes="(min-width: 768px) 520px, calc(100vw - 48px)"
          className={cn("object-contain p-4", imageClassName)}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md border border-dashed border-border/70 bg-muted/20",
        className,
      )}
      aria-hidden="true"
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/60">
        {experiment.status}
      </span>
    </div>
  )
}

function ExperimentShell({
  experiment,
  className,
  children,
}: {
  experiment: Experiment
  className: string
  children: React.ReactNode
}) {
  if (experiment.url) {
    return (
      <a href={experiment.url} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }

  return <article className={className}>{children}</article>
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

function ExperimentVerticalRow({ experiment }: { experiment: Experiment }) {
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

  return (
    <ExperimentShell
      experiment={experiment}
      className="group block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {content}
    </ExperimentShell>
  )
}

function ExperimentGalleryCard({ experiment }: { experiment: Experiment }) {
  const content = (
    <>
      <ExperimentMediaFrame experiment={experiment} className="aspect-[4/3]" />
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

  return (
    <ExperimentShell experiment={experiment} className={className}>
      {content}
    </ExperimentShell>
  )
}

function ExperimentStripCard({ experiment }: { experiment: Experiment }) {
  return (
    <ExperimentShell
      experiment={experiment}
      className="group block h-full min-w-[min(82vw,22rem)] snap-start rounded-lg border border-border/60 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ExperimentMediaFrame experiment={experiment} className="aspect-[16/10]" />
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
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
    </ExperimentShell>
  )
}

function ExperimentMosaicCard({ experiment, index }: { experiment: Experiment; index: number }) {
  return (
    <ExperimentShell
      experiment={experiment}
      className={cn(
        "group block rounded-lg border border-border/60 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        index === 0 && "sm:col-span-2",
      )}
    >
      <ExperimentMediaFrame experiment={experiment} className={cn(index === 0 ? "aspect-[16/9]" : "aspect-square")} />
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
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
    </ExperimentShell>
  )
}

function ExperimentTimelineItem({ experiment }: { experiment: Experiment }) {
  return (
    <ExperimentShell
      experiment={experiment}
      className="group relative block rounded-sm py-4 pl-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="absolute left-0 top-5 size-2 rounded-full bg-muted-foreground/50" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <div>
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
    </ExperimentShell>
  )
}

function ExperimentSideBySideItem({ experiment, index }: { experiment: Experiment; index: number }) {
  return (
    <ExperimentShell
      experiment={experiment}
      className="group grid gap-4 rounded-lg border border-border/60 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:grid-cols-[0.9fr_1.1fr]"
    >
      <ExperimentMediaFrame
        experiment={experiment}
        className={cn("aspect-[4/3]", index % 2 === 1 && "sm:order-2")}
      />
      <div className="flex min-w-0 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
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
        </div>
      </div>
    </ExperimentShell>
  )
}

function ExperimentInviteItem({ experiment, index }: { experiment: Experiment; index: number }) {
  return (
    <ExperimentShell
      experiment={experiment}
      className="group block min-h-[14rem] snap-start rounded-lg border border-border/60 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex h-full flex-col justify-between gap-6">
        <div className="flex items-start justify-between gap-3">
          <span className="font-mono text-[11px] text-muted-foreground/70">
            {String(index + 1).padStart(2, "0")}
          </span>
          <ExperimentStatusPill status={experiment.status} />
        </div>
        <div>
          <ExperimentTitle experiment={experiment} />
          <div>
            <ExperimentDate date={experiment.date} />
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {experiment.summary}
          </p>
        </div>
      </div>
    </ExperimentShell>
  )
}

function ExperimentRolodexItem({ experiment, index }: { experiment: Experiment; index: number }) {
  const rotateClass = index % 3 === 0 ? "sm:-rotate-1" : index % 3 === 1 ? "sm:rotate-1" : "sm:rotate-0"

  return (
    <ExperimentShell
      experiment={experiment}
      className={cn(
        "group block rounded-lg border border-border/60 bg-background p-4 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "sm:-mt-2 first:sm:mt-0",
        rotateClass,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <ExperimentTitle experiment={experiment} />
          <div>
            <ExperimentDate date={experiment.date} />
          </div>
        </div>
        <ExperimentStatusPill status={experiment.status} />
      </div>
      <p className="text-sm leading-6 text-muted-foreground">
        {experiment.summary}
      </p>
    </ExperimentShell>
  )
}

function ExperimentCanvasItem({ experiment, index }: { experiment: Experiment; index: number }) {
  const desktopPositions = [
    "sm:left-0 sm:top-0 sm:w-[58%]",
    "sm:right-0 sm:top-24 sm:w-[48%]",
    "sm:left-10 sm:bottom-0 sm:w-[52%]",
  ]

  return (
    <ExperimentShell
      experiment={experiment}
      className={cn(
        "group block rounded-lg border border-border/60 bg-background/95 p-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:absolute",
        desktopPositions[index % desktopPositions.length],
      )}
    >
      <ExperimentMediaFrame experiment={experiment} className="aspect-[16/10]" />
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <ExperimentTitle experiment={experiment} />
          <div>
            <ExperimentDate date={experiment.date} />
          </div>
        </div>
        <ExperimentStatusPill status={experiment.status} />
      </div>
    </ExperimentShell>
  )
}

function ExperimentsList({
  items,
  mode,
  shouldReduceMotion,
}: {
  items: Experiment[]
  mode: ExperimentLayoutMode
  shouldReduceMotion: boolean | null
}) {
  if (mode === "strip") {
    return (
      <div className="-mx-6 flex snap-x gap-3 overflow-x-auto px-6 pb-2">
        {items.map((experiment) => (
          <motion.div key={experiment.id} variants={shouldReduceMotion ? noMotion : fadeUp}>
            <ExperimentStripCard experiment={experiment} />
          </motion.div>
        ))}
      </div>
    )
  }

  if (mode === "mosaic") {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((experiment, index) => (
          <motion.div key={experiment.id} variants={shouldReduceMotion ? noMotion : fadeUp}>
            <ExperimentMosaicCard experiment={experiment} index={index} />
          </motion.div>
        ))}
      </div>
    )
  }

  if (mode === "vertical") {
    return (
      <div className="flex flex-col">
        {items.map((experiment) => (
          <motion.div key={experiment.id} variants={shouldReduceMotion ? noMotion : fadeUp}>
            <ExperimentVerticalRow experiment={experiment} />
          </motion.div>
        ))}
      </div>
    )
  }

  if (mode === "timeline") {
    return (
      <div className="relative flex flex-col before:absolute before:left-[3px] before:top-5 before:h-[calc(100%-2.5rem)] before:w-px before:bg-border">
        {items.map((experiment) => (
          <motion.div key={experiment.id} variants={shouldReduceMotion ? noMotion : fadeUp}>
            <ExperimentTimelineItem experiment={experiment} />
          </motion.div>
        ))}
      </div>
    )
  }

  if (mode === "gallery") {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((experiment) => (
          <motion.div key={experiment.id} variants={shouldReduceMotion ? noMotion : fadeUp}>
            <ExperimentGalleryCard experiment={experiment} />
          </motion.div>
        ))}
      </div>
    )
  }

  if (mode === "side-by-side") {
    return (
      <div className="flex flex-col gap-3">
        {items.map((experiment, index) => (
          <motion.div key={experiment.id} variants={shouldReduceMotion ? noMotion : fadeUp}>
            <ExperimentSideBySideItem experiment={experiment} index={index} />
          </motion.div>
        ))}
      </div>
    )
  }

  if (mode === "invite") {
    return (
      <div className="flex max-h-[28rem] snap-y flex-col gap-3 overflow-y-auto pr-1">
        {items.map((experiment, index) => (
          <motion.div key={experiment.id} variants={shouldReduceMotion ? noMotion : fadeUp}>
            <ExperimentInviteItem experiment={experiment} index={index} />
          </motion.div>
        ))}
      </div>
    )
  }

  if (mode === "rolodex") {
    return (
      <div className="flex flex-col gap-3 sm:pt-2">
        {items.map((experiment, index) => (
          <motion.div key={experiment.id} variants={shouldReduceMotion ? noMotion : fadeUp}>
            <ExperimentRolodexItem experiment={experiment} index={index} />
          </motion.div>
        ))}
      </div>
    )
  }

  if (mode === "canvas") {
    return (
      <div className="relative flex min-h-[34rem] flex-col gap-3 sm:block">
        {items.map((experiment, index) => (
          <motion.div key={experiment.id} variants={shouldReduceMotion ? noMotion : fadeUp}>
            <ExperimentCanvasItem experiment={experiment} index={index} />
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {items.map((experiment) => (
        <motion.div key={experiment.id} variants={shouldReduceMotion ? noMotion : fadeUp}>
          <ExperimentFeedRow experiment={experiment} />
        </motion.div>
      ))}
    </div>
  )
}

export function ExperimentsSection({ limit, showIntro = false }: ExperimentsSectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const layoutDial = useDialKit("Experiments layout", {
    mode: {
      type: "select",
      default: "feed",
      options: [
        { value: "feed", label: "Feed" },
        { value: "strip", label: "Case strip" },
        { value: "mosaic", label: "Mosaic" },
        { value: "vertical", label: "Vertical" },
        { value: "timeline", label: "Timeline" },
        { value: "gallery", label: "Gallery" },
        { value: "side-by-side", label: "Side-by-side" },
        { value: "invite", label: "Invite scroll" },
        { value: "rolodex", label: "Rolodex" },
        { value: "canvas", label: "Canvas" },
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
      className="flex flex-col"
      variants={shouldReduceMotion ? undefined : stagger}
      initial={showIntro ? "hidden" : undefined}
      animate={showIntro ? "show" : undefined}
    >
      {showIntro ? (
        <motion.p
          variants={shouldReduceMotion ? noMotion : fadeUp}
          className="mb-2 text-sm leading-6 text-muted-foreground"
        >
          Small prototypes, game-adjacent tools, and loose ideas before they become full projects.
        </motion.p>
      ) : null}
      <ExperimentsList items={items} mode={mode} shouldReduceMotion={shouldReduceMotion} />
    </motion.div>
  )
}
