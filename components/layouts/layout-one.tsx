"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion"
import { Layers, Palette, Pin, Pen2 } from "@solar-icons/react"
import { useDialKit } from "dialkit"
import { portfolioData, WORD_SECTION_CONFIG } from "@/lib/portfolio-data"
import type { BrandItem, ProjectItem, ToolHighlight } from "@/lib/portfolio-data"
import { generateSeedProjects } from "@/lib/seed-projects"
import { SocialIcons } from "@/components/social-icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { BioSection } from "@/components/bio-section"
import { SiteFooter } from "@/components/site-footer"
import { TestimonialsSection } from "@/components/testimonials-section"
import { WritingSection } from "@/components/writing-section"
import { MosaicGallery, type GalleryItem } from "@/components/mosaic-gallery"
import { useGradientWord } from "@/components/gradient-word-context"
import { GitHubIcon } from "@/components/social-icons"
import { CursorTrail } from "@/components/cursor-trail"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import { faviconUrl } from "@/lib/favicon-url"

const BADGE_COLORS: Record<string, string> = {
  design: "oklch(0.55 0.2 250)",
  software: "oklch(0.55 0.2 250)",
  brands: "oklch(0.55 0.2 330)",
  tools: "oklch(0.55 0.2 145)",
}

const SECTION_ORDER = ["software", "brands", "tools", "writing"] as const

const SECTION_ICONS: Record<string, React.ReactNode> = {
  design: <Pin size={14} weight="Bold" />,
  software: <Pin size={14} weight="Bold" />,
  brands: <Palette size={14} weight="Bold" />,
  tools: <Layers size={14} weight="Bold" />,
  writing: <Pen2 size={14} weight="Bold" />,
}

function ProjectListItem({ project }: { project: ProjectItem }) {
  const [badgeTilt] = useState(() => Math.random() * 14 - 7)
  const { activeWord } = useGradientWord()

  return (
    <div className="group relative flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 transition-[transform,background-color,border-color] [transition-duration:var(--card-hover-speed,200ms)] [transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)] hover:bg-accent/50 hover:[transform:scale(var(--card-hover-scale,0.98))]">
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
        {project.status === "building" && (
          <motion.span
            className="absolute -right-1.5 -top-1.5 z-10 cursor-default rounded-full px-2 py-0.5 text-[11px] font-medium text-white shadow-sm"
            style={{ backgroundColor: BADGE_COLORS[activeWord] ?? BADGE_COLORS.software }}
            initial={{ rotate: 0 }}
            animate={{ rotate: badgeTilt }}
            whileHover={{ scale: 1.1, rotate: badgeTilt * 1.5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          >
            Building
          </motion.span>
        )}
        {project.favicon && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={project.favicon} alt="" width={32} height={32} className="size-8 shrink-0 rounded-lg" />
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

function BrandListItem({ brand }: { brand: BrandItem }) {
  const icon = brand.favicon ?? faviconUrl(brand.url, 32)

  return (
    <div className="group relative flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 transition-[transform,background-color,border-color] [transition-duration:var(--card-hover-speed,200ms)] [transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)] hover:bg-accent/50 hover:[transform:scale(var(--card-hover-scale,0.98))]">
      {brand.url && (
        <a
          href={brand.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-0 rounded-xl"
          aria-label={brand.name}
          tabIndex={0}
        />
      )}
      {icon && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={icon} alt="" width={32} height={32} className="size-8 shrink-0 rounded-lg" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{brand.name}</span>
        <span className="truncate text-xs text-muted-foreground">{brand.description}</span>
      </div>
    </div>
  )
}

function ToolListItem({ tool }: { tool: ToolHighlight }) {
  const icon = tool.favicon ?? faviconUrl(tool.url, 32)

  return (
    <div className="group relative flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 transition-[transform,background-color,border-color] [transition-duration:var(--card-hover-speed,200ms)] [transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)] hover:bg-accent/50 hover:[transform:scale(var(--card-hover-scale,0.98))]">
      {tool.url && (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-0 rounded-xl"
          aria-label={tool.name}
          tabIndex={0}
        />
      )}
      {icon && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={icon} alt="" width={32} height={32} className="size-8 shrink-0 rounded-lg" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{tool.name}</span>
        <span className="truncate text-xs text-muted-foreground">{tool.description}</span>
      </div>
    </div>
  )
}

export function LayoutOne() {
  const { name, bio, socials, email, projects, brands, favoriteTools } = portfolioData
  const { activeWord, setActiveWord, setCursorTrailActive } = useGradientWord()
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp

  const seedDial = useDialKit("Seed projects", {
    enabled: false,
    count: [5, 1, 10, 1],
  })

  const hoverDial = useDialKit("Card hover", {
    scale: [0.985, 0.9, 1, 0.005],
    speed: [800, 50, 1500, 10],
  })

  const orderedSections = useMemo(() => {
    const projectItems: GalleryItem[] = projects.map((p) => ({
      name: p.name, url: p.url, description: p.description,
      year: p.year, status: p.status,
    }))
    const seedItems: GalleryItem[] = seedDial.enabled
      ? generateSeedProjects(seedDial.count).map((p) => ({
          name: p.name, url: p.url, description: p.description,
          year: p.year, status: p.status,
        }))
      : []

    const sectionData: Record<string, { title: string; icon: React.ReactNode; items: GalleryItem[] }> = {
      software: {
        title: WORD_SECTION_CONFIG.software.title,
        icon: SECTION_ICONS.software,
        items: [...projectItems, ...seedItems],
      },
      brands: {
        title: WORD_SECTION_CONFIG.brands.title,
        icon: SECTION_ICONS.brands,
        items: brands.map((b) => ({ name: b.name, url: b.url, description: b.description })),
      },
      tools: {
        title: WORD_SECTION_CONFIG.tools.title,
        icon: SECTION_ICONS.tools,
        items: favoriteTools.map((t) => ({ name: t.name, url: t.url, description: t.description })),
      },
      writing: {
        title: WORD_SECTION_CONFIG.writing.title,
        icon: SECTION_ICONS.writing,
        items: [],
      },
    }

    let order: typeof SECTION_ORDER[number][]
    if (activeWord === "design") {
      order = [...SECTION_ORDER]
    } else if ((SECTION_ORDER as readonly string[]).includes(activeWord)) {
      order = [activeWord as typeof SECTION_ORDER[number], ...SECTION_ORDER.filter((s) => s !== activeWord)]
    } else {
      order = [...SECTION_ORDER]
    }

    return order.map((key) => ({ key, ...sectionData[key] }))
  }, [projects, brands, favoriteTools, activeWord, seedDial.enabled, seedDial.count])

  return (
    <motion.main
      id="main-content"
      className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 pb-16 pt-16 md:pb-24"
      style={{
        "--card-hover-scale": hoverDial.scale,
        "--card-hover-speed": `${hoverDial.speed}ms`,
      } as React.CSSProperties}
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.header variants={item} className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {name}
            </h1>
            <BioSection bio={bio} activeWord={activeWord} onWordChange={(word) => { setActiveWord(word) }} onUserClick={() => { setCursorTrailActive(true) }} />
          </div>
          <ThemeToggle />
        </div>
        <SocialIcons socials={socials} email={email} />
      </motion.header>

      {/* Dynamic content sections — reorder based on active word */}
      <motion.div variants={item} className="flex flex-col gap-8">
        {orderedSections.map((section, i) => {
          const isActive = section.key === activeWord
          return (
            <motion.section
              key={section.key}
              layout
              className="flex flex-col gap-4"
              transition={{
                layout: {
                  duration: shouldReduceMotion ? 0 : 0.4,
                  ease: [0.23, 1, 0.32, 1],
                },
              }}
            >
              <motion.h2
                layout="position"
                className={`flex items-center gap-1.5 text-sm transition-colors duration-200 ${
                  isActive || activeWord === "design"
                    ? "text-muted-foreground"
                    : "text-muted-foreground/40"
                }`}
                transition={{
                  layout: {
                    duration: shouldReduceMotion ? 0 : 0.4,
                    ease: [0.23, 1, 0.32, 1],
                  },
                }}
              >
                {section.icon}
                {section.title}
              </motion.h2>
              {section.key === "writing" ? (
                <WritingSection />
              ) : (
                <MosaicGallery items={section.items} />
              )}
            </motion.section>
          )
        })}
      </motion.div>

      <motion.div variants={item}>
        <TestimonialsSection />
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>

      <CursorTrail />
    </motion.main>
  )
}
