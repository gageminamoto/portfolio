"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { fadeUp, noMotion, stagger } from "@/lib/animations"

export function ArticleUnavailable({ timedOut = false }: { timedOut?: boolean }) {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp

  return (
    <motion.main
      id="main-content"
      className="mx-auto max-w-xl px-6 py-16 md:py-24"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight">
          {timedOut ? "Article is taking too long to load" : "Article unavailable"}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {timedOut
            ? "Please try again in a moment."
            : "The article could not be loaded. Please try again shortly."}
        </p>
        <Link href="/writing" className="mt-6 inline-block text-sm text-muted-foreground underline decoration-dashed decoration-2 underline-offset-4 hover:text-foreground">
          Back to writing
        </Link>
      </motion.div>
    </motion.main>
  )
}
