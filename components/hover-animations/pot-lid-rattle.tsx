"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const steamPuffs = [
  { x: [-2, -6, -3], delay: 0 },
  { x: [3, 7, 4], delay: 0.2 },
  { x: [-4, 2, -1], delay: 0.4 },
  { x: [1, -3, 2], delay: 0.6 },
  { x: [5, 1, 4], delay: 0.8 },
]

export function PotLidRattleAnimation({
  isHovered,
  children,
}: {
  isHovered: boolean
  children: React.ReactNode
}) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      <motion.div
        animate={
          isHovered
            ? { rotate: [0, -3, 3, -2, 2, -1, 1, 0] }
            : { rotate: 0 }
        }
        transition={
          isHovered
            ? { repeat: Infinity, duration: 0.5, ease: "easeInOut" }
            : { type: "spring", stiffness: 300, damping: 20 }
        }
      >
        {children}
      </motion.div>
      <AnimatePresence>
        {isHovered &&
          steamPuffs.map((puff, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-0 size-2 rounded-full bg-muted-foreground/20 blur-sm"
              initial={{ y: 0, x: 0, opacity: 0, scale: 0.3 }}
              animate={{
                y: [0, -20, -40],
                x: puff.x,
                opacity: [0, 0.5, 0],
                scale: [0.3, 0.8, 0.4],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: puff.delay,
                ease: "easeOut",
              }}
            />
          ))}
      </AnimatePresence>
    </div>
  )
}
