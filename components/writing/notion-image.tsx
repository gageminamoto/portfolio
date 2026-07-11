"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import type { NotionBlock } from "@/lib/notion"
import { getOptimizedImageUrl } from "@/lib/image-url"
import { OptimizedImage } from "@/components/optimized-image"
import { ImageLightbox } from "./image-lightbox"

type ImageBlock = Extract<NotionBlock, { type: "image" }>

interface NotionImageProps {
  block: ImageBlock
}

export function NotionImage({ block }: NotionImageProps) {
  const [open, setOpen] = useState(false)
  const image = block.image

  const src =
    image.type === "external" ? image.external.url : image.file.url
  const caption = image.caption
    ?.map((t: { plain_text: string }) => t.plain_text)
    .join("")
  const alt = caption || ""

  const inlineSrc = getOptimizedImageUrl(src, { width: 1200, quality: 80 })
  const lightboxSrc = getOptimizedImageUrl(src, { width: 2400, quality: 90 })

  return (
    <>
      <figure className="my-8 w-full">
        <button
          type="button"
          aria-label="Expand image"
          onClick={() => setOpen(true)}
          className="relative w-full cursor-zoom-in rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <OptimizedImage
            src={inlineSrc}
            alt={alt}
            width={1200}
            sizes="(min-width: 768px) 672px, 100vw"
            quality={80}
            loading="lazy"
            fallbackToImg
            className="w-full rounded-lg bg-transparent"
            imageClassName="h-auto w-full rounded-lg object-contain hover:opacity-90"
          />
        </button>
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-muted-foreground">
            {caption}
          </figcaption>
        )}
      </figure>

      <AnimatePresence>
        {open && (
          <ImageLightbox
            src={lightboxSrc}
            alt={alt}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
