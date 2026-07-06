'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Layers, Pen, UserCircle } from '@solar-icons/react'
import {
  Check,
  ExternalLink,
  FolderOpen,
  Gamepad2,
  Home,
  MessageSquare,
  Monitor,
  Moon,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'

import { useGradientWord } from '@/components/gradient-word-context'
import { EmailIcon, socialIconMap } from '@/components/social-icons'
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
  href?: string
  keywords: string
  group: 'Navigation' | 'Projects' | 'Writing' | 'Settings' | 'Social'
  external?: boolean
  icon?: React.ComponentType<{ className?: string }>
  iconSrc?: string
  action?: () => void
  active?: boolean
}

function AboutIcon({ className }: { className?: string }) {
  return <UserCircle size={16} weight="Bold" className={className} />
}

function ToolsIcon({ className }: { className?: string }) {
  return <Layers size={16} weight="Bold" className={className} />
}

function WritingIcon({ className }: { className?: string }) {
  return <Pen size={16} weight="Bold" className={className} />
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
    icon: AboutIcon,
  },
  {
    id: 'tools',
    title: 'Tools',
    description: 'Browse the tools and stack',
    href: '/tools',
    keywords: 'tools stack apps build productivity skills',
    group: 'Navigation',
    icon: ToolsIcon,
  },
  {
    id: 'writing',
    title: 'Writing',
    description: 'Open writing index',
    href: '/writing',
    keywords: 'writing posts articles blog essays',
    group: 'Navigation',
    icon: WritingIcon,
  },
  {
    id: 'play',
    title: 'Play',
    description: 'Open experiments archive',
    href: '/play',
    keywords: 'play experiments prototypes games archive gunny',
    group: 'Navigation',
    icon: Gamepad2,
  },
]

const projectItems: PaletteItem[] = portfolioData.projects.map((project) => ({
  id: `project-${project.name}`,
  title: project.name,
  description: project.description,
  href: project.url ?? '/',
  keywords: `${project.name} ${project.description} ${project.status}`,
  group: 'Projects',
  external: Boolean(project.url),
  icon: project.favicon ? undefined : FolderOpen,
  iconSrc: project.name === 'Guandan Rules' ? '/projects/guandian-rules-logo.svg' : project.favicon,
}))

const writingItems: PaletteItem[] = portfolioData.writing.map((post) => ({
  id: `writing-${post.slug}`,
  title: post.title,
  description: 'Writing post',
  href: `/writing/${post.slug}`,
  keywords: `${post.title} ${post.slug} writing post blog article`,
  group: 'Writing',
  icon: WritingIcon,
}))

const quickActionItems: PaletteItem[] = [
  {
    id: 'email',
    title: 'Email Gage',
    description: portfolioData.email ?? 'Start a conversation',
    href: `mailto:${portfolioData.email ?? 'info@gageminamoto.com'}`,
    keywords: 'email contact mail message',
    group: 'Social',
    external: true,
    icon: EmailIcon,
  },
  ...portfolioData.socials.map((social) => ({
    id: `social-${social.platform}`,
    title: social.label,
    description: `Open ${social.label}`,
    href: social.url,
    keywords: `${social.platform} ${social.label} social profile contact`,
    group: 'Social' as const,
    external: true,
    icon: socialIconMap[social.platform] ?? MessageSquare,
  })),
]

const allItems = [
  ...staticItems,
  ...projectItems,
  ...writingItems,
  ...quickActionItems,
]

function openHref(item: PaletteItem, router: ReturnType<typeof useRouter>) {
  if (!item.href) return

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
      <span className="flex size-8 shrink-0 items-center justify-center text-muted-foreground">
        {item.iconSrc ? (
          <Image src={item.iconSrc} alt="" width={20} height={20} className="size-5 rounded-[4px] object-contain" />
        ) : Icon ? (
          <Icon className="size-4" />
        ) : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">{item.title}</span>
      </span>
      {item.external ? (
        <ExternalLink className="size-3.5 text-muted-foreground/60" />
      ) : item.active ? (
        <Check className="size-3.5 text-primary" />
      ) : null}
    </CommandItem>
  )
}

function CommandListContent({ search, close }: { search: string; close: () => void }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { shaderEnabled, setShaderEnabled, soundEnabled, setSoundEnabled } = useGradientWord()

  const settingsItems = React.useMemo<PaletteItem[]>(
    () => [
      {
        id: 'theme-light',
        title: 'Light theme',
        description: 'Use the bright portfolio theme',
        keywords: 'theme light bright appearance display',
        group: 'Settings',
        icon: Sun,
        action: () => setTheme('light'),
        active: theme === 'light',
      },
      {
        id: 'theme-dark',
        title: 'Dark theme',
        description: 'Use the dark portfolio theme',
        keywords: 'theme dark night appearance display',
        group: 'Settings',
        icon: Moon,
        action: () => setTheme('dark'),
        active: theme === 'dark',
      },
      {
        id: 'theme-system',
        title: 'System theme',
        description: 'Follow the device theme',
        keywords: 'theme system auto device appearance display',
        group: 'Settings',
        icon: Monitor,
        action: () => setTheme('system'),
        active: theme === 'system',
      },
      {
        id: 'effects-toggle',
        title: shaderEnabled ? 'Effects on' : 'Effects off',
        description: 'Toggle gradient and cursor effects',
        keywords: 'effects shader gradient cursor animation motion toggle visual',
        group: 'Settings',
        icon: Sparkles,
        action: () => setShaderEnabled(!shaderEnabled),
        active: shaderEnabled,
      },
      {
        id: 'sound-toggle',
        title: soundEnabled ? 'Sound on' : 'Sound off',
        description: 'Toggle interface click sounds',
        keywords: 'sound audio clicks mute volume toggle',
        group: 'Settings',
        icon: soundEnabled ? Volume2 : VolumeX,
        action: () => setSoundEnabled(!soundEnabled),
        active: soundEnabled,
      },
    ],
    [setShaderEnabled, setSoundEnabled, setTheme, shaderEnabled, soundEnabled, theme],
  )

  const visibleGroups = React.useMemo(() => {
    const groups = new Map<PaletteItem['group'], PaletteItem[]>()

    for (const item of [...staticItems, ...projectItems, ...writingItems, ...settingsItems, ...quickActionItems]) {
      const current = groups.get(item.group) ?? []
      current.push(item)
      groups.set(item.group, current)
    }

    return groups
  }, [settingsItems])

  const handleSelect = React.useCallback(
    (item: PaletteItem) => {
      close()
      if (item.action) {
        item.action()
        return
      }
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
          <CommandGroup heading={heading}>
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
        placeholder="Find the good stuff"
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
    </CommandDialog>
  )
}

export { allItems as searchCommandItems }
