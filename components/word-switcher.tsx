"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface WordSwitcherProps {
  options: string[]
}

export function WordSwitcher({ options }: WordSwitcherProps) {
  const [selected, setSelected] = useState(options[0])
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center gap-0.5 rounded-md px-1 -mx-1 text-foreground underline decoration-dashed decoration-muted-foreground/50 underline-offset-[3px] transition-colors hover:decoration-foreground cursor-pointer"
        >
          {selected}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto min-w-[120px] p-1"
      >
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              setSelected(option)
              setOpen(false)
            }}
            className={`flex w-full rounded-sm px-2 py-1.5 text-sm transition-colors cursor-pointer ${
              option === selected
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {option}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
