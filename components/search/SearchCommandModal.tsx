'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  IconCheck,
  IconClose,
  IconExternalLink,
  IconFolderOpen,
  IconHome,
  IconLayers,
  IconMessage,
  IconPen,
  IconSparkles,
  IconThemeDark,
  IconThemeLight,
  IconThemeSystem,
  IconUser,
  IconVolumeOff,
  IconVolumeOn,
} from '@/components/site-icons'

import { useGradientWord } from '@/components/gradient-word-context'
import { EmailIcon, socialIconMap } from '@/components/social-icons'
import { useIsMobile } from '@/hooks/use-mobile'
import type { NotionWritingPost } from '@/lib/notion'
import { portfolioData } from '@/lib/portfolio-data'
import useSWR from 'swr'
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

const AboutIcon = IconUser
const ToolsIcon = IconLayers
const WritingIcon = IconPen

const staticItems: PaletteItem[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'Return to the main portfolio page',
    href: '/',
    keywords: 'home portfolio gage minamoto',
    group: 'Navigation',
    icon: IconHome,
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
]

const projectItems: PaletteItem[] = portfolioData.projects.map((project) => ({
  id: `project-${project.name}`,
  title: project.name,
  description: project.description,
  href: project.url ?? '/',
  keywords: `${project.name} ${project.description} ${project.status}`,
  group: 'Projects',
  external: Boolean(project.url),
  icon: project.favicon ? undefined : IconFolderOpen,
  iconSrc: project.favicon,
}))

const writingResourceItems: PaletteItem[] = [
  {
    id: 'early-design-resources',
    title: 'Early design resources',
    description: 'Curated reading list for people new to design',
    href: '/early-design',
    keywords:
      'early design resources reading list beginner starter craft interface',
    group: 'Writing',
    icon: WritingIcon,
  },
]

async function fetchWritingPosts(url: string): Promise<{ posts: NotionWritingPost[] }> {
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error ?? 'Failed to fetch writing posts')
  }

  return data
}

function buildWritingItems(posts: NotionWritingPost[]): PaletteItem[] {
  if (!Array.isArray(posts)) return []

  return posts.map((post) => ({
    id: `writing-${post.slug}`,
    title: post.title,
    description: 'Writing post',
    href: `/writing/${post.slug}`,
    keywords: `${post.title} ${post.slug} writing post blog article`,
    group: 'Writing',
    icon: WritingIcon,
  }))
}

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
    icon: socialIconMap[social.platform] ?? IconMessage,
  })),
]

const allItems = [
  ...staticItems,
  ...projectItems,
  ...writingResourceItems,
  ...quickActionItems,
]

function openHref(item: PaletteItem, router: ReturnType<typeof useRouter>) {
  if (!item.href) return

  if (item.href.startsWith('mailto:')) {
    window.location.href = item.href
    return
  }

  if (item.external) {
    window.open(item.href, '_blank', 'noopener,noreferrer')
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
        <IconExternalLink className="size-3.5 text-muted-foreground/60" />
      ) : item.active ? (
        <IconCheck className="size-3.5 text-primary" />
      ) : null}
    </CommandItem>
  )
}

function CommandListContent({ search, close }: { search: string; close: () => void }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { shaderEnabled, setShaderEnabled, soundEnabled, setSoundEnabled } = useGradientWord()
  const { data } = useSWR<{ posts: NotionWritingPost[] }>(
    '/api/writing',
    fetchWritingPosts,
    { revalidateOnFocus: false },
  )
  const writingItems = React.useMemo(
    () => buildWritingItems(data?.posts ?? []),
    [data?.posts],
  )

  const settingsItems = React.useMemo<PaletteItem[]>(
    () => [
      {
        id: 'theme-light',
        title: 'Light theme',
        description: 'Use the bright portfolio theme',
        keywords: 'theme light bright appearance display',
        group: 'Settings',
        icon: IconThemeLight,
        action: () => setTheme('light'),
        active: theme === 'light',
      },
      {
        id: 'theme-dark',
        title: 'Dark theme',
        description: 'Use the dark portfolio theme',
        keywords: 'theme dark night appearance display',
        group: 'Settings',
        icon: IconThemeDark,
        action: () => setTheme('dark'),
        active: theme === 'dark',
      },
      {
        id: 'theme-system',
        title: 'System theme',
        description: 'Follow the device theme',
        keywords: 'theme system auto device appearance display',
        group: 'Settings',
        icon: IconThemeSystem,
        action: () => setTheme('system'),
        active: theme === 'system',
      },
      {
        id: 'effects-toggle',
        title: shaderEnabled ? 'Effects on' : 'Effects off',
        description: 'Toggle gradient and cursor effects',
        keywords: 'effects shader gradient cursor animation motion toggle visual',
        group: 'Settings',
        icon: IconSparkles,
        action: () => setShaderEnabled(!shaderEnabled),
        active: shaderEnabled,
      },
      {
        id: 'sound-toggle',
        title: soundEnabled ? 'Sound on' : 'Sound off',
        description: 'Toggle interface click sounds',
        keywords: 'sound audio clicks mute volume toggle',
        group: 'Settings',
        icon: soundEnabled ? IconVolumeOn : IconVolumeOff,
        action: () => setSoundEnabled(!soundEnabled),
        active: soundEnabled,
      },
    ],
    [setShaderEnabled, setSoundEnabled, setTheme, shaderEnabled, soundEnabled, theme],
  )

  const visibleGroups = React.useMemo(() => {
    const groups = new Map<PaletteItem['group'], PaletteItem[]>()

    for (const item of [
      ...staticItems,
      ...projectItems,
      ...writingResourceItems,
      ...writingItems,
      ...settingsItems,
      ...quickActionItems,
    ]) {
      const current = groups.get(item.group) ?? []
      current.push(item)
      groups.set(item.group, current)
    }

    return groups
  }, [settingsItems, writingItems])

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

function SearchInputWithClear({
  search,
  setSearch,
  inputWrapperClassName,
}: {
  search: string
  setSearch: (value: string) => void
  inputWrapperClassName?: string
}) {
  return (
    <div className="relative w-full min-w-0 self-stretch">
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Find the good stuff"
        wrapperClassName={inputWrapperClassName}
        className="min-w-0 flex-1 pr-8"
      />
      {search.length > 0 && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setSearch('')}
          className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <IconClose className="size-3.5" />
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
                <IconClose className="size-4" />
              </button>
            </DrawerClose>
          </div>
          <Command className="flex w-full min-w-0 max-w-none flex-col items-stretch rounded-none border-t bg-background">
            <div className="w-full shrink-0 border-b px-4">
              <SearchInputWithClear
                search={search}
                setSearch={setSearch}
                inputWrapperClassName="h-12 border-0 px-0"
              />
            </div>
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
