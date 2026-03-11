"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import type { NotionBlock } from "@/lib/notion"
import { getOptimizedImageUrl } from "@/lib/image-url"
import { Skeleton } from "@/components/ui/skeleton"
import { ImageLightbox } from "./image-lightbox"

type ImageBlock = Extract<NotionBlock, { type: "image" }>

interface NotionImageProps {
  block: ImageBlock
}

export function NotionImage({ block }: NotionImageProps) {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
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
          {!loaded && (
            <Skeleton className="aspect-video w-full rounded-lg" />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={inlineSrc}
            alt={alt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`w-full rounded-lg transition-opacity duration-300 ease-out hover:opacity-90 ${
              loaded ? "opacity-100" : "absolute inset-0 opacity-0"
            }`}
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
