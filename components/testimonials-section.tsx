"use client"

import { Dithering } from "@paper-design/shaders-react"
import { ChatRound } from "@solar-icons/react"

const testimonials = [
  {
    quote:
      "Gage is an incredibly thoughtful designer with a strong work ethic and drive.",
    name: "Michelle Tran",
    role: "Product Designer",
    speed: 0.18,
    size: 3,
    scale: 1.2,
    type: "2x2" as const,
    bg: "#9ABCFE",
    dither: "#BFC6FA",
    darkBg: "#2A3A5E",
    darkDither: "#3A4A7A",
  },
  {
    quote:
      "His passion for design and systems shone through in everything he did.",
    name: "Daley Muller Goldenblum",
    role: "Sr. Graphic Designer",
    speed: 0.1,
    size: 8,
    scale: 1.4,
    type: "2x2" as const,
    bg: "#7DFCB6",
    dither: "#D3FC79",
    darkBg: "#1A3D2E",
    darkDither: "#2A5E3A",
  },
  {
    quote:
      "He has always stood out among his peers for his work ethic.",
    name: "Nyle Sky Kauweoa, Ph.D.",
    role: "Faculty Researcher, UH",
    speed: 0.26,
    size: 2,
    scale: 0.5,
    type: "4x4" as const,
    bg: "#ED57A3",
    dither: "#FF89BE",
    darkBg: "#5E1A3A",
    darkDither: "#7A2A4E",
  },
]

export function TestimonialsSection() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <ChatRound size={14} weight="Bold" className="fill-current" />
        Testimonials
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl p-5 sm:aspect-[368/420]"
          >
            {/* Colored background – always rendered, revealed on hover */}
            <Dithering
              speed={t.speed}
              shape="wave"
              type={t.type}
              size={t.size}
              scale={t.scale}
              colorBack="#00000000"
              colorFront={t.dither}
              className="absolute inset-0 rounded-2xl dark:hidden"
              style={{ backgroundColor: t.bg }}
            />
            <Dithering
              speed={t.speed}
              shape="wave"
              type={t.type}
              size={t.size}
              scale={t.scale}
              colorBack="#00000000"
              colorFront={t.darkDither}
              className="absolute inset-0 hidden rounded-2xl dark:block"
              style={{ backgroundColor: t.darkBg }}
            />
            {/* Gray overlay – fades out on hover to reveal color */}
            <Dithering
              speed={t.speed}
              shape="wave"
              type={t.type}
              size={t.size}
              scale={t.scale}
              colorBack="#00000000"
              colorFront="#FFFFFF"
              className="absolute inset-0 rounded-2xl transition-opacity duration-500 ease-out group-hover:opacity-0 dark:hidden"
              style={{ backgroundColor: "oklch(0.945 0.005 197.066)" }}
            />
            <Dithering
              speed={t.speed}
              shape="wave"
              type={t.type}
              size={t.size}
              scale={t.scale}
              colorBack="#00000000"
              colorFront="#52525B"
              className="absolute inset-0 hidden rounded-2xl transition-opacity duration-500 ease-out group-hover:opacity-0 dark:block"
              style={{ backgroundColor: "#27272A" }}
            />
            <p className="relative z-10 text-pretty text-base/[1.5] font-medium tracking-[-0.01em] text-[#0A0A0A] dark:text-[#F0F0F0]">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="relative z-10 flex items-center gap-3 pt-6">
              <Dithering
                speed={1}
                shape="sphere"
                type="4x4"
                size={2}
                scale={0.63}
                colorBack="#00000000"
                colorFront={t.dither}
                className="size-9 shrink-0 rounded-full bg-black grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs/4 font-medium text-[#0A0A0A] dark:text-[#F0F0F0]">
                  {t.name}
                </span>
                <span className="text-pretty text-[11px]/4 text-[#4A4A4A99] dark:text-[#AAAAAA99]">
                  {t.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
