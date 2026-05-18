'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  BriefcaseBusiness,
  ExternalLink,
  FileText,
  FolderOpen,
  Home,
  Mail,
  MessageSquare,
  PenLine,
  Search,
  UserCircle,
  Wrench,
  X,
} from 'lucide-react'

import { useIsMobile } from '@/hooks/use-mobile'
import { portfolioData } from '@/lib/portfolio-data'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@/components/ui/drawer'

type SearchCommandModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type PaletteItem = {
  id: string
  title: string
  description: string
  href: string
  keywords: string
  group: 'Navigation' | 'Work' | 'Projects' | 'Writing' | 'Quick Actions'
  external?: boolean
  icon: React.ComponentType<{ className?: string }>
}

const staticItems: PaletteItem[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'Return to the main portfolio page',
    href: '/',
    keywords: 'home portfolio gage minamoto',
    group: 'Navigation',
    icon: Home,
  },
  {
    id: 'about',
    title: 'About',
    description: 'Read more about Gage',
    href: '/about',
    keywords: 'about bio profile experience hobbies speaking learning',
    group: 'Navigation',
    icon: UserCircle,
  },
  {
    id: 'tools',
    title: 'Tools',
    description: 'Browse the tools and stack',
    href: '/tools',
    keywords: 'tools stack apps build productivity skills',
    group: 'Navigation',
    icon: Wrench,
  },
  {
    id: 'writing',
    title: 'Writing',
    description: 'Open writing index',
    href: '/writing',
    keywords: 'writing posts articles blog essays',
    group: 'Navigation',
    icon: PenLine,
  },
]

const workItems: PaletteItem[] = portfolioData.workHistory.map((item) => ({
  id: `work-${item.company}`,
  title: item.company,
  description: `${item.role} · ${item.period}`,
  href: item.url ?? '/about',
  keywords: `${item.company} ${item.role} ${item.period} ${item.description}`,
  group: 'Work',
  external: Boolean(item.url),
  icon: BriefcaseBusiness,
}))

const projectItems: PaletteItem[] = portfolioData.projects.map((project) => ({
  id: `project-${project.name}`,
  title: project.name,
  description: project.description,
  href: project.url ?? '/',
  keywords: `${project.name} ${project.description} ${project.status}`,
  group: 'Projects',
  external: Boolean(project.url),
  icon: FolderOpen,
}))

const writingItems: PaletteItem[] = portfolioData.writing.map((post) => ({
  id: `writing-${post.slug}`,
  title: post.title,
  description: 'Writing post',
  href: `/writing/${post.slug}`,
  keywords: `${post.title} ${post.slug} writing post blog article`,
  group: 'Writing',
  icon: FileText,
}))

const quickActionItems: PaletteItem[] = [
  {
    id: 'email',
    title: 'Email Gage',
    description: portfolioData.email ?? 'Start a conversation',
    href: `mailto:${portfolioData.email ?? 'info@gageminamoto.com'}`,
    keywords: 'email contact mail message',
    group: 'Quick Actions',
    external: true,
    icon: Mail,
  },
  ...portfolioData.socials.map((social) => ({
    id: `social-${social.platform}`,
    title: social.label,
    description: `Open ${social.label}`,
    href: social.url,
    keywords: `${social.platform} ${social.label} social profile contact`,
    group: 'Quick Actions' as const,
    external: true,
    icon: MessageSquare,
  })),
]

const allItems = [
  ...staticItems,
  ...workItems,
  ...projectItems,
  ...writingItems,
  ...quickActionItems,
]

function openHref(item: PaletteItem, router: ReturnType<typeof useRouter>) {
  if (item.href.startsWith('mailto:') || item.external) {
    window.location.href = item.href
    return
  }

  router.push(item.href)
}

function PaletteItemRow({ item, onSelect }: { item: PaletteItem; onSelect: () => void }) {
  const Icon = item.icon

  return (
    <CommandItem
      value={`${item.title} ${item.description} ${item.keywords}`}
      onSelect={onSelect}
      className="group min-h-14 cursor-pointer gap-3 rounded-lg px-3 py-2"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">{item.title}</span>
        <span className="block truncate text-xs text-muted-foreground">{item.description}</span>
      </span>
      {item.external ? (
        <ExternalLink className="size-3.5 text-muted-foreground/60" />
      ) : (
        <CommandShortcut className="opacity-0 transition-opacity group-data-[selected=true]:opacity-100">
          Jump to ↩
        </CommandShortcut>
      )}
    </CommandItem>
  )
}

function CommandListContent({ search, close }: { search: string; close: () => void }) {
  const router = useRouter()
  const visibleGroups = React.useMemo(() => {
    const groups = new Map<PaletteItem['group'], PaletteItem[]>()

    for (const item of allItems) {
      const current = groups.get(item.group) ?? []
      current.push(item)
      groups.set(item.group, current)
    }

    return groups
  }, [])

  const handleSelect = React.useCallback(
    (item: PaletteItem) => {
      close()
      openHref(item, router)
    },
    [close, router],
  )

  return (
    <CommandList
      data-vaul-no-drag=""
      className={cn(
        'h-[clamp(320px,var(--cmdk-list-height,320px),640px)] max-h-none scroll-py-2 overscroll-contain px-2 py-2 transition-[height] duration-150 ease-out',
        'motion-reduce:transition-none',
      )}
    >
      <CommandEmpty>No results found.</CommandEmpty>
      {Array.from(visibleGroups.entries()).map(([heading, items], index) => (
        <React.Fragment key={heading}>
          {index > 0 && <CommandSeparator className="my-1" />}
          <CommandGroup heading={search ? heading : heading === 'Quick Actions' ? 'Quick Actions' : heading}>
            {items.map((item) => (
              <PaletteItemRow key={item.id} item={item} onSelect={() => handleSelect(item)} />
            ))}
          </CommandGroup>
        </React.Fragment>
      ))}
    </CommandList>
  )
}

function SearchInputWithClear({ search, setSearch }: { search: string; setSearch: (value: string) => void }) {
  return (
    <div className="relative">
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Search Gage's portfolio"
        className="pr-8"
      />
      {search.length > 0 && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setSearch('')}
          className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

export function SearchCommandModal({ open, onOpenChange }: SearchCommandModalProps) {
  const [search, setSearch] = React.useState('')
  const isMobile = useIsMobile()

  React.useEffect(() => {
    if (!open) {
      setSearch('')
    }
  }, [open])

  const close = React.useCallback(() => onOpenChange(false), [onOpenChange])

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
        <DrawerContent className="h-[85dvh] rounded-t-3xl px-0 pb-3">
          <div className="flex items-center justify-between px-4 pb-3 pt-4 text-left">
            <div>
              <DrawerTitle className="text-base">Search</DrawerTitle>
              <DrawerDescription>Find pages, projects, writing, and links.</DrawerDescription>
            </div>
            <DrawerClose asChild>
              <button
                type="button"
                aria-label="Close search"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </DrawerClose>
          </div>
          <Command className="rounded-none border-t bg-background">
            <SearchInputWithClear search={search} setSearch={setSearch} />
            <CommandListContent search={search} close={close} />
          </Command>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      title="Search"
      description="Find pages, projects, writing, and links."
      className="max-w-2xl rounded-2xl border-border/80 shadow-2xl"
    >
      <SearchInputWithClear search={search} setSearch={setSearch} />
      <CommandListContent search={search} close={close} />
      <div className="flex items-center justify-between border-t bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-2"><Search className="size-3.5" /> Search everything</span>
        <span className="flex items-center gap-1"><kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd> to close</span>
      </div>
    </CommandDialog>
  )
}

export { allItems as searchCommandItems }
