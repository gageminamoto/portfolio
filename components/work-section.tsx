"use client"

import { useEffect, useRef, useState } from "react"

interface WorkItem {
  name: string
  url: string
  image: string
}

const workItems: WorkItem[] = [
  { name: "Aura", url: "https://aurafinance.io", image: "/images/aura-hover.gif" },
  { name: "Kilo", url: "https://kilohnl.com/", image: "/images/kilo-hover.jpg" },
  { name: "Umi", url: "https://umiapp.co/", image: "/images/umi-hover.gif" },
  { name: "Piʻiku", url: "https://piiku.co/", image: "/images/piiku-hover.gif" },
  { name: "Spero", url: "https://spero.vc/", image: "/images/spero-hover.gif" },
  { name: "MemberSpace", url: "https://www.memberspace.com/", image: "/images/memberspace-hover.gif" },
  { name: "Servco", url: "https://www.servco.com/", image: "/images/servco-hover.gif" },
]

function HoverPlayMedia({ src, alt }: { src: string; alt: string }) {
  const [hovered, setHovered] = useState(false)
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
    <div
      className="relative aspect-video w-full overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-150 ${
          hovered ? "opacity-0" : "opacity-100"
        }`}
      />
      {hovered && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      )}
    </div>
  )
}

export function WorkSection() {
  return (
    <div className="flex flex-col gap-3">
      {workItems.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-xl border border-border/50 bg-card transition-[transform,border-color,box-shadow] duration-150 ease-out hover:-translate-y-px hover:border-border hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={item.name}
        >
          <HoverPlayMedia src={item.image} alt={item.name} />
        </a>
      ))}
    </div>
  )
}
