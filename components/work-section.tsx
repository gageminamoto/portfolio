"use client"

import { type CSSProperties, type ReactNode, type TouchEvent, type WheelEvent, useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowUp, ExternalLink, X } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useWorkHover, workItemElementId } from "@/components/work-hover-context"

interface WorkItem {
  name: string
  url: string
  image: string
  type: string
  description: string
  outcome: string
  contributors: Contributor[]
  techStack: string
  caseStudyImages?: string[]
}

interface Contributor {
  name: string
  avatarUrl?: string
  url?: string
}

const workItems: WorkItem[] = [
  {
    name: "Mizen",
    url: "https://www.mizen.recipes/",
    image: "/images/mizen-hover.gif",
    type: "Product",
    description: "Mizen is a calm recipe workspace for saving recipes from the web, organizing what to cook, and making home cooking feel clearer and less hectic.",
    outcome: "Defined the core product experience, interaction model, and visual direction for a simpler recipe-saving and cooking workflow.",
    contributors: [
      { name: "Gage Minamoto", avatarUrl: "/avatars/gage.png", url: "https://linkedin.com/in/gageminamoto" },
      { name: "Michelle Tran", avatarUrl: "/avatars/michelle.png", url: "https://www.linkedin.com/in/michelle-tran-a48a14203/" },
      { name: "William Liang", avatarUrl: "/avatars/william.jpg", url: "https://www.linkedin.com/in/william-liang808/" },
      { name: "Zelda Cole", avatarUrl: "/avatars/zelda.jpg", url: "https://www.linkedin.com/in/zeldacole" },
      { name: "Michele Tang", avatarUrl: "/avatars/michele-tang.jpg", url: "https://www.linkedin.com/in/michele-tang/" },
      { name: "Rahul Jain", avatarUrl: "/avatars/rahul.jpg", url: "https://www.linkedin.com/in/rahulj24/" },
    ],
    techStack: "React, Next.js, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, Framer Motion, Supabase, Groq",
    caseStudyImages: [
      "/images/mizen/1477.webp",
      "/images/mizen/1476.webp",
      "/images/mizen/1482.webp",
      "/images/mizen/1479.webp",
      "/images/mizen/1475.webp",
      "/images/mizen/1474.webp",
      "/images/mizen/1481.webp",
    ],
  },
  {
    name: "Aura",
    url: "https://aurafinance.io",
    image: "/images/aura-hover.gif",
    type: "Product",
    description: "Aura is an employee financial wellness platform that helps people plan, budget, invest, prepare for retirement, and build healthier money habits through education and coaching.",
    outcome: "Designed onboarding, daily check-ins, and a new design system focused on clarity, trust, scalability, and a calmer financial experience.",
    contributors: [
      { name: "Carlo Liquido", avatarUrl: "/avatars/carlo-liquido.jpg", url: "https://www.linkedin.com/in/carloliquido" },
      { name: "Courtney Cardin", avatarUrl: "/avatars/courtney-cardin.png", url: "https://aurafinance.io/about" },
      { name: "Lizzie" },
    ],
    techStack: "Product design, web design, design systems",
    caseStudyImages: [
      "/images/aura/01.webp",
      "/images/aura/02.webp",
      "/images/aura/03.webp",
      "/images/aura/04.webp",
      "/images/aura/05.webp",
    ],
  },
  {
    name: "Kilo",
    url: "https://kilohnl.com/",
    image: "/images/kilo-hover.jpg",
    type: "Brand",
    description: "Kilo is a Honolulu work club brand for people building in Hawaiʻi, shaped around focus, hospitality, community, and a more intentional workday.",
    outcome: "Created a flexible identity direction that extends across digital, print, and physical touchpoints.",
    contributors: [
      { name: "Tremaine Tucker", url: "https://www.linkedin.com/in/tremainet" },
      { name: "Desmond Centro", url: "https://www.linkedin.com/in/desmondcentro" },
    ],
    techStack: "Brand identity, art direction, web",
    caseStudyImages: [
      "/images/piiku/01.webp",
      "/images/piiku/02.webp",
      "/images/piiku/03.webp",
      "/images/piiku/04.webp",
      "/images/piiku/05.webp",
      "/images/piiku/06.webp",
    ],
  },
  {
    name: "Umi",
    url: "https://umiapp.co/",
    image: "/images/umi-hover.gif",
    type: "Product",
    description: "Umi is a language learning app that teaches vocabulary, listening, speaking, and reading through short clips from native speakers.",
    outcome: "Reworked and shipped the core lesson experience, including video playback and vocabulary flows, with a clearer structure for learning through familiar media.",
    contributors: [
      { name: "Michelle Tran", avatarUrl: "/avatars/michelle.png", url: "https://www.linkedin.com/in/michelle-tran-a48a14203/" },
      { name: "Mele Hamasaki", avatarUrl: "/avatars/mele-hamasaki.jpg", url: "https://www.framer.com/@melehamasaki/" },
      { name: "Jason", avatarUrl: "/avatars/jason.png" },
      { name: "Stan" },
      { name: "Laurie" },
    ],
    techStack: "Product design, mobile UX, prototyping",
    caseStudyImages: [
      "/images/umi/01.webp",
      "/images/umi/02.webp",
      "/images/umi/03.webp",
      "/images/umi/04.webp",
      "/images/umi/05.webp",
    ],
  },
  {
    name: "Piʻikū",
    url: "https://piiku.co/",
    image: "/images/piiku-hover.gif",
    type: "Brand",
    description: "Piʻikū is a Hawaiʻi nonprofit helping local talent build tech careers through paid internships, workforce programs, speaker series, and community infrastructure.",
    outcome: "Expanded the brand across merch and program materials to support Piʻikū’s cross-functional, work-based internship model.",
    contributors: [
      { name: "May Sermonia", avatarUrl: "/avatars/may-sermonia.webp", url: "https://maysermonia.me/" },
      { name: "Hana Nanako", avatarUrl: "/avatars/hana-nanako.png" },
    ],
    techStack: "Brand, community, web",
    caseStudyImages: [
      "/images/kilo/01.webp",
      "/images/kilo/02.webp",
      "/images/kilo/03.webp",
      "/images/kilo/04.webp",
      "/images/kilo/05.webp",
    ],
  },
  {
    name: "Spero",
    url: "https://spero.vc/",
    image: "/images/spero-hover.gif",
    type: "Web",
    description: "Spero is a boutique venture firm website for purpose-led founders using technology to build healthier, more sustainable, and more fulfilling futures.",
    outcome: "Implemented the brand into a production-ready web experience that presents Spero’s purpose-led investment thesis and portfolio with clarity and polish.",
    contributors: [
      { name: "Hana Nanako", avatarUrl: "/avatars/hana-nanako.png" },
      { name: "Goodside Studio", avatarUrl: "/avatars/goodside-studio.png", url: "https://www.goodside.studio/" },
      { name: "Evan Nagle", avatarUrl: "/avatars/evan-nagle.png", url: "https://wordpress.stackexchange.com/users/14032/evan-nagle" },
    ],
    techStack: "Web design, content structure, frontend",
    caseStudyImages: [
      "/images/spero/01.webp",
      "/images/spero/02.webp",
      "/images/spero/03.webp",
    ],
  },
  {
    name: "MemberSpace",
    url: "https://www.memberspace.com/",
    image: "/images/memberspace-hover.gif",
    type: "Brand",
    description: "MemberSpace is membership software that helps creators and digital businesses sell memberships, courses, communities, and gated content from their own websites.",
    outcome: "Supported the team’s visual direction across brand and marketing surfaces, creating a warmer and clearer product presentation.",
    contributors: [
      { name: "May Sermonia", avatarUrl: "/avatars/may-sermonia.webp", url: "https://maysermonia.me/" },
      { name: "Marvin Russell", avatarUrl: "/avatars/marvin-russell.png", url: "https://www.memberspace.com/blog/author/marvinmemberspace-com/" },
    ],
    techStack: "Brand, marketing design, SaaS",
    caseStudyImages: [
      "/images/memberspace/01.webp",
      "/images/memberspace/02.webp",
      "/images/memberspace/03.webp",
      "/images/memberspace/04.webp",
    ],
  },
  {
    name: "Servco",
    url: "https://www.servco.com/",
    image: "/images/servco-hover.gif",
    type: "Brand",
    description: "Servco is a locally rooted, family-owned Hawaiʻi company with work spanning automotive retail and distribution, mobility, music, investment, and community initiatives.",
    outcome: "Produced design assets and digital surfaces aligned with existing brand standards, campaign needs, and Servco’s broader business ecosystem.",
    contributors: [{ name: "Daley Muller Goldenbaum", avatarUrl: "/avatars/daley-muller-goldenbaum.png" }],
    techStack: "Brand systems, campaign design, web",
    caseStudyImages: [
      "/images/servco/01.webp",
      "/images/servco/02.webp",
      "/images/servco/03.webp",
      "/images/servco/04.webp",
      "/images/servco/05.webp",
      "/images/servco/06.webp",
    ],
  },
]

const WORK_EDGE_BLEED_PX = 16

function HoverPlayMedia({ src, alt, active }: { src: string; alt: string; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0)
    }
    img.src = src
  }, [src])

  return (
    <div className="relative aspect-video w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 z-10 h-full w-full object-cover object-center transition-opacity duration-150 ${
          active ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </div>
  )
}

function DrawerPlaceholderMedia({ item, index }: { item: WorkItem; index: number }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-muted">
      <div className="aspect-[16/9] bg-muted" aria-label={`${item.name} image ${index + 1}`} />
    </div>
  )
}

function DrawerCaseStudyMedia({ src, item, index }: { src: string; item: WorkItem; index: number }) {
  return (
    <figure className="overflow-hidden rounded-3xl border border-border/60 bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${item.name} case study image ${index + 1}`}
        loading={index < 2 ? "eager" : "lazy"}
        decoding="async"
        className="aspect-video h-auto w-full object-cover object-center"
      />
    </figure>
  )
}

function ProjectDetailBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <AccordionItem
      value={title}
      className="rounded-lg border-0 bg-muted/70 px-4 text-sm transition-colors duration-150 ease hover:bg-muted"
    >
      <AccordionTrigger className="cursor-pointer py-3 text-xs font-medium tracking-normal text-black hover:no-underline">
        {title}
      </AccordionTrigger>
      <AccordionContent className="pb-3 leading-6 text-muted-foreground">{children}</AccordionContent>
    </AccordionItem>
  )
}

function contributorInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function ContributorAvatar({ contributor, className }: { contributor: Contributor; className?: string }) {
  return (
    <Avatar className={`size-8 border-2 border-card bg-muted ${className ?? ""}`}>
      {contributor.avatarUrl ? (
        <AvatarImage src={contributor.avatarUrl} alt={contributor.name} className="object-cover" />
      ) : null}
      <AvatarFallback className="text-[10px] font-medium text-muted-foreground">
        {contributorInitials(contributor.name)}
      </AvatarFallback>
    </Avatar>
  )
}

function ContributorCredit({ contributors }: { contributors: Contributor[] }) {
  const visibleContributors = contributors.slice(0, 4)
  const remainingCount = contributors.length - visibleContributors.length
  const contributorNames = contributors.map((contributor) => contributor.name).join(", ")
  const remainingNames = contributors.slice(visibleContributors.length).map((contributor) => contributor.name).join(", ")

  return (
    <div className="flex shrink-0 -space-x-2" aria-label={`Contributors: ${contributorNames}`}>
      {visibleContributors.map((contributor) => (
        <Tooltip key={contributor.name}>
          <TooltipTrigger asChild>
            {contributor.url ? (
              <a href={contributor.url} target="_blank" rel="noopener noreferrer" aria-label={contributor.name}>
                <ContributorAvatar contributor={contributor} />
              </a>
            ) : (
              <span className="inline-flex" tabIndex={0} aria-label={contributor.name}>
                <ContributorAvatar contributor={contributor} />
              </span>
            )}
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>{contributor.name}</TooltipContent>
        </Tooltip>
      ))}
      {remainingCount > 0 ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex" tabIndex={0} aria-label={remainingNames}>
              <Avatar className="size-8 border-2 border-card bg-muted">
                <AvatarFallback className="text-[10px] font-medium text-muted-foreground">+{remainingCount}</AvatarFallback>
              </Avatar>
            </span>
          </TooltipTrigger>
          <TooltipContent sideOffset={6}>{remainingNames}</TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  )
}

function ProjectDetailDrawer({
  item,
  open,
  onOpenChange,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: {
  item: WorkItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onPrevious: () => void
  onNext: () => void
  hasPrevious: boolean
  hasNext: boolean
}) {
  const wheelOverscrollDistanceRef = useRef(0)
  const touchStartYRef = useRef<number | null>(null)

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      const isEditable =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.matches("input, textarea, select"))

      if (isEditable) return

      if (event.key === "ArrowDown" && hasNext) {
        event.preventDefault()
        onNext()
      }

      if (event.key === "ArrowUp" && hasPrevious) {
        event.preventDefault()
        onPrevious()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [hasNext, hasPrevious, onNext, onPrevious, open])

  useEffect(() => {
    if (!open) {
      wheelOverscrollDistanceRef.current = 0
      touchStartYRef.current = null
    }
  }, [open])

  const closeFromTopOverscroll = () => {
    wheelOverscrollDistanceRef.current = 0
    touchStartYRef.current = null
    onOpenChange(false)
  }

  const handleScrollContainerWheel = (event: WheelEvent<HTMLDivElement>) => {
    const isAtTop = event.currentTarget.scrollTop <= 0

    if (!isAtTop || event.deltaY >= 0) {
      wheelOverscrollDistanceRef.current = 0
      return
    }

    wheelOverscrollDistanceRef.current += Math.abs(event.deltaY)

    if (wheelOverscrollDistanceRef.current >= 48) {
      event.preventDefault()
      closeFromTopOverscroll()
    }
  }

  const handleScrollContainerTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null
  }

  const handleScrollContainerTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const touchStartY = touchStartYRef.current
    const currentY = event.touches[0]?.clientY

    if (touchStartY === null || currentY === undefined || event.currentTarget.scrollTop > 0) return

    if (currentY - touchStartY >= 64) {
      closeFromTopOverscroll()
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-hidden border-border bg-card p-0 shadow-2xl [&>div:first-child]:hidden data-[vaul-drawer-direction=bottom]:inset-x-2 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mx-auto data-[vaul-drawer-direction=bottom]:max-h-[86dvh] data-[vaul-drawer-direction=bottom]:max-w-7xl data-[vaul-drawer-direction=bottom]:rounded-b-none data-[vaul-drawer-direction=bottom]:rounded-t-3xl sm:data-[vaul-drawer-direction=bottom]:inset-x-6 sm:data-[vaul-drawer-direction=bottom]:max-h-[calc(100dvh-1.5rem)]">
        <div className="absolute right-16 top-4 z-20 flex items-center gap-1 rounded-full bg-background/80 p-1 shadow-sm backdrop-blur">
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 ease hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
            aria-label="Next case study"
          >
            <ArrowDown className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 ease hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
            aria-label="Previous case study"
          >
            <ArrowUp className="size-3.5" aria-hidden="true" />
          </button>
        </div>
        <DrawerClose className="absolute right-4 top-4 z-20 inline-flex size-9 items-center justify-center rounded-full bg-background/80 text-muted-foreground shadow-sm backdrop-blur transition-colors duration-150 ease hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </DrawerClose>
        <div
          key={item.name}
          className="grid max-h-[86dvh] gap-8 overflow-y-auto p-5 [scrollbar-width:none] sm:max-h-[calc(100dvh-1.5rem)] sm:p-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-10 [&::-webkit-scrollbar]:hidden"
          onTouchMove={handleScrollContainerTouchMove}
          onTouchStart={handleScrollContainerTouchStart}
          onWheel={handleScrollContainerWheel}
        >
          <div className="order-2 space-y-5 lg:order-1">
            {item.caseStudyImages?.length
              ? item.caseStudyImages.map((src, index) => (
                  <DrawerCaseStudyMedia key={src} src={src} item={item} index={index} />
                ))
              : [0, 1, 2].map((index) => (
                  <DrawerPlaceholderMedia key={index} item={item} index={index} />
                ))}
          </div>
          <aside className="order-1 lg:sticky lg:top-8 lg:order-2 lg:h-fit">
            <div className="space-y-7 pb-3 lg:pb-0 lg:pr-2">
              <div className="space-y-3 pr-10 lg:pr-0">
                <div className="space-y-1">
                  <DrawerTitle className="text-2xl font-semibold tracking-normal text-foreground">{item.name}</DrawerTitle>
                  <h3 className="text-2xl font-normal tracking-normal text-muted-foreground">{item.type}</h3>
                </div>
                <DrawerDescription className="text-base leading-7 text-muted-foreground">{item.description}</DrawerDescription>
              </div>
              <ContributorCredit contributors={item.contributors} />
              <Accordion type="multiple" defaultValue={["Outcome"]} className="space-y-3">
                <ProjectDetailBlock title="Outcome">{item.outcome}</ProjectDetailBlock>
                <ProjectDetailBlock title="Tech stack">{item.techStack}</ProjectDetailBlock>
              </Accordion>
              <Button
                asChild
                variant="secondary"
                className="bg-muted/70 transition-colors duration-150 ease hover:bg-muted"
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  Visit project
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function WorkItemCard({ item, onOpen }: { item: WorkItem; onOpen: () => void }) {
  const [localHover, setLocalHover] = useState(false)
  const { hoveredWorkId } = useWorkHover()

  const remoteHover = hoveredWorkId === item.name
  const active = localHover || remoteHover

  return (
    <button
      id={workItemElementId(item.name)}
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setLocalHover(true)}
      onMouseLeave={() => setLocalHover(false)}
      onFocus={() => setLocalHover(true)}
      onBlur={() => setLocalHover(false)}
      className="group block w-full scroll-mt-8 cursor-pointer text-left focus-visible:outline-none"
      aria-label={`Open ${item.name} details`}
    >
      <div
        className={`overflow-hidden rounded-xl border bg-card transition-[transform,border-color,box-shadow] duration-150 ease-out group-focus-visible:ring-2 group-focus-visible:ring-ring ${
          active
            ? "-translate-y-px border-border shadow-sm"
            : "border-border/50"
        }`}
      >
        <HoverPlayMedia src={item.image} alt={item.name} active={active} />
      </div>
      <div className="mt-2 flex items-baseline gap-1.5 text-sm">
        <span className="text-muted-foreground">{item.name}</span>
        <span className="text-muted-foreground/40">{item.type}</span>
      </div>
    </button>
  )
}

export const WORK_FILTERS = ["Product", "Brand", "Web"] as const
export type WorkFilter = (typeof WORK_FILTERS)[number] | null

export function WorkFilterTabs({ active, onChange }: { active: WorkFilter; onChange: (f: WorkFilter) => void }) {
  return (
    <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
      {WORK_FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(active === f ? null : f)}
          className={`cursor-pointer text-xs transition-colors duration-150 ease sm:text-sm ${
            active === f
              ? "text-foreground"
              : "text-muted-foreground/40 hover:text-muted-foreground"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}

function WorkBleedCarousel({ items, filterKey }: { items: WorkItem[]; filterKey: string }) {
  const shouldReduceMotion = useReducedMotion()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const [bleedMetrics, setBleedMetrics] = useState({ left: 0, right: 0, width: 0 })
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const activeItem = activeIndex === null ? null : items[activeIndex]
  const hasPrevious = activeIndex !== null && activeIndex > 0
  const hasNext = activeIndex !== null && activeIndex < items.length - 1
  const railStyle = {
    "--work-start-inset": `${bleedMetrics.left}px`,
    "--work-end-inset": `${bleedMetrics.right}px`,
    "--work-edge-bleed": `${WORK_EDGE_BLEED_PX}px`,
    "--work-viewport-width": bleedMetrics.width ? `${bleedMetrics.width}px` : "100%",
    marginLeft: `-${bleedMetrics.left + WORK_EDGE_BLEED_PX}px`,
    width: bleedMetrics.width
      ? `${bleedMetrics.width + WORK_EDGE_BLEED_PX * 2}px`
      : `calc(100% + ${WORK_EDGE_BLEED_PX * 2}px)`,
  } as CSSProperties

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    const parent = wrapper?.parentElement
    if (!parent) return

    const updateInset = () => {
      const rect = parent.getBoundingClientRect()
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth

      setBleedMetrics({
        left: Math.max(0, Math.round(rect.left)),
        right: Math.max(0, Math.round(viewportWidth - rect.right)),
        width: Math.round(viewportWidth),
      })
    }

    updateInset()
    window.addEventListener("resize", updateInset)
    window.visualViewport?.addEventListener("resize", updateInset)
    window.visualViewport?.addEventListener("scroll", updateInset)

    return () => {
      window.removeEventListener("resize", updateInset)
      window.visualViewport?.removeEventListener("resize", updateInset)
      window.visualViewport?.removeEventListener("scroll", updateInset)
    }
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    requestAnimationFrame(() => {
      rail.scrollLeft = 0
    })
  }, [filterKey])

  const navigatePrevious = () => {
    setActiveIndex((current) => {
      if (current === null) return current
      return Math.max(0, current - 1)
    })
  }

  const navigateNext = () => {
    setActiveIndex((current) => {
      if (current === null) return current
      return Math.min(items.length - 1, current + 1)
    })
  }

  const openCaseStudy = (index: number) => {
    setActiveIndex(index)
    setIsDrawerOpen(true)
  }

  return (
    <>
      <div
        ref={wrapperRef}
        className="overflow-x-visible overflow-y-visible"
        style={railStyle}
      >
        <AnimatePresence mode="wait">
          <motion.div
            ref={railRef}
            key={filterKey}
            data-work-carousel-rail="true"
            className="-mt-2 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-pl-[calc(var(--work-start-inset)+var(--work-edge-bleed))] scroll-pr-[calc(var(--work-end-inset)+var(--work-edge-bleed))] pb-1 pl-[calc(var(--work-start-inset)+var(--work-edge-bleed))] pr-[calc(var(--work-end-inset)+var(--work-edge-bleed))] pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.15, ease: [0.215, 0.61, 0.355, 1] }}
          >
            {items.map((item, index) => (
              <div
                key={item.name}
                className={`shrink-0 ${index === items.length - 1 ? "snap-end" : "snap-start"}`}
                style={{ width: "min(82vw, 36rem)" }}
              >
                <WorkItemCard item={item} onOpen={() => openCaseStudy(index)} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      {activeItem ? (
        <ProjectDetailDrawer
          item={activeItem}
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          onPrevious={navigatePrevious}
          onNext={navigateNext}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      ) : null}
    </>
  )
}

export function WorkSection({ filter }: { filter: WorkFilter }) {
  const filtered = filter === null
    ? workItems
    : workItems.filter((item) => item.type === filter)

  const filterKey = filter ?? "all"

  return <WorkBleedCarousel key={filterKey} filterKey={filterKey} items={filtered} />
}
