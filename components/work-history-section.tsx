"use client"

import { useState } from "react"
import { HamburgerMenu } from "@solar-icons/react"
import { FolderOpen } from "lucide-react"
import { WorkHistoryAccordion } from "@/components/work-history-accordion"
import { WorkHistoryFolderTabs } from "@/components/work-history-folder-tabs"
import type { WorkHistoryItem } from "@/lib/portfolio-data"

export function WorkHistorySection({ items }: { items: WorkHistoryItem[] }) {
  const [view, setView] = useState<"accordion" | "folders">("accordion")

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Work History</h2>
        <button
          onClick={() =>
            setView(view === "accordion" ? "folders" : "accordion")
          }
          className="cursor-pointer rounded-md p-1 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
          aria-label={
            view === "accordion"
              ? "Switch to folder tabs view"
              : "Switch to accordion view"
          }
        >
          {view === "accordion" ? (
            <FolderOpen size={14} />
          ) : (
            <HamburgerMenu size={14} weight="Bold" />
          )}
        </button>
      </div>

      {view === "accordion" ? (
        <WorkHistoryAccordion items={items} />
      ) : (
        <WorkHistoryFolderTabs items={items} />
      )}
    </section>
  )
}
