"use client"

import { type CSSProperties, type MouseEvent, type ReactNode, type TouchEvent, type UIEvent, type WheelEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowUp, ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useDialKit } from "dialkit"
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
import { caseStudySlug } from "@/lib/utils"

interface WorkItem {
  name: string
  url: string
  image: string
  type: string
  description: string
  outcome: string
  contributors: Contributor[]
  techStack: string
  caseStudyImages?: CaseStudyMedia[]
}

interface Contributor {
  name: string
  avatarUrl?: string
  url?: string
}

type CaseStudyImageAspectRatio = "video" | "square"

type CaseStudyImage = string | {
  src: string
  aspectRatio?: CaseStudyImageAspectRatio
}

type CaseStudyMedia = CaseStudyImage | {
  layout: "two-up"
  images: [CaseStudyImage, CaseStudyImage]
}

const workItems: WorkItem[] = [
  {
    name: "Mizen",
    url: "https://www.mizen.recipes/",
    image: "/images/mizen-hover.gif",
    type: "Product",
    description: "Mizen is a calm recipe workspace for saving recipes from the web, organizing what to cook, and making home cooking feel clearer and less hectic.",
    outcome: "This side project was entirely my own, from front-end to back-end, marketing, and roadmap definition. I managed design and engineering, set the visual branding direction, and mapped out features.",
    contributors: [
      { name: "Gage Minamoto", avatarUrl: "/avatars/gage.png", url: "https://linkedin.com/in/gageminamoto" },
      { name: "Michelle Tran", avatarUrl: "/avatars/michelle.png", url: "https://www.linkedin.com/in/michelle-tran-a48a14203/" },
      { name: "William Liang", avatarUrl: "/avatars/william.jpg", url: "https://www.linkedin.com/in/william-liang808/" },
      { name: "Zelda Cole", avatarUrl: "/avatars/zelda.jpg", url: "https://www.linkedin.com/in/zeldacole" },
      { name: "Michele Tang", avatarUrl: "/avatars/michele-tang.jpg", url: "https://www.linkedin.com/in/michele-tang/" },
      { name: "Rahul Jain", avatarUrl: "/avatars/rahul.jpg", url: "https://www.linkedin.com/in/rahulj24/" },
    ],
    techStack: "React 19, Next.js 16, TypeScript, Tailwind CSS, ESLint 9, Prettier, Vercel",
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
    outcome: "Built on an existing brand identity and expanded it in anticipation of Kilo's grand opening. I explored digital and physical expressions across web and brand touchpoints.",
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
      {
        layout: "two-up",
        images: [
          { src: "/images/umi/04.webp", aspectRatio: "square" },
          { src: "/images/umi/05.webp", aspectRatio: "square" },
        ],
      },
    ],
  },
  {
    name: "Piʻikū",
    url: "https://piiku.co/",
    image: "/images/piiku-hover.gif",
    type: "Brand",
    description: "Piʻikū is a Hawaiʻi nonprofit helping local talent build tech careers through paid internships, workforce programs, speaker series, and community infrastructure.",
    outcome: "Expanded the brand across merch and program materials to support Piʻikū’s cross-functional, work-based internship model.",
    contributors: [],
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
    outcome: "Collaborated with Mei on an early visual brand refresh while focusing on MemberSpace's brand voice, brand heart, messaging pillars, and value proposition. The work helped guide the brand into its next era while respecting its foundation and giving it a clearer position in a crowded space.",
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
const CASE_STUDY_HASH_PREFIX = "#work/"
const caseStudyMediaAspectRatioClasses: Record<CaseStudyImageAspectRatio, string> = {
  video: "aspect-video",
  square: "aspect-square",
}

function caseStudyHref(item: WorkItem) {
  return `/#work/${caseStudySlug(item.name)}`
}

function caseStudySlugFromHash(hash: string) {
  if (!hash.startsWith(CASE_STUDY_HASH_PREFIX)) return null

  const rawSlug = hash.slice(CASE_STUDY_HASH_PREFIX.length)
  if (!rawSlug) return null

  try {
    return decodeURIComponent(rawSlug)
  } catch {
    return rawSlug
  }
}

function pushCaseStudyHash(slug: string) {
  const url = new URL(window.location.href)
  url.hash = `work/${slug}`
  window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`)
}

function removeCaseStudyHash() {
  if (!caseStudySlugFromHash(window.location.hash)) return

  const url = new URL(window.location.href)
  url.hash = ""
  window.history.pushState(null, "", `${url.pathname}${url.search}`)
}

function projectUrlLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "")
  }
}

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
        draggable={false}
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

function getCaseStudyImageSrc(image: CaseStudyImage) {
  return typeof image === "string" ? image : image.src
}

function getCaseStudyImageAspectRatio(image: CaseStudyImage): CaseStudyImageAspectRatio {
  return typeof image === "string" ? "video" : image.aspectRatio ?? "video"
}

function isCaseStudyMediaRow(media: CaseStudyMedia): media is Extract<CaseStudyMedia, { layout: "two-up" }> {
  return typeof media === "object" && "layout" in media
}

function getCaseStudyMediaKey(media: CaseStudyMedia) {
  return isCaseStudyMediaRow(media)
    ? media.images.map(getCaseStudyImageSrc).join("|")
    : getCaseStudyImageSrc(media)
}

function getCaseStudyMediaImageCount(media: CaseStudyMedia) {
  return isCaseStudyMediaRow(media) ? media.images.length : 1
}

function DrawerCaseStudyMedia({ image, item, index }: { image: CaseStudyImage; item: WorkItem; index: number }) {
  const src = getCaseStudyImageSrc(image)
  const aspectRatio = getCaseStudyImageAspectRatio(image)

  return (
    <figure className="overflow-hidden rounded-3xl border border-border/60 bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${item.name} case study image ${index + 1}`}
        loading={index < 2 ? "eager" : "lazy"}
        decoding="async"
        className={`${caseStudyMediaAspectRatioClasses[aspectRatio]} h-auto w-full object-cover object-center`}
      />
    </figure>
  )
}

function DrawerCaseStudyMediaGroup({ media, item, index }: { media: CaseStudyMedia; item: WorkItem; index: number }) {
  if (isCaseStudyMediaRow(media)) {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        {media.images.map((image, imageIndex) => (
          <DrawerCaseStudyMedia
            key={getCaseStudyImageSrc(image)}
            image={image}
            item={item}
            index={index + imageIndex}
          />
        ))}
      </div>
    )
  }

  return <DrawerCaseStudyMedia image={media} item={item} index={index} />
}

function ProjectDetailBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <AccordionItem
      value={title}
      className="rounded-lg border-0 bg-muted/70 px-4 text-sm transition-colors duration-150 ease hover:bg-muted"
    >
      <AccordionTrigger className="cursor-pointer py-3 text-sm font-semibold tracking-normal text-foreground hover:no-underline">
        {title}
      </AccordionTrigger>
      <AccordionContent className="pb-3 leading-6 text-muted-foreground">{children}</AccordionContent>
    </AccordionItem>
  )
}

function TechStackList({ techStack }: { techStack: string }) {
  const toSentenceCase = (item: string) => {
    const [firstWord, ...restWords] = item.split(" ")
    const sentenceStart = firstWord.charAt(0).toUpperCase() + firstWord.slice(1)
    const rest = restWords.map((word) => {
      const hasBrandCasing = /[A-Z]/.test(word.slice(1)) || /[./]/.test(word)

      return hasBrandCasing ? word : word.toLowerCase()
    })

    return [sentenceStart, ...rest].join(" ")
  }

  const items = techStack
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map(toSentenceCase)

  return (
    <ul className="list-disc space-y-1 pl-4">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
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

function ProjectDetails({ item }: { item: WorkItem }) {
  return (
    <div className="space-y-7">
      {item.contributors.length > 0 ? <ContributorCredit contributors={item.contributors} /> : null}
      <Accordion type="multiple" defaultValue={["Outcome"]} className="space-y-3">
        <ProjectDetailBlock title="Outcome">{item.outcome}</ProjectDetailBlock>
        <ProjectDetailBlock title="Stack">
          <TechStackList techStack={item.techStack} />
        </ProjectDetailBlock>
      </Accordion>
      <Button
        asChild
        className="bg-foreground text-background transition-colors duration-150 ease hover:bg-foreground/90 hover:text-background"
      >
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {projectUrlLabel(item.url)}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      </Button>
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

  let caseStudyImageIndex = 0

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
        <DrawerClose className="absolute right-4 top-4 z-20 inline-flex size-9 cursor-pointer items-center justify-center rounded-full bg-background/80 text-muted-foreground shadow-sm backdrop-blur transition-colors duration-150 ease hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </DrawerClose>
        <div
          key={item.name}
          className="grid max-h-[86dvh] gap-5 overflow-y-auto scroll-fade-y scroll-fade-12 p-5 [scrollbar-width:none] sm:max-h-[calc(100dvh-1.5rem)] sm:p-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-10 [&::-webkit-scrollbar]:hidden"
          onTouchMove={handleScrollContainerTouchMove}
          onTouchStart={handleScrollContainerTouchStart}
          onWheel={handleScrollContainerWheel}
        >
          <div className="order-2 space-y-5 lg:order-1">
            {item.caseStudyImages?.length
              ? item.caseStudyImages.map((media) => {
                  const index = caseStudyImageIndex
                  caseStudyImageIndex += getCaseStudyMediaImageCount(media)

                  return (
                    <DrawerCaseStudyMediaGroup
                      key={getCaseStudyMediaKey(media)}
                      media={media}
                      item={item}
                      index={index}
                    />
                  )
                })
              : [0, 1, 2].map((index) => (
                  <DrawerPlaceholderMedia key={index} item={item} index={index} />
                ))}
            <div className="pt-2 lg:hidden">
              <ProjectDetails item={item} />
            </div>
          </div>
          <aside className="order-1 lg:sticky lg:top-8 lg:order-2 lg:h-fit">
            <div className="space-y-7 lg:pr-2">
              <div className="space-y-3 pr-10 lg:pr-0">
                <div className="space-y-1">
                  <DrawerTitle className="text-2xl font-semibold tracking-normal text-foreground">{item.name}</DrawerTitle>
                  <h3 className="text-2xl font-normal tracking-normal text-muted-foreground">{item.type}</h3>
                </div>
                <DrawerDescription className="text-base leading-7 text-muted-foreground">{item.description}</DrawerDescription>
              </div>
              <div className="hidden lg:block">
                <ProjectDetails item={item} />
              </div>
            </div>
          </aside>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function WorkItemCard({
  item,
  onOpen,
  featured = false,
  showDescription = false,
}: {
  item: WorkItem
  onOpen: () => void
  featured?: boolean
  showDescription?: boolean
}) {
  const [localHover, setLocalHover] = useState(false)
  const { hoveredWorkId } = useWorkHover()

  const remoteHover = hoveredWorkId === item.name
  const active = localHover || remoteHover
  const href = caseStudyHref(item)

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return

    event.preventDefault()
    onOpen()
  }

  return (
    <a
      id={workItemElementId(item.name)}
      href={href}
      draggable={false}
      onClick={handleClick}
      onMouseEnter={() => setLocalHover(true)}
      onMouseLeave={() => setLocalHover(false)}
      onFocus={() => setLocalHover(true)}
      onBlur={() => setLocalHover(false)}
      className="group block w-full scroll-mt-8 cursor-pointer text-left focus-visible:outline-none"
      aria-label={`Open ${item.name} details`}
    >
      <div
        className={`relative overflow-hidden rounded-xl border bg-card transition-[transform,border-color,box-shadow] duration-150 ease-out group-focus-visible:ring-2 group-focus-visible:ring-ring ${
          active
            ? "-translate-y-px border-border shadow-sm"
            : "border-border/50"
        }`}
      >
        <HoverPlayMedia src={item.image} alt={item.name} active={active} />
        <span
          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full bg-background/85 text-foreground opacity-80 shadow-sm backdrop-blur transition-[opacity,transform] duration-150 ease-out group-hover:scale-105 group-hover:opacity-100 group-focus-visible:scale-105 group-focus-visible:opacity-100"
          aria-hidden="true"
        >
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
      <div className={`mt-2 flex items-baseline gap-1.5 text-sm ${featured ? "sm:text-base" : ""}`}>
        <span className="text-muted-foreground">{item.name}</span>
        <span className="text-muted-foreground/40">{item.type}</span>
      </div>
      {showDescription ? (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {item.description}
        </p>
      ) : null}
    </a>
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

type WorkLayoutMode = "arrows" | "grid" | "hybrid" | "wheel" | "featured"

const WORK_LAYOUT_MODES = ["arrows", "grid", "hybrid", "wheel", "featured"] as const

function isWorkLayoutMode(value: string): value is WorkLayoutMode {
  return WORK_LAYOUT_MODES.includes(value as WorkLayoutMode)
}

function CarouselArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "previous" | "next"
  disabled: boolean
  onClick: () => void
}) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-muted/55 text-muted-foreground transition-colors duration-150 ease hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-muted/55 disabled:hover:text-muted-foreground"
      aria-label={direction === "previous" ? "Previous work item" : "Next work item"}
    >
      <Icon className="size-4" strokeWidth={2.25} aria-hidden="true" />
    </button>
  )
}

function WorkCarouselControls({
  index,
  count,
  onPrevious,
  onNext,
  onSelect,
}: {
  index: number
  count: number
  onPrevious: () => void
  onNext: () => void
  onSelect: (index: number) => void
}) {
  return (
    <div className="mt-3 flex w-full items-center justify-start gap-3">
      <CarouselArrowButton direction="previous" disabled={index <= 0} onClick={onPrevious} />
      <div className="flex items-center gap-3" aria-label="Work carousel position">
        {Array.from({ length: count }).map((_, dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            onClick={() => onSelect(dotIndex)}
            className={`size-2 cursor-pointer rounded-full transition-colors duration-150 ease focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              dotIndex === index ? "bg-foreground" : "bg-muted-foreground/18 hover:bg-muted-foreground/35"
            }`}
            aria-label={`Show work item ${dotIndex + 1}`}
            aria-current={dotIndex === index ? "true" : undefined}
          />
        ))}
      </div>
      <CarouselArrowButton direction="next" disabled={index >= count - 1} onClick={onNext} />
    </div>
  )
}

function WorkProgress({ index, count }: { index: number; count: number }) {
  const progress = count > 0 ? ((index + 1) / count) * 100 : 0

  return (
    <div className="mt-3 flex w-full items-center justify-start gap-3">
      <div className="h-px w-28 overflow-hidden bg-border/70" aria-hidden="true">
        <div className="h-full bg-foreground transition-[width] duration-200 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

function WorkBrowser({
  items,
  filterKey,
  mode,
}: {
  items: WorkItem[]
  filterKey: string
  mode: WorkLayoutMode
}) {
  const shouldReduceMotion = useReducedMotion()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const scrollUpdateFrameRef = useRef<number | null>(null)
  const itemSlugs = useMemo(() => items.map((item) => caseStudySlug(item.name)), [items])
  const [bleedMetrics, setBleedMetrics] = useState({ left: 0, right: 0, width: 0 })
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const activeItem = activeIndex === null ? null : items[activeIndex]
  const hasPrevious = activeIndex !== null && activeIndex > 0
  const hasNext = activeIndex !== null && activeIndex < items.length - 1
  const featuredSafeIndex = Math.min(featuredIndex, Math.max(0, items.length - 1))
  const featuredItem = items[featuredSafeIndex]
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
      setCarouselIndex(0)
    })
  }, [filterKey, mode])

  useEffect(() => {
    return () => {
      if (scrollUpdateFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollUpdateFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const syncDrawerWithHash = () => {
      const slug = caseStudySlugFromHash(window.location.hash)

      if (!slug) {
        setIsDrawerOpen(false)
        return
      }

      const nextIndex = itemSlugs.indexOf(slug)

      if (nextIndex === -1) {
        setIsDrawerOpen(false)
        return
      }

      setActiveIndex(nextIndex)
      setIsDrawerOpen(true)
    }

    syncDrawerWithHash()
    window.addEventListener("hashchange", syncDrawerWithHash)
    window.addEventListener("popstate", syncDrawerWithHash)

    return () => {
      window.removeEventListener("hashchange", syncDrawerWithHash)
      window.removeEventListener("popstate", syncDrawerWithHash)
    }
  }, [itemSlugs])

  const navigatePrevious = () => {
    if (activeIndex === null) return

    const nextIndex = Math.max(0, activeIndex - 1)
    setActiveIndex(nextIndex)
    pushCaseStudyHash(itemSlugs[nextIndex])
  }

  const navigateNext = () => {
    if (activeIndex === null) return

    const nextIndex = Math.min(items.length - 1, activeIndex + 1)
    setActiveIndex(nextIndex)
    pushCaseStudyHash(itemSlugs[nextIndex])
  }

  const openCaseStudy = (index: number) => {
    setActiveIndex(index)
    setIsDrawerOpen(true)
    pushCaseStudyHash(itemSlugs[index])
  }

  const handleDrawerOpenChange = (open: boolean) => {
    setIsDrawerOpen(open)

    if (!open) {
      removeCaseStudyHash()
    }
  }

  const getNearestCarouselIndex = (rail: HTMLDivElement) => {
    const children = Array.from(rail.children) as HTMLElement[]
    const firstOffset = children[0]?.offsetLeft ?? 0
    const maxScrollLeft = rail.scrollWidth - rail.clientWidth
    let nearestIndex = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    children.forEach((child, index) => {
      const snapPosition = index === children.length - 1
        ? maxScrollLeft
        : child.offsetLeft - firstOffset
      const distance = Math.abs(rail.scrollLeft - snapPosition)

      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })

    return nearestIndex
  }

  const updateCarouselIndex = (rail: HTMLDivElement) => {
    if (scrollUpdateFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollUpdateFrameRef.current)
    }

    scrollUpdateFrameRef.current = window.requestAnimationFrame(() => {
      setCarouselIndex(getNearestCarouselIndex(rail))
      scrollUpdateFrameRef.current = null
    })
  }

  const scrollToCarouselIndex = (nextIndex: number) => {
    const rail = railRef.current
    if (!rail) return

    const clampedIndex = Math.min(Math.max(nextIndex, 0), items.length - 1)
    const firstChild = rail.children[0] as HTMLElement | undefined
    const child = rail.children[clampedIndex] as HTMLElement | undefined
    if (!firstChild || !child) return

    const maxScrollLeft = rail.scrollWidth - rail.clientWidth
    const left = clampedIndex === items.length - 1
      ? maxScrollLeft
      : child.offsetLeft - firstChild.offsetLeft

    rail.scrollTo({
      left,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    })
    setCarouselIndex(clampedIndex)
  }

  const handleRailScroll = (event: UIEvent<HTMLDivElement>) => {
    updateCarouselIndex(event.currentTarget)
  }

  const handleRailWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (mode !== "wheel" || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

    event.preventDefault()
    event.currentTarget.scrollLeft += event.deltaY
    updateCarouselIndex(event.currentTarget)
  }

  const carouselControls = mode === "wheel"
    ? <WorkProgress index={carouselIndex} count={items.length} />
    : (
        <WorkCarouselControls
          index={carouselIndex}
          count={items.length}
          onPrevious={() => scrollToCarouselIndex(carouselIndex - 1)}
          onNext={() => scrollToCarouselIndex(carouselIndex + 1)}
          onSelect={scrollToCarouselIndex}
        />
      )

  const drawer = activeItem ? (
    <ProjectDetailDrawer
      item={activeItem}
      open={isDrawerOpen}
      onOpenChange={handleDrawerOpenChange}
      onPrevious={navigatePrevious}
      onNext={navigateNext}
      hasPrevious={hasPrevious}
      hasNext={hasNext}
    />
  ) : null

  if (mode === "grid") {
    return (
      <>
        <div className="-mt-2 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-1 pt-2 [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible [&::-webkit-scrollbar]:hidden">
          {items.map((item, index) => (
            <div key={item.name} className="w-[82vw] shrink-0 snap-start md:w-auto">
              <WorkItemCard item={item} onOpen={() => openCaseStudy(index)} />
            </div>
          ))}
        </div>
        {drawer}
      </>
    )
  }

  if (mode === "featured" && featuredItem) {
    return (
      <>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <WorkItemCard
            item={featuredItem}
            onOpen={() => openCaseStudy(featuredSafeIndex)}
            featured
            showDescription
          />
          <div className="flex flex-col border-y border-border/60 lg:border-y-0 lg:border-l lg:pl-4">
            {items.map((item, index) => {
              const selected = index === featuredIndex

              return (
                <button
                  key={item.name}
                  type="button"
                  onMouseEnter={() => setFeaturedIndex(index)}
                  onFocus={() => setFeaturedIndex(index)}
                  onClick={() => openCaseStudy(index)}
                  className={`flex cursor-pointer items-center justify-between gap-3 border-b border-border/60 py-3 text-left text-sm transition-colors duration-150 ease last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={`Open ${item.name} details`}
                >
                  <span className="min-w-0">
                    <span className="block truncate">{item.name}</span>
                    <span className="block text-xs text-muted-foreground/45">{item.type}</span>
                  </span>
                  <ArrowUpRight className={`size-3.5 shrink-0 transition-opacity duration-150 ${selected ? "opacity-100" : "opacity-35"}`} aria-hidden="true" />
                </button>
              )
            })}
          </div>
        </div>
        {drawer}
      </>
    )
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
            onScroll={handleRailScroll}
            onWheel={handleRailWheel}
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
      {carouselControls}
      {drawer}
    </>
  )
}

export function WorkSection({ filter }: { filter: WorkFilter }) {
  const layoutDial = useDialKit("Work layout", {
    mode: {
      type: "select",
      default: "arrows",
      options: [
        { value: "arrows", label: "Arrows" },
        { value: "grid", label: "Grid" },
        { value: "hybrid", label: "Hybrid" },
        { value: "wheel", label: "Wheel" },
        { value: "featured", label: "Featured" },
      ],
    },
  }, {
    id: "work-layout",
    persist: true,
  })
  const filtered = filter === null
    ? workItems
    : workItems.filter((item) => item.type === filter)

  const filterKey = filter ?? "all"
  const mode = isWorkLayoutMode(layoutDial.mode) ? layoutDial.mode : "arrows"

  return <WorkBrowser key={`${filterKey}-${mode}`} filterKey={filterKey} items={filtered} mode={mode} />
}
