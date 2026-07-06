"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { ExperimentsSection } from "@/components/experiments-section"
import { SiteFooter } from "@/components/site-footer"
import { fadeUp, noMotion, stagger } from "@/lib/animations"

export default function PlayPage() {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp

  return (
    <motion.main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      <motion.header variants={item}>
        <Link
          href="/"
          className="group inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ChevronLeft className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:-translate-x-0.5" aria-hidden="true" />
          Home
        </Link>
      </motion.header>

      <motion.div variants={item} className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Play
        </h1>
        <ExperimentsSection showIntro />
      </motion.div>

      <motion.div variants={item}>
        <SiteFooter />
      </motion.div>
    </motion.main>
  )
}

