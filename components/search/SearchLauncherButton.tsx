'use client'

import { Search } from 'lucide-react'

import { useCommandK } from '@/contexts/CommandKContext'
import { cn } from '@/lib/utils'

export function SearchLauncherButton({ className }: { className?: string }) {
  const { openSearch } = useCommandK()

  return (
    <button
      type="button"
      onClick={openSearch}
      className={cn(
        'group flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur transition-[background-color,border-color,color,transform] hover:border-border hover:bg-muted/60 hover:text-foreground active:scale-[0.98]',
        className,
      )}
      aria-label="Open search"
    >
      <Search className="size-3.5" />
      <span>Search</span>
      <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
        ⌘K
      </kbd>
    </button>
  )
}
