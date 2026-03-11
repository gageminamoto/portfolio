"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Kbd } from "@/components/ui/kbd"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-8 w-8" />
  }

  return (
    <div className="flex items-center gap-1">
      <Kbd className="hidden md:inline-flex">T</Kbd>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Moon className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
