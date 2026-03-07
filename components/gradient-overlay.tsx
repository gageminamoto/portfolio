"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useDialKit } from "dialkit"
import { useGradientWord } from "@/components/gradient-word-context"

const GRADIENT_CONFIG = {
  software:    { hue: 250, lightL: 0.95, darkL: 0.20 },
  experiences: { hue: 330, lightL: 0.95, darkL: 0.20 },
  tools:       { hue: 145, lightL: 0.95, darkL: 0.20 },
} as const

type GradientWord = keyof typeof GRADIENT_CONFIG

export function GradientOverlay() {
  const { activeWord, shaderEnabled } = useGradientWord()
  const { resolvedTheme } = useTheme()
  const prefersReducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  const p = useDialKit("Gradient Overlay", {
    opacity: [0.73, 0, 1],
    saturation: [0.05, 0, 0.1],
    width: [74, 20, 100],
    height: [35, 20, 100],
    duration: [0.5, 0.1, 2],
    noiseOpacity: [0.08, 0, 0.5],
    noiseFrequency: [1.3, 0.1, 3],
    noiseScale: [212, 32, 512],
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <AnimatePresence>
      {shaderEnabled && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-0"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: p.opacity }}
          exit={{ opacity: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : p.duration,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {/* Noise dither layer to break up gradient banding */}
          <div
            className="absolute inset-0 mix-blend-overlay"
            style={{
              opacity: p.noiseOpacity,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${p.noiseFrequency}' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: `${p.noiseScale}px ${p.noiseScale}px`,
            }}
          />
          {(Object.keys(GRADIENT_CONFIG) as GradientWord[]).map((word) => {
            const { hue, lightL, darkL } = GRADIENT_CONFIG[word]
            const l = isDark ? darkL : lightL
            const color = `oklch(${l} ${p.saturation} ${hue})`
            const isActive = activeWord === word

            return (
              <motion.div
                key={word}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : p.duration,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  background: `radial-gradient(ellipse ${p.width}% ${p.height}% at 50% 0%, ${color} 0%, color-mix(in oklch, ${color} 70%, transparent) 25%, color-mix(in oklch, ${color} 35%, transparent) 50%, color-mix(in oklch, ${color} 10%, transparent) 75%, transparent 100%)`,
                }}
              />
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
