"use client"

import type { GalleryItem } from "@/components/mosaic-card"
import { MosaicCard } from "@/components/mosaic-card"

export type { GalleryItem }

export function MosaicGallery({ items }: { items: GalleryItem[] }) {
  return (
    <div className="columns-2 gap-3 [&>*]:mb-3">
      {items.map((item, index) => (
        <MosaicCard key={item.name} project={item} index={index} />
      ))}
    </div>
  )
}
