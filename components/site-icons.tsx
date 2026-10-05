import type { FC, SVGProps } from "react"
import { cn } from "@/lib/utils"
import {
  IconAtSignFill18,
  IconCheckFill18,
  IconChevronDownFill18,
  IconChevronLeftFill18,
  IconChevronRightFill18,
  IconChevronUpFill18,
  IconCircleInfoFill18,
  IconClipboardFill18,
  IconDarkLightFill18,
  IconEnvelopeFill18,
  IconFileContentFill18,
  IconFolderOpenFill18,
  IconHouse2Fill18,
  IconLayers3Fill18,
  IconLaptopMobileFill18,
  IconLightbulb3Fill18,
  IconLinkFill18,
  IconMagnifierFill18,
  IconPenWriting6Fill18,
  IconPinTackFill18,
  IconSparkle3Fill18,
  IconSquareDottedArrowBottomRightFill18,
  IconStarFill18,
  IconSuitcase3Fill18,
  IconTextTool2Fill18,
  IconUserFill18,
  IconMsgsFill18,
  IconVolumeFill18,
  IconVolumeUpFill18,
  IconWindowExpandBottomRightFill18,
  IconXmarkFill18,
} from "nucleo-ui-essential-fill-18"
import { IconStarFill12 } from "nucleo-ui-essential-fill-12"

export type SiteIconProps = SVGProps<SVGSVGElement> & {
  className?: string
}

function siteIcon(
  NucleoIcon: FC<{ className?: string; size?: number | string } & SVGProps<SVGSVGElement>>,
) {
  return function SiteIcon({ className, ...props }: SiteIconProps) {
    return (
      <NucleoIcon
        className={cn("inline-block shrink-0", className)}
        aria-hidden={props["aria-hidden"] ?? true}
        {...props}
      />
    )
  }
}

/** Navigation & sections */
export const IconHome = siteIcon(IconHouse2Fill18)
export const IconUser = siteIcon(IconUserFill18)
export const IconLayers = siteIcon(IconLayers3Fill18)
export const IconPen = siteIcon(IconPenWriting6Fill18)
export const IconSuitcase = siteIcon(IconSuitcase3Fill18)
export const IconPin = siteIcon(IconPinTackFill18)
export const IconChevronLeft = siteIcon(IconChevronLeftFill18)
export const IconChevronRight = siteIcon(IconChevronRightFill18)
export const IconChevronDown = siteIcon(IconChevronDownFill18)
export const IconChevronUp = siteIcon(IconChevronUpFill18)
export const IconSectionLink = siteIcon(IconChevronRightFill18)

/** Page actions & theme */
export const IconLink = siteIcon(IconLinkFill18)
export const IconCheck = siteIcon(IconCheckFill18)
export const IconSearch = siteIcon(IconMagnifierFill18)
export const IconInfo = siteIcon(IconCircleInfoFill18)
export const IconThemeLight = siteIcon(IconLightbulb3Fill18)
export const IconThemeDark = siteIcon(IconDarkLightFill18)
export const IconThemeSystem = siteIcon(IconLaptopMobileFill18)
export const IconSparkles = siteIcon(IconSparkle3Fill18)
export const IconVolumeOn = siteIcon(IconVolumeUpFill18)
export const IconVolumeOff = siteIcon(IconVolumeFill18)
export const IconMessage = siteIcon(IconMsgsFill18)

/** Content & UI */
export const IconFolderOpen = siteIcon(IconFolderOpenFill18)
export const IconFileText = siteIcon(IconFileContentFill18)
export const IconExternalLink = siteIcon(IconWindowExpandBottomRightFill18)
export const IconArrowUpRight = siteIcon(IconSquareDottedArrowBottomRightFill18)
export const IconCopy = siteIcon(IconClipboardFill18)
export const IconClose = siteIcon(IconXmarkFill18)
export const IconEmail = siteIcon(IconEnvelopeFill18)
export const IconAtSign = siteIcon(IconAtSignFill18)

/** Project badges (12px artboard, sized with CSS) */
export const IconStarBadge = siteIcon(IconStarFill12)
export const IconBuildingBadge = siteIcon(IconTextTool2Fill18)
