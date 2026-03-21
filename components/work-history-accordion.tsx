"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import type { WorkHistoryItem } from "@/lib/portfolio-data"

export function WorkHistoryAccordion({ items }: { items: WorkHistoryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <div key={item.company}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="cursor-pointer -mx-2 flex w-[calc(100%+1rem)] items-center gap-2 rounded-md px-2 py-3 text-left transition-colors duration-150 ease-out hover:bg-muted/40"
          >
            {item.icon ? (
              <img
                src={item.icon}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 shrink-0 rounded-sm object-contain"
              />
            ) : (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-muted text-[10px] font-medium text-muted-foreground">
                {item.company.charAt(0)}
              </span>
            )}
            <span className="shrink-0 font-medium text-foreground">{item.company}</span>
            <span className="min-w-0 truncate text-sm text-muted-foreground">{item.role}</span>
            <span className="ml-auto shrink-0 text-sm text-muted-foreground">{item.period}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
              style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
              aria-hidden="true"
            />
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  height: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
                  opacity: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
                }}
                className="overflow-hidden"
              >
                <div className="px-2 pt-1 pb-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {i < items.length - 1 && (
            <hr className="border-t border-border/50" />
          )}
        </div>
      ))}
    </div>
  )
}
