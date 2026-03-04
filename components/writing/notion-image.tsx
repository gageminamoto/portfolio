"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import type { NotionBlock } from "@/lib/notion"
import { ImageLightbox } from "./image-lightbox"

interface NotionImageProps {
  block: NotionBlock
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

  return (
    <>
      <figure className="my-8 w-full">
        <button
          type="button"
          aria-label="Expand image"
          onClick={() => setOpen(true)}
          className="w-full cursor-zoom-in rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full rounded-lg transition-opacity duration-150 ease-out hover:opacity-90"
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
            src={src}
            alt={alt}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
