"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useGradientWord } from "@/components/gradient-word-context"
import type { LightboxRect } from "@/components/image-lightbox"

export interface GalleryItem {
  name: string
  url?: string
  description: string
  year?: number
  status?: "production" | "building"
  image?: string
  aspectRatio?: string
}

const BADGE_COLORS: Record<string, string> = {
  design: "oklch(0.55 0.2 250)",
  software: "oklch(0.55 0.2 250)",
  brands: "oklch(0.55 0.2 330)",
  tools: "oklch(0.55 0.2 145)",
}

const ASPECT_RATIOS = ["5/4", "16/9", "1/1"] as const

const ease = [0.215, 0.61, 0.355, 1] as const

interface MosaicCardProps {
  project: GalleryItem
  index?: number
  isLightboxOpen?: boolean
  onOpenLightbox?: (rect: LightboxRect) => void
}

export function MosaicCard({ project, index = 0, isLightboxOpen, onOpenLightbox }: MosaicCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)

  const [badgeTilt] = useState(() => Math.random() * 14 - 7)
  const { activeWord } = useGradientWord()

  const aspectRatio = project.aspectRatio ?? ASPECT_RATIOS[index % ASPECT_RATIOS.length]

  const openLightbox = useCallback(() => {
    if (!project.image || !cardRef.current || !onOpenLightbox) return
    const rect = cardRef.current.getBoundingClientRect()
    onOpenLightbox({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
  }, [project.image, onOpenLightbox])

  return (
    <div
      className="relative"
      style={{ aspectRatio, breakInside: "avoid" }}
    >
      {/* Badge sits outside the scaling container so it doesn't scale on hover */}
      {project.status === "building" && (
        <motion.span
          className="absolute -right-1.5 -top-1.5 z-20 cursor-default rounded-full px-2 py-0.5 text-[11px] font-medium text-white shadow-sm"
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

      <div
        className="absolute inset-0 transition-transform [transition-duration:var(--card-hover-speed,200ms)] [transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)] hover:[transform:scale(var(--card-hover-scale,0.98))]"
      >
      <div
        ref={cardRef}
        className="group absolute inset-0 overflow-hidden rounded-xl border border-border/50 bg-card transition-[background-color,border-color,box-shadow] duration-200 [transition-timing-function:cubic-bezier(0.215,0.61,0.355,1)] hover:border-border/80 hover:bg-accent/50"
        style={{ visibility: isLightboxOpen ? "hidden" : undefined }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {project.image ? (
          <div
            className="absolute inset-0 cursor-zoom-in"
            onClick={openLightbox}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 400px"
              className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              unoptimized={project.image.endsWith(".gif")}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        ) : project.url ? (
          <>
            <div className="absolute inset-0 bg-muted/30 dark:bg-white/[0.03]" />
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10 rounded-xl"
              aria-label={project.name}
              tabIndex={0}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-muted/30 dark:bg-white/[0.03]" />
        )}

        {/* Bottom content tray — slides up from below on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-x-0 bottom-0 z-[5] flex flex-col rounded-b-[11px] bg-card/90 backdrop-blur-sm dark:bg-card/80"
            initial={{ transform: "translateY(100%)" }}
            animate={{ transform: "translateY(0%)" }}
            exit={{ transform: "translateY(100%)" }}
            transition={{ duration: 0.3, ease }}
          >
            {/* Name + year bar */}
            <div className="flex w-full items-center justify-between px-3.5 py-2.5">
              <span className="text-[13px] font-semibold text-foreground">{project.name}</span>
              {project.year && (
                <span className="font-mono text-[11px] text-muted-foreground/50">{project.year}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      </div>
    </div>
  )
}
