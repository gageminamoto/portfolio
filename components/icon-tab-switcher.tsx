"use client"

import { motion, LayoutGroup } from "framer-motion"
import { Icon } from "@iconify/react"

export interface IconTab {
  id: string
  label: string
  icon: string
}

const spring = {
  type: "spring" as const,
  duration: 0.8,
  bounce: 0.15,
}

export function IconTabSwitcher({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: IconTab[]
  activeTab: string
  onTabChange: (id: string) => void
}) {
  return (
    <LayoutGroup>
      <div className="flex items-center gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent px-3 py-2 text-sm font-medium outline-none"
              layout
              transition={spring}
              style={{
                color: isActive
                  ? "var(--foreground)"
                  : "var(--muted-foreground)",
              }}
              aria-pressed={isActive}
              aria-label={tab.label}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={spring}
                  style={{ zIndex: 0 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-2">
                <Icon icon={tab.icon} className="h-5 w-5 shrink-0" />
                {isActive && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    transition={{ ...spring, opacity: { duration: 0.2, delay: 0.1 } }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </span>
            </motion.button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
