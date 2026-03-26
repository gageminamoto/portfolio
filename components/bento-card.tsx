"use client"

import { cn } from "@/lib/utils"
import { useGradientWord } from "@/components/gradient-word-context"
import { useTheme } from "next-themes"

const THEME_BORDER_COLORS: Record<string, { light: string; dark: string }> = {
  software:    { light: "oklch(0.75 0.12 250 / 0.35)", dark: "oklch(0.65 0.15 250 / 0.3)" },
  experiences: { light: "oklch(0.75 0.12 330 / 0.35)", dark: "oklch(0.65 0.15 330 / 0.3)" },
  tools:       { light: "oklch(0.75 0.12 145 / 0.35)", dark: "oklch(0.65 0.15 145 / 0.3)" },
}

export function BentoCard({
  children,
  className,
  label,
  interactive = true,
}: {
  children: React.ReactNode
  className?: string
  label?: string
  interactive?: boolean
}) {
  const { activeWord } = useGradientWord()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const themeColors = THEME_BORDER_COLORS[activeWord] ?? THEME_BORDER_COLORS.software
  const hoverBorderColor = isDark ? themeColors.dark : themeColors.light

  return (
    <div
      className={cn(
        "group/bento flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 md:p-6",
        "transition-[border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
        className
      )}
      style={interactive ? { "--bento-hover-border": hoverBorderColor } as React.CSSProperties : undefined}
      onMouseEnter={(e) => {
        if (interactive) e.currentTarget.style.borderColor = hoverBorderColor
      }}
      onMouseLeave={(e) => {
        if (interactive) e.currentTarget.style.borderColor = ""
      }}
    >
      {label && (
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </h2>
      )}
      {children}
    </div>
  )
}
