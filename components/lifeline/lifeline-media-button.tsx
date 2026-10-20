"use client"

import { useCallback, useRef, useState } from "react"
import { Image as ImageIcon } from "lucide-react"
import { LifelineLightbox, type LifelineLightboxStart } from "./lifeline-lightbox"
import type { LifelineEventImage } from "./types"

export function LifelineMediaButton({ image }: { image: LifelineEventImage }) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const aspectRef = useRef(3 / 4)
  const [start, setStart] = useState<LifelineLightboxStart | null>(null)
  const measure = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect()
    return rect ? { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2, w: 96, h: 96 * aspectRef.current } : null
  }, [])

  function open() {
    const probe = new window.Image()
    const show = () => {
      if (probe.naturalWidth) aspectRef.current = probe.naturalHeight / probe.naturalWidth
      setStart(measure())
    }
    probe.onload = show
    probe.onerror = show
    probe.src = image.src
    if (probe.complete) show()
  }

  return (
    <>
      {" "}
      <button
        ref={buttonRef}
        type="button"
        aria-label={`View ${image.alt}`}
        aria-haspopup="dialog"
        className="relative inline-flex h-6 w-6 translate-y-1 items-center justify-center rounded text-muted-foreground after:absolute after:-inset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        onClick={open}
      >
        <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      {start && (
        <LifelineLightbox photo={image} rotate={0} start={start} getHome={measure} onClosed={() => setStart(null)} />
      )}
    </>
  )
}
