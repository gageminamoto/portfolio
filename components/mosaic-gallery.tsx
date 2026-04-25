"use client"

import { useCallback, useMemo, useState } from "react"
import { AnimatePresence } from "framer-motion"
import type { GalleryItem } from "@/components/mosaic-card"
import { MosaicCard } from "@/components/mosaic-card"
import { ImageLightbox, type LightboxRect, type LightboxItem } from "@/components/image-lightbox"

export type { GalleryItem }

interface LightboxState {
  index: number
  rect: LightboxRect
}

const BORDER_RADIUS = 12

export function MosaicGallery({ items }: { items: GalleryItem[] }) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  // Only items with images can appear in the lightbox
  const lightboxItems: LightboxItem[] = useMemo(
    () =>
      items
        .filter((item): item is GalleryItem & { image: string } => !!item.image)
        .map((item, i) => ({ src: item.image, alt: item.name, url: item.url, aspectRatio: item.aspectRatio ?? ["5/4", "16/9", "1/1"][i % 3] })),
    [items],
  )

  // Map from gallery index to lightbox index (only image items)
  const galleryToLightboxIndex = useMemo(() => {
    const map = new Map<number, number>()
    let lbIdx = 0
    for (let i = 0; i < items.length; i++) {
      if (items[i].image) {
        map.set(i, lbIdx++)
      }
    }
    return map
  }, [items])

  const openLightbox = useCallback(
    (galleryIndex: number, rect: LightboxRect) => {
      const lbIndex = galleryToLightboxIndex.get(galleryIndex)
      if (lbIndex == null) return
      setLightbox({ index: lbIndex, rect })
    },
    [galleryToLightboxIndex],
  )

  const closeLightbox = useCallback(() => setLightbox(null), [])

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 [&>*]:mb-3">
        {items.map((item, index) => (
          <MosaicCard
            key={item.name}
            project={item}
            index={index}
            isLightboxOpen={lightbox !== null && galleryToLightboxIndex.get(index) === lightbox.index}
            onOpenLightbox={(rect) => openLightbox(index, rect)}
          />
        ))}
      </div>

      <AnimatePresence>
        {lightbox && lightboxItems.length > 0 && (
          <ImageLightbox
            items={lightboxItems}
            activeIndex={lightbox.index}
            rect={lightbox.rect}
            borderRadius={BORDER_RADIUS}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </>
  )
}
