"use client"

import { CopyLinkButton } from "@/components/copy-link-button"
import { ThemeToggle } from "@/components/theme-toggle"

export function PageActions() {
  return (
    <div className="flex items-center gap-1" aria-label="Page actions">
      <CopyLinkButton iconClassName="translate-x-px" />
      <div className="flex h-8 w-8 items-center justify-center">
        <ThemeToggle iconClassName="translate-x-px" />
      </div>
    </div>
  )
}
