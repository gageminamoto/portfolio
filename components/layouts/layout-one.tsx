"use client"

import { type ComponentType, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { HamburgerMenu, Layers, Pen, Pin, Suitcase, UserCircle, Widget2 } from "@solar-icons/react"
import { Boxes, Fingerprint, ShieldCheck } from "lucide-react"
import { portfolioData } from "@/lib/portfolio-data"
import { SocialIcons } from "@/components/social-icons"
import { BioSection } from "@/components/bio-section"
import { SiteFooter } from "@/components/site-footer"
import { WritingSection } from "@/components/writing-section"
import { Section } from "@/components/section"
import { ProjectCard } from "@/components/project-card"
import { WorkSection, WorkFilterTabs, type WorkFilter } from "@/components/work-section"
import { WorkHoverProvider } from "@/components/work-hover-context"
import { useGradientWord } from "@/components/gradient-word-context"
import { GitHubIcon } from "@/components/social-icons"
import { CursorTrail } from "@/components/cursor-trail"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import { cn } from "@/lib/utils"
import type { ProjectItem } from "@/lib/portfolio-data"

const BADGE_COLORS: Record<string, string> = {
  software: "oklch(0.55 0.2 250)",
  brands: "oklch(0.55 0.2 330)",
  tools: "oklch(0.55 0.2 145)",
}

type PrototypeId = "vault" | "glass" | "ledger"

const PROTOTYPES: Array<{
  id: PrototypeId
  label: string
  eyebrow: string
  description: string
  icon: ComponentType<{ className?: string }>
  mainClass: string
  panelClass: string
  accent: string
}> = [
  {
    id: "vault",
    label: "Vault",
    eyebrow: "01 / Blue trust",
    description: "1Password-inspired blue accents, tight cards, and crisp control chrome.",
    icon: ShieldCheck,
    mainClass: "max-w-2xl gap-5 px-4 py-6 md:py-10 [--prototype-accent:#0876ff] [--prototype-accent-soft:rgba(8,118,255,0.1)] [--prototype-panel:rgba(255,255,255,0.86)] [--prototype-shadow:0_20px_60px_rgba(15,23,42,0.08)] dark:[--prototype-panel:rgba(20,25,35,0.78)]",
    panelClass: "rounded-[1.75rem] border border-border/70 bg-[var(--prototype-panel)] p-4 shadow-[var(--prototype-shadow)] backdrop-blur-xl md:p-5",
    accent: "bg-[#0876ff]",
  },
  {
    id: "glass",
    label: "Glass",
    eyebrow: "02 / Spacious glow",
    description: "Larger whitespace, translucent layers, and softer depth for a calmer portfolio read.",
    icon: Fingerprint,
    mainClass: "max-w-3xl gap-7 px-5 py-8 md:py-14 [--prototype-accent:#635bff] [--prototype-accent-soft:rgba(99,91,255,0.12)] [--prototype-panel:rgba(255,255,255,0.72)] [--prototype-shadow:0_28px_80px_rgba(30,41,59,0.1)] dark:[--prototype-panel:rgba(18,18,28,0.72)]",
    panelClass: "rounded-[2rem] border border-white/70 bg-[var(--prototype-panel)] p-5 shadow-[var(--prototype-shadow)] backdrop-blur-2xl dark:border-white/10 md:p-7",
    accent: "bg-[#635bff]",
  },
  {
    id: "ledger",
    label: "Ledger",
    eyebrow: "03 / Compact system",
    description: "Dense rows, restrained monochrome surfaces, and sharper typographic contrast.",
    icon: Boxes,
    mainClass: "max-w-xl gap-4 px-4 py-5 md:py-8 [--prototype-accent:#0f172a] [--prototype-accent-soft:rgba(15,23,42,0.08)] [--prototype-panel:rgba(250,250,248,0.92)] [--prototype-shadow:0_14px_42px_rgba(15,23,42,0.07)] dark:[--prototype-accent:#f8fafc] dark:[--prototype-accent-soft:rgba(248,250,252,0.1)] dark:[--prototype-panel:rgba(14,14,14,0.88)]",
    panelClass: "rounded-2xl border border-border bg-[var(--prototype-panel)] p-4 shadow-[var(--prototype-shadow)] backdrop-blur md:p-4",
    accent: "bg-slate-950 dark:bg-slate-50",
  },
]

function PrototypeSwitcher({
  active,
  onChange,
}: {
  active: PrototypeId
  onChange: (id: PrototypeId) => void
}) {
  return (
    <div className="rounded-[1.35rem] border border-border/70 bg-card/85 p-1.5 shadow-[0_12px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="grid grid-cols-3 gap-1.5">
        {PROTOTYPES.map((prototype) => {
          const Icon = prototype.icon
          const selected = active === prototype.id

          return (
            <button
              key={prototype.id}
              type="button"
              onClick={() => onChange(prototype.id)}
              className={cn(
                "group flex min-w-0 flex-col gap-2 rounded-[1rem] px-3 py-2 text-left transition-[background-color,box-shadow,transform] duration-150 ease-out active:scale-[0.98]",
                selected
                  ? "bg-background shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
                  : "hover:bg-muted/60"
              )}
              aria-pressed={selected}
            >
              <span className="flex items-center gap-2">
                <span className={cn("flex size-7 items-center justify-center rounded-full text-white shadow-sm", prototype.accent)}>
                  <Icon className="size-3.5" />
                </span>
                <span className="truncate text-[13px] font-semibold tracking-[-0.01em] text-foreground">{prototype.label}</span>
              </span>
              <span className="hidden text-[11px] leading-4 text-muted-foreground sm:block">{prototype.eyebrow}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ProjectListItem({ project }: { project: ProjectItem }) {
  const [badgeTilt] = useState(() => Math.random() * 14 - 7)
  const { activeWord } = useGradientWord()
  const isGuandan = project.name === "Guandan Rules"
  const isInteractive = Boolean(project.url)

  return (
    <div
      className={`group relative flex items-center gap-3 rounded-[1.15rem] border border-border/60 bg-card/90 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-[transform,background-color,border-color,box-shadow] duration-150 [transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)]${
        isInteractive ? " hover:-translate-y-px hover:border-[color:var(--prototype-accent)] hover:bg-background hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)]" : ""
      }`}
    >
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-0 rounded-xl"
          aria-label={project.name}
          tabIndex={0}
        />
      )}
        {(project.status === "building" || project.status === "new") && (
          <motion.span
            className="absolute -right-1.5 -top-1.5 z-10 cursor-default rounded-full px-2 py-0.5 text-[11px] font-medium text-white shadow-sm"
            style={{ backgroundColor: BADGE_COLORS[activeWord] ?? BADGE_COLORS.software }}
            initial={{ rotate: 0 }}
            animate={{ rotate: badgeTilt }}
            whileHover={{ scale: 1.1, rotate: badgeTilt * 1.5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          >
            {project.status === "new" ? "New" : "Building"}
          </motion.span>
        )}
        {isGuandan ? (
          <div className="flex size-8 shrink-0 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/projects/guandian-rules-logo.svg"
              alt=""
              className="h-4 w-auto"
            />
          </div>
        ) : (
          project.favicon && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={project.favicon} alt="" width={32} height={32} className="size-8 shrink-0 rounded-lg" />
          )
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{project.name}</span>
          <span className="truncate text-xs text-muted-foreground">{project.description}</span>
        </div>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 shrink-0 rounded-md p-1.5 text-muted-foreground/50 transition-colors hover:text-foreground"
            aria-label={`${project.name} on GitHub`}
          >
            <GitHubIcon className="size-4" />
          </a>
        )}
    </div>
  )
}

export function LayoutOne() {
  const { name, bio, socials, email, projects } = portfolioData
  const { setActiveWord, setCursorTrailActive } = useGradientWord()
  const [projectView, setProjectView] = useState<"list" | "card">("card")
  const [workFilter, setWorkFilter] = useState<WorkFilter>(null)
  const [prototypeId, setPrototypeId] = useState<PrototypeId>("vault")
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp
  const prototype = PROTOTYPES.find((option) => option.id === prototypeId) ?? PROTOTYPES[0]

  return (
    <WorkHoverProvider>
    <motion.main
      id="main-content"
      className={cn("relative z-10 mx-auto flex min-h-screen flex-col", prototype.mainClass)}
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <PrototypeSwitcher active={prototypeId} onChange={setPrototypeId} />
      </motion.div>

      {/* Header */}
      <motion.header variants={item} className={cn("relative overflow-hidden", prototype.panelClass)}>
        <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-[var(--prototype-accent-soft)] blur-3xl" />
        <div className="relative flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--prototype-accent)]">{prototype.eyebrow}</p>
            <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm">
              <span className={cn("size-1.5 rounded-full", prototype.accent)} />
              Prototype
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold tracking-[-0.055em] text-foreground sm:text-5xl">
              {name}
            </h1>
            <p className="max-w-md text-sm font-medium leading-6 text-foreground/75">{prototype.description}</p>
            <BioSection bio={bio} className="max-w-[38rem]" onWordChange={(word) => { setActiveWord(word) }} onUserClick={() => { setCursorTrailActive(true) }} />
          </div>
          <SocialIcons socials={socials} email={email} />
        </div>
      </motion.header>

      {/* Work */}
      <motion.section variants={item} className={cn("flex flex-col gap-4", prototype.panelClass)}>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Suitcase size={14} weight="Bold" />
            Work
          </h2>
          <WorkFilterTabs active={workFilter} onChange={setWorkFilter} />
        </div>
        <div>
          <WorkSection filter={workFilter} />
        </div>
      </motion.section>

      {/* Projects */}
      <motion.section variants={item} className={cn("flex flex-col gap-4", prototype.panelClass)}>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Pin size={14} weight="Bold" />
            Projects
          </h2>
          <button
            onClick={() => setProjectView(projectView === "list" ? "card" : "list")}
            className="rounded-md p-1 text-muted-foreground/50 transition-[color,transform] hover:text-muted-foreground active:scale-[0.97]"
            aria-label={projectView === "list" ? "Switch to card view" : "Switch to list view"}
          >
            {projectView === "list" ? (
              <Widget2 size={14} weight="Bold" />
            ) : (
              <HamburgerMenu size={14} weight="Bold" />
            )}
          </button>
        </div>

        {projectView === "list" ? (
          <div className="flex flex-col gap-2">
            {projects.map((project) => (
              <ProjectListItem key={project.name} project={project} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.name}
                project={project}
                index={index}
                guandanVariant="cards"
              />
            ))}
          </div>
        )}
      </motion.section>

      {/* About */}
      <motion.div variants={item} className={prototype.panelClass}>
        <Section title="About" href="/about" icon={<UserCircle size={14} weight="Bold" />}>
          <p className="text-sm text-muted-foreground">
            More about me.
          </p>
        </Section>
      </motion.div>

      {/* Tools */}
      <motion.div variants={item} className={prototype.panelClass}>
        <Section title="Tools" href="/tools" icon={<Layers size={14} weight="Bold" />}>
          <p className="text-sm text-muted-foreground">
            Everything I build with.
          </p>
        </Section>
      </motion.div>

      {/* Writing — Notion CMS */}
      <motion.div variants={item} className={prototype.panelClass}>
        <Section title="Writing" href="/writing" icon={<Pen size={14} weight="Bold" />}>
          <WritingSection variant="default" />
        </Section>
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>

      <CursorTrail />
    </motion.main>
    </WorkHoverProvider>
  )
}
