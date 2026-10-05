"use client"

import { forwardRef } from "react"
import {
  AltArrowDown,
  AltArrowLeft,
  AltArrowRight,
  AltArrowUp,
  ArrowDown as SolarArrowDown,
  ArrowLeft as SolarArrowLeft,
  ArrowRight as SolarArrowRight,
  ArrowRightUp,
  ArrowUp as SolarArrowUp,
  ChatRound,
  CloseCircle,
  Copy as SolarCopy,
  FileText as SolarFileText,
  FolderOpen as SolarFolderOpen,
  Home as SolarHome,
  InfoCircle,
  LinkMinimalistic,
  Magnifer,
  MenuDots,
  Monitor as SolarMonitor,
  Moon as SolarMoon,
  Record,
  Restart,
  Sidebar,
  SquareArrowRightUp,
  StarsMinimalistic,
  Sun as SolarSun,
  VolumeCross,
  VolumeLoud,
  type IconProps,
} from "@solar-icons/react"

import { cn } from "@/lib/utils"

type FilledIconProps = Omit<React.ComponentPropsWithoutRef<"svg">, "color"> & {
  size?: string | number
}

type SolarIcon = React.ComponentType<IconProps & { ref?: React.Ref<SVGSVGElement> }>

function filled(IconComponent: SolarIcon) {
  const Filled = forwardRef<SVGSVGElement, FilledIconProps>(function FilledIcon(
    { strokeWidth: _strokeWidth, ...props },
    ref,
  ) {
    return <IconComponent ref={ref} weight="Bold" {...props} />
  })
  Filled.displayName = "FilledIcon"
  return Filled
}

function glyph({
  viewBox,
  children,
  displayName,
}: {
  viewBox: string
  children: React.ReactNode
  displayName: string
}) {
  const Glyph = forwardRef<SVGSVGElement, FilledIconProps>(function Glyph(
    { size, className, strokeWidth: _strokeWidth, ...props },
    ref,
  ) {
    return (
      <svg
        ref={ref}
        viewBox={viewBox}
        fill="currentColor"
        width={size}
        height={size}
        className={className}
        aria-hidden={props["aria-hidden"] ?? true}
        {...props}
      >
        {children}
      </svg>
    )
  })
  Glyph.displayName = displayName
  return Glyph
}

export const Search = filled(Magnifer)
export const SearchIcon = Search

export const ChevronLeft = filled(AltArrowLeft)
export const ChevronLeftIcon = ChevronLeft
export const ChevronRight = filled(AltArrowRight)
export const ChevronRightIcon = ChevronRight
export const ChevronDown = filled(AltArrowDown)
export const ChevronDownIcon = ChevronDown
export const ChevronUp = filled(AltArrowUp)
export const ChevronUpIcon = ChevronUp

export const X = filled(CloseCircle)
export const XIcon = X

export const ArrowUpRight = filled(ArrowRightUp)
export const ArrowDown = filled(SolarArrowDown)
export const ArrowUp = filled(SolarArrowUp)
export const ArrowLeft = filled(SolarArrowLeft)
export const ArrowRight = filled(SolarArrowRight)

export const Info = filled(InfoCircle)
export const Copy = filled(SolarCopy)
export const ExternalLink = filled(SquareArrowRightUp)
export const FileText = filled(SolarFileText)
export const Link = filled(LinkMinimalistic)

export const Moon = filled(SolarMoon)
export const Sun = filled(SolarSun)
export const Monitor = filled(SolarMonitor)
export const Sparkles = filled(StarsMinimalistic)
export const Volume2 = filled(VolumeLoud)
export const VolumeX = filled(VolumeCross)

export const Home = filled(SolarHome)
export const FolderOpen = filled(SolarFolderOpen)
export const MessageSquare = filled(ChatRound)

export const Check = glyph({
  displayName: "Check",
  viewBox: "0 0 24 24",
  children: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
    />
  ),
})
export const CheckIcon = Check

export const CircleIcon = filled(Record)

export const MoreHorizontal = filled(MenuDots)
export const MoreHorizontalIcon = MoreHorizontal

export const MinusIcon = glyph({
  displayName: "MinusIcon",
  viewBox: "0 0 24 24",
  children: <rect x="4" y="10.75" width="16" height="2.5" rx="1.25" />,
})

export const GripVerticalIcon = forwardRef<SVGSVGElement, FilledIconProps>(
  function GripVerticalIcon({ className, ...props }, ref) {
    return <MoreHorizontal ref={ref} className={cn("rotate-90", className)} {...props} />
  },
)

export const PanelLeftIcon = filled(Sidebar)
export const Loader2Icon = filled(Restart)

export const GitBranch = glyph({
  displayName: "GitBranch",
  viewBox: "0 0 16 16",
  children: (
    <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
  ),
})

export const GitMerge = glyph({
  displayName: "GitMerge",
  viewBox: "0 0 16 16",
  children: (
    <path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .015V3.25Z" />
  ),
})

export const GitPullRequest = glyph({
  displayName: "GitPullRequest",
  viewBox: "0 0 16 16",
  children: (
    <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
  ),
})
