"use client"

import { CopyLinkButton } from "@/components/copy-link-button"
import { ThemeToggle } from "@/components/theme-toggle"

export function ArticleActions() {
  return (
    <div className="flex items-center gap-1" aria-label="Article actions">
      <CopyLinkButton />
      <div className="flex h-8 w-8 items-center justify-center"><ThemeToggle /></div>
    </div>
  )
}
