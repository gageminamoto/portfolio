"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useTheme } from "next-themes"
import { GrainGradient } from "@paper-design/shaders-react"
import { useGradientWord } from "@/components/gradient-word-context"
import { useMounted } from "@/hooks/use-mounted"

const GRADIENT_COLORS: Record<string, string> = {
  software: "#C7E9FA",
  brands: "#F5C7E9",
  play: "#C7FAD8",
}

const GRADIENT_COLORS_DARK: Record<string, string> = {
  software: "#1A3A4A",
  brands: "#4A1A3A",
  play: "#1A4A2A",
}

export function GradientOverlay() {
  const { activeWord, shaderEnabled } = useGradientWord()
  const { resolvedTheme } = useTheme()
  const prefersReducedMotion = useReducedMotion()
  const mounted = useMounted()

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"
  const colorMap = isDark ? GRADIENT_COLORS_DARK : GRADIENT_COLORS
  const color = colorMap[activeWord]
  const showShader = shaderEnabled && !!color

  return (
    <AnimatePresence>
      {showShader && (
        <motion.div
          key="grain-gradient"
          className="pointer-events-none absolute inset-x-0 top-0 h-screen -z-10 [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <GrainGradient
            speed={prefersReducedMotion ? 0 : 1.24}
            scale={1.71}
            rotation={92}
            offsetX={0}
            offsetY={0}
            softness={0.33}
            intensity={isDark ? 0.1 : 0.15}
            noise={0.35}
            shape="blob"
            colors={[color]}
            colorBack="#00000000"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
