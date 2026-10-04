"use client"

import { Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DirectionPortfolio } from "@/components/early-design/direction-portfolio"
import { DirectionEditorial } from "@/components/early-design/direction-editorial"
import {
  parseEarlyDesignView,
  type EarlyDesignView,
} from "@/lib/early-design-resources"

function EarlyDesignPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = parseEarlyDesignView(searchParams.get("view"))

  const onViewChange = useCallback(
    (next: EarlyDesignView) => {
      const params = new URLSearchParams(searchParams.toString())
      if (next === "a") {
        params.delete("view")
      } else {
        params.set("view", next)
      }
      const query = params.toString()
      router.replace(query ? `/early-design?${query}` : "/early-design", {
        scroll: false,
      })
    },
    [router, searchParams],
  )

  if (view === "b") {
    return <DirectionEditorial view={view} onViewChange={onViewChange} />
  }

  return <DirectionPortfolio view={view} onViewChange={onViewChange} />
}

function PageFallback() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
    >
      <p className="text-sm text-muted-foreground">Loading…</p>
    </main>
  )
}

export default function EarlyDesignPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <EarlyDesignPageInner />
    </Suspense>
  )
}
